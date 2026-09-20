// Phase 1 — Buffer READ-ONLY discovery. Runs inside the vault-injected child:
//   python3 scripts/vault-exec.py -- node scripts/buffer-discovery.mjs
// Queries `account` and `channels` for each creator, verifies the key sees the creator's own account, verifies
// no id is shared between creators, and persists IDs only. It never calls a mutation and never prints a key.
import fs from 'node:fs';
import {BufferClient} from '../distribution/buffer/client.mjs';
import {CREATORS, summarizeCreator, verifyIsolation, channelEnvMap, assertNotSecretShaped} from '../distribution/lib/discovery.mjs';
import {atomicWriteJson} from '../launch/lib/state.mjs';

const OUT_JSON='distribution/config/buffer-discovery.json', OUT_MD='docs/BUFFER_DISCOVERY_REPORT.md';
const records=[], failures=[];
for(const [creatorId,meta] of Object.entries(CREATORS)){
  const apiKey=process.env[meta.credential_env];
  if(!apiKey){ failures.push({creator_id:creatorId,error:`CREDENTIAL_NOT_INJECTED:${meta.credential_env}`}); continue; }
  try{
    const client=new BufferClient({apiKey});
    const account=await client.account();
    const channelsByOrg={};
    for(const org of account.organizations||[]) channelsByOrg[org.id]=await client.channels({organizationId:org.id});
    records.push(summarizeCreator({creatorId,account,channelsByOrg}));
  }catch(e){ failures.push({creator_id:creatorId,error:String(e.message||e).slice(0,200)}); }
}
const isolation=verifyIsolation(records);
const status=failures.length?'BLOCKED':(!isolation.isolated||!isolation.identity_ok)?'ISOLATION_FAILURE':records.every(r=>r.postable_channels>0)?'DISCOVERED':'DISCOVERED_NO_CHANNELS';
const result={discovered_at:new Date().toISOString(),status,api:'https://api.buffer.com (GraphQL, account-scoped key)',isolation,failures,creators:records,channel_env:Object.assign({},...records.map(channelEnvMap)),org_env:Object.fromEntries(records.map(r=>[`BUFFER_ORG_ID_${r.creator_id.toUpperCase()}`,r.organizations[0]?.id||null]))};
assertNotSecretShaped('result',result);
atomicWriteJson(OUT_JSON,result);

const lines=[`# Buffer Discovery Report`,``,`Generated: ${result.discovered_at}  ·  Status: **${status}**  ·  Read-only: no mutation was sent.`,``,
 `| Creator | Key sees account | Identity | Orgs | Channels (postable) | Services |`,`|---|---|---|---|---|---|`,
 ...records.map(r=>`| ${r.creator_id} | ${r.account_email} | ${r.identity_verified?'VERIFIED':'MISMATCH'} | ${r.organizations.length} | ${r.channels.length} (${r.postable_channels}) | ${[...new Set(r.channels.map(c=>c.platform))].join(', ')||'—'} |`),
 ``,`Isolation: ${isolation.isolated?'PASS — no account/org/channel id visible to two creators':'FAIL'}${isolation.collisions.length?'\n\n```json\n'+JSON.stringify(isolation.collisions,null,2)+'\n```':''}`,
 ...(failures.length?[``,`## Failures`,...failures.map(f=>`- ${f.creator_id}: ${f.error}`)]:[]),
 ``,`## Channels`,``,...records.flatMap(r=>[`### ${r.creator_id}`,...(r.channels.length?r.channels.map(c=>`- ${c.platform} · ${c.display_name||c.name||'(unnamed)'} · id ${c.id}${c.disconnected?' · DISCONNECTED':''}${c.locked?' · LOCKED':''}${c.queue_paused?' · queue paused':''}`):['- (no channels connected)']),``]),
 `## Non-secret identifiers for Phase 4 (GitHub variables)`,``,'```',...Object.entries({...result.org_env,...result.channel_env}).map(([k,v])=>`${k}=${v}`),'```',``];
fs.writeFileSync(OUT_MD,lines.join('\n'));
console.log(JSON.stringify({status,creators:records.map(r=>({creator_id:r.creator_id,account_email:r.account_email,identity_verified:r.identity_verified,channels:r.channels.length,postable:r.postable_channels})),isolation:{isolated:isolation.isolated,identity_ok:isolation.identity_ok},failures,wrote:[OUT_JSON,OUT_MD]},null,2));
process.exit(status==='DISCOVERED'||status==='DISCOVERED_NO_CHANNELS'?0:1);
