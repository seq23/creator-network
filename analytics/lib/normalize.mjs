const NUMERIC = ['impressions','views','reach','likes','comments','shares','saves','clicks','watch_time_seconds','video_duration_seconds','followers_gained'];
export function normalizeSnapshot(raw){
  if(!raw || typeof raw!=='object') throw new Error('INVALID_SNAPSHOT');
  for(const k of ['snapshot_id','employee_id','experiment_id','platform','post_id','captured_at']) if(!raw[k]) throw new Error(`MISSING_${k.toUpperCase()}`);
  const metrics={};
  for(const k of NUMERIC){ const v=raw.metrics?.[k]; metrics[k]=(v===undefined||v===null)?null:Number(v); if(metrics[k]!==null && (!Number.isFinite(metrics[k])||metrics[k]<0)) throw new Error(`INVALID_METRIC_${k}`); }
  return {...raw, metrics, complete: raw.complete!==false};
}
export function derivedMetrics(m){
  const impressions=m.impressions ?? m.views ?? m.reach;
  const interactions=[m.likes,m.comments,m.shares,m.saves].filter(v=>v!==null);
  const engagement=interactions.length?interactions.reduce((a,b)=>a+b,0):null;
  return {
    engagement_rate: impressions && engagement!==null ? engagement/impressions : null,
    click_rate: impressions && m.clicks!==null ? m.clicks/impressions : null,
    intent_rate: impressions ? ((m.clicks??0)+(m.saves??0)+(m.shares??0))/impressions : null,
    completion_proxy: (m.watch_time_seconds!==null && m.video_duration_seconds && m.views) ? Math.min(1,m.watch_time_seconds/(m.video_duration_seconds*m.views)) : null
  };
}
