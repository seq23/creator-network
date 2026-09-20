import { STATES } from './status.mjs';
export function networkHealth(heartbeats) {
  const values = Object.values(heartbeats).map(x=>x.overall);
  let overall = STATES.HEALTHY;
  if (values.includes(STATES.ACTION_REQUIRED)) overall=STATES.ACTION_REQUIRED;
  else if (values.includes(STATES.UNVERIFIED)) overall=STATES.UNVERIFIED;
  else if (values.includes(STATES.DEGRADED)) overall=STATES.DEGRADED;
  return {overall, employees:Object.fromEntries(Object.entries(heartbeats).map(([k,v])=>[k,v.overall]))};
}
export function isolatedRunnable(heartbeats){ return Object.entries(heartbeats).filter(([,v])=>v.overall!==STATES.ACTION_REQUIRED).map(([k])=>k); }
