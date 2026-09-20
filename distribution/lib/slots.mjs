function isoWeekKey(value){
  const d=new Date(value); if(Number.isNaN(d.getTime())) throw new Error('INVALID_PUBLISH_AT');
  const x=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()));
  const day=x.getUTCDay()||7; x.setUTCDate(x.getUTCDate()+4-day);
  const yearStart=new Date(Date.UTC(x.getUTCFullYear(),0,1));
  const week=Math.ceil((((x-yearStart)/86400000)+1)/7);
  return `${x.getUTCFullYear()}-W${String(week).padStart(2,'0')}`;
}
export function reserveSlot(state, employee, platform, publishAt, capacity=10) {
  const reservations = state.reservations || [];
  const week = isoWeekKey(publishAt);
  const used = reservations.filter(r => r.employee===employee && r.week===week).length;
  if (used >= capacity) return {ok:false, reason:'CAPACITY_EXHAUSTED', state};
  const key = `${employee}:${platform}:${publishAt}`;
  if (reservations.some(r=>r.key===key)) return {ok:true, duplicate:true, reservation:reservations.find(r=>r.key===key), state};
  const reservation={key,employee,platform,publish_at:publishAt,week,status:'RESERVED'};
  return {ok:true,reservation,state:{...state,reservations:[...reservations,reservation]}};
}
export function hasReservation(state, employee, platform, publishAt){return (state.reservations||[]).some(r=>r.employee===employee&&r.platform===platform&&r.publish_at===publishAt&&r.status==='RESERVED');}
export {isoWeekKey};
