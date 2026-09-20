import { certify, STATES } from './status.mjs';
import { incident } from './incidents.mjs';

export async function runHeartbeat({employee, checks, policy, now=()=>new Date().toISOString()}) {
  const results = {}; const incidents=[];
  for (const [name, check] of Object.entries(checks)) {
    try {
      const r = await check();
      results[name] = {status:r.status || STATES.HEALTHY, verified: r.verified === true, detail:r.detail || null, recovery:r.recovery || 'NONE'};
      if (results[name].status === STATES.HEALTHY && !results[name].verified) results[name].status = STATES.UNVERIFIED;
      if ([STATES.DEGRADED,STATES.ACTION_REQUIRED].includes(results[name].status)) incidents.push(incident({employee_id:employee.creator_id, subsystem:name, failure_class:r.failure_class || 'KNOWN', message:r.detail || results[name].status, recovery:r.recovery || 'NONE', resolved:results[name].status===STATES.DEGRADED, at:now()}));
    } catch(e) {
      results[name] = {status:STATES.ACTION_REQUIRED, verified:false, detail:String(e.message||e), recovery:'NONE'};
      incidents.push(incident({employee_id:employee.creator_id, subsystem:name, failure_class:'UNKNOWN', message:String(e.message||e), at:now()}));
    }
  }
  const overall = certify(results, policy);
  return {creator_id:employee.creator_id, overall, checked_at:now(), checks:results, incidents};
}
