import { scoreExperiment } from './score.mjs';
export function decide(a, previous='EXPLORE', policy={}){
  const s=scoreExperiment(a); const impressions=a.metrics?.impressions??0; const posts=a.posts??0; const reasons=[];
  let next=previous;
  if(!a.complete){ next='HOLD'; reasons.push('INCOMPLETE_METRICS'); }
  else if(a.anomaly){ next='HOLD'; reasons.push('ANOMALY'); }
  else if(posts < 2 || impressions < 250){ next='EXPLORE'; reasons.push('INSUFFICIENT_SAMPLE'); }
  else if(posts>=4 && impressions>=1500 && s.score<=0.20){ next='KILL'; reasons.push('LOW_SIGNAL_AFTER_SAMPLE'); }
  else if(posts>=3 && impressions>=1000 && (a.derived?.intent_rate??0)>=0.005 && s.score>=0.45){ next='SCALE'; reasons.push('ORGANIC_ATTENTION_AND_INTENT'); }
  else { next='ITERATE'; reasons.push('MIXED_OR_EARLY_SIGNAL'); }
  const economic=false;
  return {experiment_id:a.experiment_id,employee_id:a.employee_id,previous_state:previous,next_state:next,score:Number(s.score.toFixed(6)),reason_codes:reasons,economic_evidence_available:economic,paid_amplification_allowed:false,recommended_capacity_share:0};
}
