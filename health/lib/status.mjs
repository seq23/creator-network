export const STATES = Object.freeze({HEALTHY:'HEALTHY', DEGRADED:'DEGRADED', ACTION_REQUIRED:'ACTION_REQUIRED', UNVERIFIED:'UNVERIFIED'});

export function certify(checks, policy) {
  const critical = new Set(policy.critical_checks || []);
  const deferred = new Set(policy.deferred_checks || []);
  let degraded = false;
  for (const name of critical) {
    const c = checks[name];
    if (!c || c.status === STATES.UNVERIFIED) return STATES.UNVERIFIED;
    if (c.status === STATES.ACTION_REQUIRED) return STATES.ACTION_REQUIRED;
    if (c.status === STATES.DEGRADED) degraded = true;
  }
  for (const [name,c] of Object.entries(checks)) {
    if (deferred.has(name)) continue;
    if (c.status === STATES.ACTION_REQUIRED) return STATES.ACTION_REQUIRED;
    if (c.status === STATES.DEGRADED) degraded = true;
  }
  return degraded ? STATES.DEGRADED : STATES.HEALTHY;
}
