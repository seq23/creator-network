const ENDPOINT='https://api.buffer.com';
function gqlString(v){return JSON.stringify(String(v));}
export class BufferClient {
 constructor({apiKey,fetchImpl=globalThis.fetch,endpoint=ENDPOINT}){if(!apiKey) throw new Error('BUFFER_API_KEY_REQUIRED');this.apiKey=apiKey;this.fetch=fetchImpl;this.endpoint=endpoint;}
 async request(query){const r=await this.fetch(this.endpoint,{method:'POST',headers:{'content-type':'application/json','authorization':`Bearer ${this.apiKey}`},body:JSON.stringify({query})});const body=await r.json();if(!r.ok||body.errors?.length) throw new Error(`BUFFER_API_ERROR:${body.errors?.[0]?.message||r.status}`);return body.data;}
 // Read-only discovery (verified against developers.buffer.com, 2026-09-20): the API key is account-scoped,
 // so `account` identifies WHICH creator's Buffer account this key belongs to, and `channels` lists what it may post to.
 async account(){const q=`query GetAccount { account { id email organizations { id name ownerEmail channelCount } } }`;const d=await this.request(q);if(!d?.account?.id) throw new Error('BUFFER_ACCOUNT_UNREADABLE');return d.account;}
 async channels({organizationId}){const q=`query GetChannels { channels(input: { organizationId: ${gqlString(organizationId)} }) { id name displayName service type organizationId externalLink isDisconnected isLocked isQueuePaused } }`;return (await this.request(q))?.channels||[];}
 async schedule({channelId,text,dueAt,mediaUrl}){
   const assets=mediaUrl?`, assets: [{ video: { url: ${gqlString(mediaUrl)} } }]`:'';
   const q=`mutation CreatePost { createPost(input: { text: ${gqlString(text)}, channelId: ${gqlString(channelId)}, schedulingType: automatic, mode: customScheduled, dueAt: ${gqlString(dueAt)}${assets} }) { ... on PostActionSuccess { post { id text dueAt channelId } } ... on MutationError { message } } }`;
   const d=await this.request(q);const x=d?.createPost;if(!x?.post?.id) throw new Error(`BUFFER_CREATE_FAILED:${x?.message||'unknown'}`);return x.post;
 }
 async listByStatus({organizationId,channelId,status}){const q=`query GetPosts { posts(first: 100, input: { organizationId: ${gqlString(organizationId)}, filter: { status: [${status}], channelIds: [${gqlString(channelId)}] } }) { edges { node { id text dueAt channelId } } pageInfo { hasNextPage endCursor } } }`;return (await this.request(q))?.posts;}
 async confirmSent({organizationId,channelId,postId}){const posts=await this.listByStatus({organizationId,channelId,status:'sent'});return {sent:(posts?.edges||[]).some(e=>e.node?.id===postId),post:(posts?.edges||[]).find(e=>e.node?.id===postId)?.node||null};}
}
