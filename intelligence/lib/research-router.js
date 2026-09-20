const HIGH = /(legal|law|attorney|injury claim|medical|health|hormone|iv therapy|hair loss|diagnos|neuro|adhd|autism|uscis|immigration|civil surgeon|credit score|guarantee)/i;
const CURRENT = /(today|current|latest|202[0-9]|price|fee|deadline|requirement|policy|platform|algorithm)/i;
function classify({employeeId='', topic='', requiresCurrent=false, approvedEvergreen=false}) {
  if (employeeId === 'maya_reyes' && HIGH.test(topic)) return 'HIGH_STAKES';
  if (HIGH.test(topic)) return 'HIGH_STAKES';
  if (requiresCurrent || CURRENT.test(topic)) return 'CURRENT';
  if (approvedEvergreen) return 'NONE';
  return 'LIGHT';
}
module.exports={classify};
