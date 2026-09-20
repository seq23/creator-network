import { createHash } from 'node:crypto';
export function publishIdempotencyKey({employee,experiment_id,platform,publish_at}){return createHash('sha256').update([employee,experiment_id,platform,publish_at].join('|')).digest('hex');}
export function isDuplicate(ledger,key){return (ledger.jobs||[]).some(j=>j.idempotency_key===key && !['QUARANTINED'].includes(j.state));}
