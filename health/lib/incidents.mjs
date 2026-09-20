import crypto from 'node:crypto';
export function incident({employee_id, subsystem, failure_class, message, recovery='NONE', resolved=false, at=new Date().toISOString()}) {
  const seed = `${employee_id}|${subsystem}|${failure_class}|${message}|${at}`;
  return {incident_id: crypto.createHash('sha256').update(seed).digest('hex').slice(0,20), employee_id, subsystem, failure_class, message, recovery, resolved, detected_at: at};
}
export function appendIncident(ledger, item) {
  if (ledger.some(x => x.incident_id === item.incident_id)) return ledger;
  return [...ledger, item];
}
