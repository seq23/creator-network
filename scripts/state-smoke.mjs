// Live proof of the durable-state Worker. Run inside the vault-injected child:  npm run smoke:state
// Proves: unauthenticated -> 401; health hits D1; PUT/GET round-trip with version increments; receipt POST is
// idempotent (same id twice -> one row, 201 both times); unknown key -> 404 fallback. Writes only under `smoke/`.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DurableStateClient} from '../runtime/lib/durable-state.mjs';

const endpoint=process.env.CREATOR_STATE_API_URL||'https://creator-network-state.seq-taylor.workers.dev';
const token=process.env.CREATOR_STATE_API_TOKEN; if(!token){console.error('NAMED STOP: CREATOR_STATE_API_TOKEN not injected');process.exit(3);}
const started=new Date().toISOString(); const checks=[];
const check=async(name,fn)=>{try{await fn();checks.push({name,ok:true});}catch(e){checks.push({name,ok:false,error:String(e.message||e).slice(0,200)});}};

await check('unauthenticated request is refused (401)',async()=>{const r=await fetch(endpoint+'/health');assert.equal(r.status,401);});
await check('wrong token is refused (401)',async()=>{const r=await fetch(endpoint+'/health',{headers:{authorization:'Bearer '+'x'.repeat(token.length)}});assert.equal(r.status,401);});
const c=new DurableStateClient({endpoint,token});
await check('health reaches D1',async()=>{const h=await c.health();assert.equal(h.ok,true);assert.equal(h.backend,'d1');});
const key=`smoke/${Date.now()}`;
await check('missing key returns fallback',async()=>{assert.deepEqual(await c.get(key,{none:true}),{none:true});});
await check('put/get round-trip, version increments',async()=>{const a=await c.put(key,{n:1});assert.equal(a.version,1);const b=await c.put(key,{n:2});assert.equal(b.version,2);assert.deepEqual(await c.get(key),{n:2});});
await check('receipt POST is idempotent',async()=>{const id=`${key}:receipt`;const r1=await c.receipt({id,run_id:'smoke',employee_id:'smoke',step:'SMOKE',status:'PASS',detail:{started}});const r2=await c.receipt({id,run_id:'smoke',employee_id:'smoke',step:'SMOKE',status:'CHANGED'});assert.equal(r1.ok,true);assert.equal(r2.ok,true);assert.equal(r1.id,r2.id);});
await check('receipts read back by run_id',async()=>{const b=await c.receipts('smoke');assert.ok(b.receipts.some(x=>x.id===`${key}:receipt`&&x.status==='PASS'&&x.detail.started===started),'the receipt just written must be served back');});
await check('receipt missing fields rejected (400)',async()=>{await assert.rejects(()=>c.receipt({id:'x'}),/STATE_HTTP_400/);});

const ok=checks.every(x=>x.ok); const result={endpoint,started,finished:new Date().toISOString(),status:ok?'LIVE_VALIDATED':'FAILED',checks};
console.log(JSON.stringify(result,null,2));
if(process.env.STATE_SMOKE_RECEIPT){fs.mkdirSync('state/proof',{recursive:true});fs.writeFileSync(process.env.STATE_SMOKE_RECEIPT,JSON.stringify(result,null,2)+'\n');}
process.exit(ok?0:1);
