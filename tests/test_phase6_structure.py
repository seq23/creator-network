from pathlib import Path
import json
r=Path(__file__).resolve().parents[1]
req=['analytics/config/metrics_policy.json','analytics/lib/normalize.mjs','analytics/lib/aggregate.mjs','optimizer/config/policy.json','optimizer/lib/score.mjs','optimizer/lib/decision.mjs','optimizer/lib/allocation.mjs','schemas/metric_snapshot.schema.json','schemas/optimizer_decision.schema.json']
for p in req: assert (r/p).exists(), p
policy=json.loads((r/'analytics/config/metrics_policy.json').read_text())
assert policy['attribution_deferred'] is True
assert policy['economic_metrics_status'].startswith('UNAVAILABLE')
opt=json.loads((r/'optimizer/config/policy.json').read_text())
assert opt['paid_amplification_requires_economic_evidence'] is True
print('PHASE 6 STRUCTURE PASS')
