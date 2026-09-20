import fs from 'node:fs';
import path from 'node:path';
const read=(root,p,fallback={})=>{try{return JSON.parse(fs.readFileSync(path.join(root,p),'utf8'))}catch{return fallback}};
const employees=['marcus_vale','nia_brooks','camille_rose','maya_reyes'];
const counts=(jobs=[])=>jobs.reduce((a,j)=>{const s=String(j.state||'UNKNOWN').toUpperCase();a[s]=(a[s]||0)+1;return a},{});
export function compileWeeklyReport({root='.',start,end,now=new Date().toISOString()}={}){
  const network=read(root,'state/health/network.json',{overall:'UNVERIFIED',employees:{}});
  const distribution=read(root,'state/distribution.json',{jobs:[]});
  const pipelineState=read(root,'state/pipeline.json',{states:[],minimum_coverage_days:null});
  const incidents=read(root,'health/incidents/ledger.json',{incidents:[]}).incidents||[];
  const budget=read(root,'state/budget.json',{});
  const allJobs=distribution.jobs||[];
  const inPeriod=(j)=>{ const raw=j.confirmed_at||j.updated_at||j.publish_at||j.created_at; if(!raw||!start||!end) return false; const d=String(raw).slice(0,10); return d>=start&&d<=end; };
  const jobs=allJobs.filter(inPeriod);
  const unperiodized=allJobs.filter(j=>!(j.confirmed_at||j.updated_at||j.publish_at||j.created_at)).length;
  const jc=counts(jobs);
  const scorecards=employees.map(id=>{
    const h=read(root,`employees/${id}/health.json`,{overall:'UNVERIFIED',checks:{}});
    const own=jobs.filter(j=>(j.employee||j.creator_id)===id);
    const c=counts(own);
    return {creator_id:id,health:h.overall||'UNVERIFIED',planned:own.length,released:c.RELEASED||c.SENT||0,failed:c.FAILED||0,pipeline:own.filter(j=>!['RELEASED','SENT','FAILED'].includes(String(j.state||'').toUpperCase())).length,scheduled:c.SCHEDULED||0,metrics_status:'UNAVAILABLE_UNLESS_INGESTED',economic_value:null,best_experiment:null,learned:[],system_action:[]};
  });
  const unresolved=incidents.filter(i=>!['RESOLVED','RECOVERED','CLOSED'].includes(String(i.status||'').toUpperCase()));
  const recovered=incidents.filter(i=>['RESOLVED','RECOVERED','CLOSED'].includes(String(i.status||'').toUpperCase()));
  const action=network.overall==='ACTION_REQUIRED' ? unresolved.map(i=>i.owner_action||i.summary||i.id).filter(Boolean) : 'NONE';
  return {
    period:{start:start||null,end:end||null},generated_at:now,network_health:network.overall||'UNVERIFIED',
    summary:{planned:jobs.length,released:(jc.RELEASED||0)+(jc.SENT||0),failed_or_missed:jc.FAILED||0,automatically_recovered:recovered.length,in_production:jobs.filter(j=>!['RELEASED','SENT','FAILED'].includes(String(j.state||'').toUpperCase())).length,finished_scheduled:(jc.READY||0)+(jc.SCHEDULED||0),planned_next_week:jc.SCHEDULED||0,economic_value:null,operating_spend:budget.actual_spend??null,attribution_status:'DEFERRED',unperiodized_records:unperiodized},
    employees:scorecards,
    pipeline:{counts:jc,coverage_floor_days:pipelineState.minimum_coverage_days,coverage_status:pipelineState.minimum_coverage_days==null?'UNCONFIGURED':'CALCULABLE_AT_LAUNCH'},
    next_week:{scheduled:jc.SCHEDULED||0,notes:['Exact release plan is derived from live distribution jobs once Phase 9 enables scheduling.']},
    learning:[],
    autonomous_actions:recovered.map(i=>({id:i.id||null,recovery:i.recovery||i.resolution||'recorded recovery'})),
    health:{overall:network.overall||'UNVERIFIED',employees:network.employees||{},incidents_detected:incidents.length,automatically_resolved:recovered.length,unresolved:unresolved.length,certification:network.overall==='HEALTHY'?'VERIFIED':'NOT_HEALTHY_CERTIFIED'},
    owner_action_required:action
  };
}
