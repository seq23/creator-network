export async function sendWeeklyEmail({subject,text,fetchImpl=fetch,env=process.env}={}){
 if(env.WEEKLY_REPORT_DELIVERY_ENABLED!=='true') return {ok:false,status:'SKIPPED_DISABLED'};
 const endpoint=env.WEEKLY_EMAIL_ENDPOINT, token=env.WEEKLY_EMAIL_TOKEN, to=env.WEEKLY_OWNER_EMAIL, from=env.WEEKLY_REPORT_FROM;
 if(!endpoint||!token||!to||!from) return {ok:false,status:'BLOCKED_MISSING_CONFIG'};
 const res=await fetchImpl(endpoint,{method:'POST',headers:{'content-type':'application/json','authorization':`Bearer ${token}`},body:JSON.stringify({from,to:[to],subject,text})});
 if(!res.ok) return {ok:false,status:'FAILED',http_status:res.status};
 return {ok:true,status:'SENT',http_status:res.status};
}
