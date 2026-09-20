from pathlib import Path
import json
R=Path(__file__).resolve().parents[1]
required=[
'health/config/policy.json','health/lib/status.mjs','health/lib/incidents.mjs','health/lib/recovery.mjs','health/lib/heartbeat.mjs','health/lib/network.mjs','health/synthetic/checks.mjs','health/SELF_HEALING_RUNBOOK.md','health/incidents/ledger.json','state/health/network.json']
for x in required: assert (R/x).is_file(), x
p=json.loads((R/'health/config/policy.json').read_text())
assert p['rules']['healthy_requires_all_critical_verified'] is True
assert 'attribution' in p['deferred_checks']
for creator in ['marcus_vale','nia_brooks','camille_rose','maya_reyes']:
    h=json.loads((R/f'employees/{creator}/health.json').read_text())
    assert h['overall']=='UNVERIFIED'
    assert h['checks']['email']=='UNVERIFIED'
assert 'MUST NOT mutate' in (R/'authority/PHASE_LEDGER.md').read_text()
print('phase7 structural tests: PASS')
