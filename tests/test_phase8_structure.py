from pathlib import Path
import json
r=Path(__file__).resolve().parents[1]
required=['reporting/weekly_owner/lib/compile.mjs','reporting/weekly_owner/lib/render.mjs','reporting/weekly_owner/providers/http-email.mjs','reporting/weekly_owner/run.mjs','reporting/config/policy.json','schemas/weekly_owner_report.schema.json','state/reporting/weekly.json','.github/workflows/weekly-owner-report.yml']
assert all((r/x).exists() for x in required)
p=json.loads((r/'reporting/config/policy.json').read_text()); assert p['delivery_enabled'] is False; assert p['deferred_attribution_is_non_blocking'] is True
w=(r/'.github/workflows/weekly-owner-report.yml').read_text(); assert 'schedule:' in w and 'WEEKLY_EMAIL_TOKEN' in w
print('Phase 8 structural tests: PASS')
