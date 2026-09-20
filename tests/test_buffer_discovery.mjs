import assert from 'node:assert/strict';
import fs from 'node:fs';
import {BufferClient} from '../distribution/buffer/client.mjs';
import {summarizeCreator, verifyIsolation, channelEnvMap, platformFor, assertNotSecretShaped} from '../distribution/lib/discovery.mjs';

let passed=0; const ok=async(name,fn)=>{await fn(); passed++; console.log(`PASS ${name}`);};
const id=n=>n.toString(16).padStart(24,'0');
const account=(n,email)=>({id:id(n),email,organizations:[{id:id(n+100),name:`org${n}`,ownerEmail:email,channelCount:2}]});
const chans=(n)=>[{id:id(n+200),service:'instagram',type:'profile',name:`ig${n}`,organizationId:id(n+100),isDisconnected:false,isLocked:false,isQueuePaused:false},{id:id(n+300),service:'twitter',name:`x${n}`,organizationId:id(n+100),isDisconnected:true,isLocked:false,isQueuePaused:false}];

// The client only ever sends queries during discovery — a mutation string would be a Phase 1 violation.
await ok('discovery queries are read-only', async()=>{
  const sent=[]; const fetchImpl=async(_u,init)=>{sent.push(JSON.parse(init.body).query); return {ok:true,json:async()=>({data:{account:account(1,'marcus@aplayermode.com'),channels:chans(1)}})};};
  const c=new BufferClient({apiKey:'k',fetchImpl}); await c.account(); await c.channels({organizationId:id(101)});
  assert.equal(sent.length,2); for(const q of sent){ assert.match(q,/^query /); assert.doesNotMatch(q,/mutation/i); }
});

await ok('identity verified when the key sees the creator\'s own account', ()=>{
  const r=summarizeCreator({creatorId:'marcus_vale',account:account(1,'marcus@aplayermode.com'),channelsByOrg:{[id(101)]:chans(1)}});
  assert.equal(r.identity_verified,true); assert.equal(r.channels.length,2); assert.equal(r.postable_channels,1); assert.equal(r.channels[1].platform,'twitter');
});

await ok('identity mismatch is reported, not hidden', ()=>{
  const r=summarizeCreator({creatorId:'nia_brooks',account:account(2,'someone-else@example.com'),channelsByOrg:{}});
  assert.equal(r.identity_verified,false); assert.equal(verifyIsolation([r]).identity_ok,false);
});

await ok('isolation passes for four disjoint accounts', ()=>{
  const recs=[['marcus_vale','marcus@aplayermode.com',1],['nia_brooks','nia@approvalprep.com',2],['camille_rose','camille@weddingchecklistpdf.com',3],['maya_reyes','maya@theindustryguides.com',4]]
    .map(([c,e,n])=>summarizeCreator({creatorId:c,account:account(n,e),channelsByOrg:{[id(n+100)]:chans(n)}}));
  const v=verifyIsolation(recs); assert.equal(v.isolated,true); assert.equal(v.identity_ok,true); assert.deepEqual(v.collisions,[]);
});

await ok('a channel visible to two creators fails isolation', ()=>{
  const a=summarizeCreator({creatorId:'marcus_vale',account:account(1,'marcus@aplayermode.com'),channelsByOrg:{[id(101)]:chans(1)}});
  const b=summarizeCreator({creatorId:'nia_brooks',account:account(2,'nia@approvalprep.com'),channelsByOrg:{[id(102)]:chans(1)}});
  const v=verifyIsolation([a,b]); assert.equal(v.isolated,false); assert.equal(v.collisions[0].kind,'channel'); assert.deepEqual(v.collisions[0].creators,['marcus_vale','nia_brooks']);
});

await ok('a shared account id fails isolation even with disjoint channels', ()=>{
  const a=summarizeCreator({creatorId:'marcus_vale',account:account(1,'marcus@aplayermode.com'),channelsByOrg:{}});
  const b=summarizeCreator({creatorId:'nia_brooks',account:{...account(1,'nia@approvalprep.com'),organizations:[]},channelsByOrg:{}});
  assert.equal(verifyIsolation([a,b]).collisions.some(c=>c.kind==='account'),true);
});

await ok('channel env map skips disconnected/locked channels and names X correctly', ()=>{
  const r=summarizeCreator({creatorId:'maya_reyes',account:account(4,'maya@theindustryguides.com'),channelsByOrg:{[id(104)]:[...chans(4),{id:id(999),service:'x',name:'live-x',organizationId:id(104),isDisconnected:false,isLocked:false}]}});
  assert.deepEqual(channelEnvMap(r),{BUFFER_CHANNEL_MAYA_REYES_INSTAGRAM:id(204),BUFFER_CHANNEL_MAYA_REYES_X:id(999)});
  assert.equal(platformFor('X'),'twitter');
});

await ok('persisted record refuses anything key-shaped, including nested', ()=>{
  const leak={...account(1,'marcus@aplayermode.com'),email:'a'.repeat(40)};
  assert.throws(()=>summarizeCreator({creatorId:'marcus_vale',account:leak,channelsByOrg:{}}),/DISCOVERY_OUTPUT_SECRET_SHAPED/);
  assert.throws(()=>assertNotSecretShaped('x',{deep:[{v:'B'.repeat(43)}]}),/DISCOVERY_OUTPUT_SECRET_SHAPED:x\.deep\[0\]\.v/);
  assert.doesNotThrow(()=>assertNotSecretShaped('ids',{a:id(5),b:[id(6)]}));
});

// If a live discovery has been persisted, it must carry only ids — never a credential. Absent file = not yet run, not a failure.
await ok('persisted discovery file (if present) is id-only', ()=>{
  const p='distribution/config/buffer-discovery.json'; if(!fs.existsSync(p)) return;
  const d=JSON.parse(fs.readFileSync(p,'utf8')); assertNotSecretShaped('file',d); assert.ok(['DISCOVERED','DISCOVERED_NO_CHANNELS','BLOCKED','ISOLATION_FAILURE'].includes(d.status));
});

console.log(`buffer discovery tests: ${passed}/9 PASS`);
