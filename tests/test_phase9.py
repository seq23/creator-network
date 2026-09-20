import json, os, subprocess, unittest
from pathlib import Path
R=Path(__file__).resolve().parents[1]
class Phase9(unittest.TestCase):
 def test_policy_boundary(self):
  p=json.loads((R/'launch/config/policy.json').read_text()); self.assertFalse(p['portfolio_repo_mutation_allowed']); self.assertFalse(p['conversion_attribution_launch_blocking']); self.assertEqual(p['minimum_pipeline_coverage_days'],3)
 def test_safe_standby_without_credentials(self):
  e=os.environ.copy(); [e.pop(k,None) for k in list(e) if k.startswith('BUFFER_') or k.startswith('OPENROUTER_') or k.startswith('WEEKLY_')]; q=subprocess.run(['node','launch/run.mjs'],cwd=R,env=e,text=True,capture_output=True); self.assertEqual(q.returncode,0); d=json.loads(q.stdout); self.assertEqual(d['readiness']['status'],'NOT_READY'); self.assertEqual(d['result']['status'],'SAFE_STANDBY')
 def test_strict_gate_can_fail_ci(self):
  e=os.environ.copy(); e['REQUIRE_LIVE_READY']='true'; q=subprocess.run(['node','launch/run.mjs'],cwd=R,env=e,text=True,capture_output=True); self.assertEqual(q.returncode,2)
 def test_daily_workflow_exists(self): self.assertTrue((R/'.github/workflows/daily-creator-network.yml').exists())
 def test_activation_runbook_exists(self): self.assertTrue((R/'launch/PRODUCTION_ACTIVATION_RUNBOOK.md').exists())
 def test_no_portfolio_mutation_targets(self):
  t=(R/'launch/PRODUCTION_ACTIVATION_RUNBOOK.md').read_text(); self.assertIn('remain read-only',t); self.assertIn('Conversion attribution is deferred',t)
if __name__=='__main__': unittest.main()
