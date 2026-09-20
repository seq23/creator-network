import { transition } from './job-state.mjs';
export async function scheduleJob({job,client,channelId,liveWritesEnabled=false}){
 if(job.state!=='RESERVED') throw new Error('JOB_NOT_RESERVED');
 if(!liveWritesEnabled) return transition(job,'QUARANTINED',{last_error:'LIVE_WRITES_DISABLED'});
 try{const p=await client.schedule({channelId,text:job.text,dueAt:job.publish_at,mediaUrl:job.media_url||null});return transition(job,'SCHEDULED',{buffer_post_id:p.id,attempts:(job.attempts||0)+1,last_error:null});}
 catch(e){const attempts=(job.attempts||0)+1;return transition(job,attempts>=3?'QUARANTINED':'RETRY_WAIT',{attempts,last_error:String(e.message||e).slice(0,300)});}
}
export async function confirmJob({job,client,organizationId,channelId}){if(job.state!=='SCHEDULED') throw new Error('JOB_NOT_SCHEDULED');const c=await client.confirmSent({organizationId,channelId,postId:job.buffer_post_id});return c.sent?transition(job,'SENT',{confirmed_at:new Date().toISOString()}):job;}
