function clamp(n){return Math.max(0,Math.min(1,n));}
export function scoreExperiment(a){
  const d=a.derived||{};
  const attentionParts=[d.engagement_rate==null?null:clamp(d.engagement_rate/0.08),d.completion_proxy==null?null:clamp(d.completion_proxy/0.65)].filter(v=>v!==null);
  const attention=attentionParts.length?attentionParts.reduce((x,y)=>x+y,0)/attentionParts.length:0;
  const intent=d.intent_rate==null?0:clamp(d.intent_rate/0.03);
  // Conversion is deliberately unavailable while attribution is deferred.
  const score=attentionParts.length ? (attention*0.4375 + intent*0.5625) : intent;
  return {attention, intent, conversion:null, score:clamp(score)};
}
