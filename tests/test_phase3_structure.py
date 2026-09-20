from pathlib import Path
import json
r=Path(__file__).resolve().parents[1]
required=['docs/DEFERRED_ATTRIBUTION_RUNBOOK.md','intelligence/config/model_policy.json','intelligence/config/budget_policy.json','intelligence/providers/openrouter.js','intelligence/lib/research-router.js','intelligence/lib/budget-governor.js','intelligence/lib/freshness.js','intelligence/lib/generation-guard.js','intelligence/lib/qa-policy.js','intelligence/lib/quarantine.js','schemas/knowledge_pack.schema.json','schemas/generation_request.schema.json','schemas/generation_output.schema.json','schemas/qa_result.schema.json']
assert all((r/x).exists() for x in required)
ledger=(r/'authority/PHASE_LEDGER.md').read_text()
assert 'MUST NOT mutate' in ledger and '4. Media Factory' in ledger and '| 6 | Intelligence + content engine |' in ledger
assert json.loads((r/'state/intelligence_budget.json').read_text())['live_spend_enabled'] is False
print('phase3 structural: PASS')
