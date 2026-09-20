const n=v=>v==null?'—':String(v);
export function renderText(r){
 const lines=[]; lines.push('CREATOR NETWORK — WEEKLY OWNER REPORT','');
 lines.push(`Period: ${n(r.period.start)} → ${n(r.period.end)}`,`Network Health: ${r.network_health}`,'');
 lines.push('EXECUTIVE SUMMARY',`Planned last week: ${n(r.summary.planned)}`,`Released last week: ${n(r.summary.released)}`,`Failed/missed: ${n(r.summary.failed_or_missed)}`,`Automatically recovered/rescheduled: ${n(r.summary.automatically_recovered)}`,`In production now: ${n(r.summary.in_production)}`,`Finished + scheduled: ${n(r.summary.finished_scheduled)}`,`Planned releases next week: ${n(r.summary.planned_next_week)}`,`Economic value: ${n(r.summary.economic_value)}`,`Operating spend: ${n(r.summary.operating_spend)}`,'');
 lines.push('EMPLOYEE SCORECARDS'); for(const e of r.employees) lines.push(`${e.creator_id}: health=${e.health}; planned=${e.planned}; released=${e.released}; pipeline=${e.pipeline}; scheduled=${e.scheduled}; failed=${e.failed}`); lines.push('');
 lines.push('CURRENT PRODUCTION PIPELINE',JSON.stringify(r.pipeline.counts),'', 'NEXT WEEK',`Scheduled: ${r.next_week.scheduled}`,'');
 lines.push('SYSTEM HEALTH + SELF-HEALING',`Incidents detected: ${r.health.incidents_detected}`,`Automatically resolved: ${r.health.automatically_resolved}`,`Unresolved: ${r.health.unresolved}`,`Certification: ${r.health.certification}`,'');
 const action=Array.isArray(r.owner_action_required)?r.owner_action_required.join('; '):r.owner_action_required;
 lines.push(`OWNER ACTION REQUIRED: ${action||'NONE'}`); return lines.join('\n');
}
