function canReserve(state, policy, estimatedUsd) {
  const n=Number(estimatedUsd); if(!Number.isFinite(n)||n<0) return {ok:false,reason:'INVALID_ESTIMATE'};
  if (state.live_spend_enabled !== true) return {ok:false,reason:'LIVE_SPEND_DISABLED'};
  if (Number(state.daily_spend_usd||0)+n > Number(policy.daily_cap)) return {ok:false,reason:'DAILY_CAP'};
  if (Number(state.monthly_spend_usd||0)+n > Number(policy.monthly_cap)) return {ok:false,reason:'MONTHLY_CAP'};
  return {ok:true};
}
function reserve(state, policy, estimatedUsd, id) { const c=canReserve(state,policy,estimatedUsd); if(!c.ok)return c; return {ok:true,state:{...state,daily_spend_usd:Number(state.daily_spend_usd||0)+Number(estimatedUsd),monthly_spend_usd:Number(state.monthly_spend_usd||0)+Number(estimatedUsd),reservations:[...(state.reservations||[]),{id,estimated_usd:Number(estimatedUsd)}]}}; }
module.exports={canReserve,reserve};
