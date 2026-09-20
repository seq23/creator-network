const ORDER=['PRECHECK','HEALTH','PLAN','RESERVE','INTELLIGENCE','QA','MEDIA','SCHEDULE','CONFIRM','METRICS','OPTIMIZE','PERSIST'];
export async function runEmployeeDay({employee, readiness, steps={}}){
 if(readiness.status!=='READY') return {creator_id:employee.creator_id,status:'SAFE_STANDBY',completed:['PRECHECK'],blocked_by:readiness.blockers};
 const completed=[]; for(const name of ORDER){const fn=steps[name]; if(!fn){return {creator_id:employee.creator_id,status:'ISOLATED_FAILURE',completed,halted_at:name,error:`STEP_NOT_WIRED:${name}`};} try{const out=await fn(employee); completed.push(name); if(out?.halt) return {creator_id:employee.creator_id,status:'DEGRADED',completed,halted_at:name,detail:out};}catch(e){return {creator_id:employee.creator_id,status:'ISOLATED_FAILURE',completed,halted_at:name,error:String(e.message||e)};}}
 return {creator_id:employee.creator_id,status:'COMPLETE',completed};
}
export async function runNetworkDay({employees, readiness, stepFactory=()=>({})}){const results=[]; for(const employee of employees) results.push(await runEmployeeDay({employee,readiness,steps:stepFactory(employee)})); return {status:readiness.status==='READY'?(results.some(x=>x.status==='COMPLETE')?'OPERATED':'DEGRADED'):'SAFE_STANDBY',results};}
export {ORDER};
