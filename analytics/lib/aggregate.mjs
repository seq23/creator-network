import { normalizeSnapshot, derivedMetrics } from './normalize.mjs';
export function aggregateByExperiment(snapshots){
  const groups=new Map();
  for(const input of snapshots){ const s=normalizeSnapshot(input); const k=`${s.employee_id}:${s.experiment_id}`; if(!groups.has(k)) groups.set(k,[]); groups.get(k).push(s); }
  return [...groups.entries()].map(([key,rows])=>{
    const latestByPost=new Map(); for(const r of rows){ const prev=latestByPost.get(r.post_id); if(!prev || new Date(r.captured_at)>new Date(prev.captured_at)) latestByPost.set(r.post_id,r); }
    const latest=[...latestByPost.values()]; const sums={}; for(const k of ['impressions','views','reach','likes','comments','shares','saves','clicks','followers_gained']) sums[k]=latest.reduce((a,r)=>a+(r.metrics[k]??0),0);
    const d=derivedMetrics({...sums,watch_time_seconds:null,video_duration_seconds:null});
    return {employee_id:latest[0].employee_id,experiment_id:latest[0].experiment_id,posts:latest.length,platforms:[...new Set(latest.map(r=>r.platform))],metrics:sums,derived:d,complete:latest.every(r=>r.complete),latest_captured_at:latest.map(r=>r.captured_at).sort().at(-1)};
  });
}
