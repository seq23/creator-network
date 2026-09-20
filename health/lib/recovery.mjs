const PLAYBOOKS = Object.freeze({
  research: ['RETRY','APPROVED_PROVIDER_FALLBACK','FRESH_ENOUGH_KNOWLEDGE_OR_SKIP'],
  generation: ['RETRY_ONCE','APPROVED_MODEL_FALLBACK','PRESERVE_AND_SKIP'],
  qa: ['BOUNDED_REVISE','QUARANTINE'],
  renderer: ['RETRY','ALTERNATE_RENDERER','EDITED_SOCIAL_FALLBACK'],
  buffer: ['RETRY_BACKOFF','RESCHEDULE','QUARANTINE_PRESERVE'],
  publishing: ['RECONCILE_REMOTE_STATE','RETRY_BACKOFF','QUARANTINE_PRESERVE'],
  analytics: ['RETRY','MARK_INCOMPLETE','HOLD_OPTIMIZER'],
  attribution: ['DEFERRED_NO_RECOVERY'],
  workflow: ['IDEMPOTENT_RETRY','LAST_KNOWN_GOOD','BLOCK_DUPLICATES'],
  state: ['RETRY','LAST_KNOWN_GOOD','ACTION_REQUIRED'],
  budget: ['FREE_FORMAT_MODE','QUEUE_WORK'],
  email: ['RETRY','PRESERVE_REPORT','ACTION_REQUIRED']
});
export function playbookFor(subsystem){ return PLAYBOOKS[subsystem] || ['ACTION_REQUIRED']; }
export async function boundedRecover({subsystem, operation, fallback, attempts=2, sleep=async()=>{}}) {
  let lastError;
  for (let i=0;i<attempts;i++) {
    try { return {ok:true, value:await operation(i), recovery:i===0?'NONE':'RETRY', attempts:i+1}; }
    catch(e){ lastError=e; if(i<attempts-1) await sleep(i); }
  }
  if (fallback) {
    try { return {ok:true, value:await fallback(lastError), recovery:'FALLBACK', attempts}; }
    catch(e){ lastError=e; }
  }
  return {ok:false, error:String(lastError?.message || lastError || 'unknown failure'), recovery:'FAILED', attempts};
}
