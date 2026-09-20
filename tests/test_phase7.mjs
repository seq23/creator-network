import assert from 'node:assert/strict';
import { certify, STATES } from '../health/lib/status.mjs';
import { boundedRecover, playbookFor } from '../health/lib/recovery.mjs';
import { runHeartbeat } from '../health/lib/heartbeat.mjs';
import { networkHealth, isolatedRunnable } from '../health/lib/network.mjs';
import { appendIncident, incident } from '../health/lib/incidents.mjs';

const policy={critical_checks:['identity','research','qa'],deferred_checks:['attribution','email']};
const h=(status=STATES.HEALTHY,verified=true)=>({status,verified});

assert.equal(certify({identity:h(),research:h(),qa:h(),attribution:h(STATES.UNVERIFIED,false)},policy),STATES.HEALTHY,'deferred attribution must not block');
assert.equal(certify({identity:h(),research:h(STATES.UNVERIFIED,false),qa:h()},policy),STATES.UNVERIFIED,'unproven critical path must block HEALTHY');
assert.equal(certify({identity:h(),research:h(STATES.DEGRADED),qa:h()},policy),STATES.DEGRADED,'recovered/fallback critical path must be DEGRADED');
assert.equal(certify({identity:h(),research:h(STATES.ACTION_REQUIRED,false),qa:h()},policy),STATES.ACTION_REQUIRED,'human failure must escalate');

let tries=0;
const rr=await boundedRecover({subsystem:'research',attempts:2,operation:async()=>{tries++; if(tries<2) throw Error('transient'); return 'ok';}});
assert.equal(rr.ok,true); assert.equal(rr.recovery,'RETRY'); assert.equal(tries,2);

const fb=await boundedRecover({subsystem:'renderer',attempts:1,operation:async()=>{throw Error('down')},fallback:async()=> 'EDITED_SOCIAL'});
assert.equal(fb.ok,true); assert.equal(fb.recovery,'FALLBACK'); assert.equal(fb.value,'EDITED_SOCIAL');

const failed=await boundedRecover({subsystem:'state',attempts:1,operation:async()=>{throw Error('corrupt')}});
assert.equal(failed.ok,false); assert.equal(failed.recovery,'FAILED');
assert.ok(playbookFor('buffer').includes('QUARANTINE_PRESERVE'));
assert.deepEqual(playbookFor('not_registered'),['ACTION_REQUIRED']);

const beat=await runHeartbeat({employee:{creator_id:'marcus_vale'},policy,now:()=> '2026-09-20T00:00:00.000Z',checks:{identity:async()=>h(),research:async()=>({status:STATES.DEGRADED,verified:true,detail:'fallback active',recovery:'FALLBACK'}),qa:async()=>h(),attribution:async()=>h(STATES.UNVERIFIED,false)}});
assert.equal(beat.overall,STATES.DEGRADED); assert.equal(beat.incidents.length,1); assert.equal(beat.incidents[0].resolved,true);

const unknown=await runHeartbeat({employee:{creator_id:'nia_brooks'},policy,checks:{identity:async()=>h(),research:async()=>{throw Error('mystery')},qa:async()=>h()}});
assert.equal(unknown.overall,STATES.ACTION_REQUIRED); assert.equal(unknown.incidents[0].failure_class,'UNKNOWN');

const net=networkHealth({marcus_vale:{overall:STATES.HEALTHY},nia_brooks:{overall:STATES.ACTION_REQUIRED},camille_rose:{overall:STATES.HEALTHY}});
assert.equal(net.overall,STATES.ACTION_REQUIRED);
assert.deepEqual(isolatedRunnable({marcus_vale:{overall:STATES.HEALTHY},nia_brooks:{overall:STATES.ACTION_REQUIRED},camille_rose:{overall:STATES.DEGRADED}}),['marcus_vale','camille_rose']);

const i=incident({employee_id:'maya_reyes',subsystem:'buffer',failure_class:'KNOWN',message:'timeout',at:'2026-09-20T00:00:00.000Z'});
assert.equal(appendIncident([i],i).length,1,'incident append must be idempotent');
console.log('phase7 behavioral tests: PASS (13 assertions groups)');
