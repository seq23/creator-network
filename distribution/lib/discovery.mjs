// Buffer read-only discovery: which account each creator's key sees, and which channels it may post to.
// Pure functions here; the network call happens in scripts/buffer-discovery.mjs. Nothing in this module mutates Buffer.
export const CREATORS = Object.freeze({
  marcus_vale:  {name:'Marcus Vale',  email:'marcus@aplayermode.com',        credential_env:'BUFFER_API_KEY_MARCUS_VALE'},
  nia_brooks:   {name:'Nia Brooks',   email:'nia@approvalprep.com',          credential_env:'BUFFER_API_KEY_NIA_BROOKS'},
  camille_rose: {name:'Camille Rose', email:'camille@weddingchecklistpdf.com', credential_env:'BUFFER_API_KEY_CAMILLE_ROSE'},
  maya_reyes:   {name:'Maya Reyes',   email:'maya@theindustryguides.com',    credential_env:'BUFFER_API_KEY_MAYA_REYES'}
});

// Buffer `service` enum -> the platform key used in distribution/config/accounts.json.
const SERVICE_TO_PLATFORM = {instagram:'instagram', threads:'threads', twitter:'twitter', x:'twitter', tiktok:'tiktok', youtube:'youtube', linkedin:'linkedin', facebook:'facebook', pinterest:'pinterest', bluesky:'bluesky', mastodon:'mastodon', googlebusiness:'googlebusiness'};
export function platformFor(service){return SERVICE_TO_PLATFORM[String(service||'').toLowerCase()]||String(service||'').toLowerCase()||'unknown';}

const SECRET_SHAPE=/[A-Za-z0-9_\-]{32,}/;
// Buffer ids are 24-hex ObjectIds and never trip this; an API key would. Walks nested objects so nothing persisted escapes it.
export function assertNotSecretShaped(field,value){
  if(typeof value==='string'){ if(SECRET_SHAPE.test(value)&&!/^[0-9a-f]{24}$/.test(value)) throw new Error(`DISCOVERY_OUTPUT_SECRET_SHAPED:${field}`); return; }
  if(Array.isArray(value)){ value.forEach((v,i)=>assertNotSecretShaped(`${field}[${i}]`,v)); return; }
  if(value&&typeof value==='object') for(const [k,v] of Object.entries(value)) assertNotSecretShaped(`${field}.${k}`,v);
}

// Reduce one creator's raw API answers to the non-secret record we persist.
export function summarizeCreator({creatorId, account, channelsByOrg}){
  const expected=CREATORS[creatorId]; if(!expected) throw new Error(`UNKNOWN_CREATOR:${creatorId}`);
  const orgs=(account.organizations||[]).map(o=>({id:o.id,name:o.name,owner_email:o.ownerEmail,channel_count:o.channelCount??null}));
  const channels=[];
  for(const o of orgs) for(const c of (channelsByOrg[o.id]||[])) channels.push({id:c.id,organization_id:c.organizationId||o.id,service:c.service,platform:platformFor(c.service),type:c.type||null,name:c.name||null,display_name:c.displayName||null,external_link:c.externalLink||null,disconnected:c.isDisconnected===true,locked:c.isLocked===true,queue_paused:c.isQueuePaused===true});
  const emailMatches=String(account.email||'').toLowerCase()===expected.email.toLowerCase();
  const rec={creator_id:creatorId,expected_email:expected.email,account_id:account.id,account_email:account.email,identity_verified:emailMatches,organizations:orgs,channels,postable_channels:channels.filter(c=>!c.disconnected&&!c.locked).length};
  assertNotSecretShaped(creatorId,rec);
  return rec;
}

// Isolation law: no account, organization or channel id may be visible to two creators' keys.
export function verifyIsolation(records){
  const seen=new Map(); const collisions=[];
  const note=(kind,id,creator)=>{const key=`${kind}:${id}`; if(seen.has(key)&&seen.get(key)!==creator) collisions.push({kind,id,creators:[seen.get(key),creator]}); else seen.set(key,creator);};
  for(const r of records){ note('account',r.account_id,r.creator_id); for(const o of r.organizations) note('organization',o.id,r.creator_id); for(const c of r.channels) note('channel',c.id,r.creator_id); }
  const identity_failures=records.filter(r=>!r.identity_verified).map(r=>({creator_id:r.creator_id,expected:r.expected_email,actual:r.account_email}));
  return {isolated:collisions.length===0, identity_ok:identity_failures.length===0, collisions, identity_failures};
}

// Channel-id map in the shape distribution/config/accounts.json expects, one env identifier per platform.
export function channelEnvMap(record){
  const out={}; for(const c of record.channels){ if(c.disconnected||c.locked) continue; const key=`BUFFER_CHANNEL_${record.creator_id.toUpperCase()}_${c.platform.toUpperCase()==='TWITTER'?'X':c.platform.toUpperCase()}`; if(!out[key]) out[key]=c.id; }
  return out;
}
