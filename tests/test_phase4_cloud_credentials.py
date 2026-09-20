"""Phase 4 — cloud credential provisioning. Pins the vault -> stdin path and the absence of any plaintext one, and
that the daily lane can no longer exit 0 having touched nothing (Rule 0): a state-check step precedes runtime/run.mjs
and a state-outcome step records the result whatever happens."""
import json, re, subprocess, unittest
from pathlib import Path
R=Path(__file__).resolve().parents[1]
SECRETS=['BUFFER_API_KEY_MARCUS_VALE','BUFFER_API_KEY_NIA_BROOKS','BUFFER_API_KEY_CAMILLE_ROSE','BUFFER_API_KEY_MAYA_REYES','CREATOR_STATE_API_TOKEN']
VARS=['CREATOR_STATE_API_URL','DURABLE_STATE_CONFIGURED','AUTONOMOUS_RUNTIME_WIRED','LIVE_PUBLISHING_ENABLED','WEEKLY_REPORT_DELIVERY_ENABLED','REQUIRE_LIVE_READY']
class PlaintextPathGone(unittest.TestCase):
 def test_no_plaintext_credential_files(self):
  for f in ('scripts/create-local-env-vault.sh','scripts/wrangler-secret-put-from-vault.sh','ops/env/creator-network.env.example','.env.example','secrets'):
   self.assertFalse((R/f).exists(),f'{f} is the plaintext path Phase 4 deleted')
 def test_nothing_points_at_the_plaintext_path(self):
  out=subprocess.run(['git','grep','-n','-e','secrets/creator-network.env','-e','env.example','-e','create-local-env-vault','-e','wrangler-secret-put-from-vault','--','.',':!tests/',':!authority/PHASE_LEDGER.md',':!docs/reviews/',':!ops/env/ENV_VAULT.md'],cwd=R,text=True,capture_output=True).stdout
  self.assertEqual(out.strip(),'',f'plaintext path still referenced:\n{out}')
 def test_gitignore_has_no_env_example_exception(self):
  self.assertNotIn('!.env.example',(R/'.gitignore').read_text())
class VaultToGitHub(unittest.TestCase):
 def test_secret_script_pipes_from_env_through_stdin_only(self):
  s=(R/'scripts/github-secrets.sh').read_text()
  for n in SECRETS: self.assertIn(n,s)
  self.assertIn('printf %s "$value" | gh secret set "$name"',s,'value must reach gh on stdin')
  self.assertNotRegex(s,r'gh secret set [^\n]*--body','a secret on argv is the defect this phase removes')
  self.assertNotRegex(s,r'echo[^\n]*\$value','never print a value, not even a slice')
  self.assertIn('NAMED STOP',s)
 def test_secret_script_only_runs_inside_the_vault_child(self):
  p=json.loads((R/'package.json').read_text())['scripts']
  self.assertEqual(p['secrets:github'],'python3 scripts/vault-exec.py -- sh scripts/github-secrets.sh')
  self.assertEqual(p['vars:github'],'sh scripts/github-variables.sh')
  self.assertEqual(p['probe:actions'],'python3 scripts/vault-exec.py -- node scripts/actions-state-probe.mjs')
 def test_variables_script_sets_every_lane_switch_and_reads_org_ids_from_discovery(self):
  s=(R/'scripts/github-variables.sh').read_text()
  for v in VARS: self.assertRegex(s,rf'setvar {v} ',v)
  self.assertIn('AUTONOMOUS_RUNTIME_WIRED false',s); self.assertIn('LIVE_PUBLISHING_ENABLED false',s); self.assertIn('DURABLE_STATE_CONFIGURED true',s)
  self.assertIn('buffer-discovery.json',s); self.assertNotRegex(s,r'6ab0[0-9a-f]{20}','org ids come from the discovery file, never typed')
  self.assertNotIn('OPENROUTER',s); self.assertNotIn('BUFFER_CHANNEL',s)
  d=json.loads((R/'distribution/config/buffer-discovery.json').read_text())
  self.assertEqual(sorted(d['org_env']),sorted(f'BUFFER_ORG_ID_{c}' for c in ('MARCUS_VALE','NIA_BROOKS','CAMILLE_ROSE','MAYA_REYES')))
 def test_storage_rule_is_vault_to_stdin(self):
  t=(R/'ops/env/ENV_VAULT.md').read_text(); i=t.index('## Storage rule'); rule=t[i:]
  for needle in ('vault-exec.py','gh secret set','wrangler secret put','stdin','npm run secrets:github','npm run vars:github'): self.assertIn(needle,rule)
  self.assertNotIn('Local collection',rule); self.assertNotIn('secrets/creator-network.env` (ignored',rule)
class LaneLeavesADurableTrace(unittest.TestCase):
 def wf(self): return (R/'.github/workflows/daily-creator-network.yml').read_text()
 def test_state_check_precedes_run_and_outcome_always_follows(self):
  w=self.wf()
  pre=w.index('actions-state-probe.mjs precheck'); run=w.index('node runtime/run.mjs'); out=w.index('actions-state-probe.mjs outcome')
  self.assertLess(pre,run); self.assertLess(run,out)
  outcome_step=w[w.index('state-outcome'):]; self.assertIn('if: always()',outcome_step)
  self.assertIn('id: operate',w); self.assertIn('exit_code=$code',w); self.assertIn('steps.operate.outputs.exit_code',w)
  for step in ('state-check','state-outcome'):
   block=w[w.index(step):]; self.assertIn('CREATOR_STATE_API_TOKEN: ${{ secrets.CREATOR_STATE_API_TOKEN }}',block); self.assertIn('CREATOR_STATE_API_URL: ${{ vars.CREATOR_STATE_API_URL }}',block)
 def test_probe_writes_receipts_keyed_by_actions_run_and_reads_them_back(self):
  s=(R/'scripts/actions-state-probe.mjs').read_text()
  self.assertIn('`actions/${process.env.GITHUB_RUN_ID}`',s); self.assertIn("step:'ACTIONS_PRECHECK'",s); self.assertIn("step:'ACTIONS_OUTCOME'",s)
  self.assertIn('client.receipts(runId)',s); self.assertIn('process.exit(5)',s); self.assertIn('process.exit(6)',s)
 def test_probe_fails_closed_without_credentials(self):
  import os; e={k:v for k,v in os.environ.items() if not k.startswith('CREATOR_STATE')}
  q=subprocess.run(['node','scripts/actions-state-probe.mjs','precheck'],cwd=R,env=e,text=True,capture_output=True)
  self.assertEqual(q.returncode,3); self.assertIn('NAMED STOP',q.stderr)
 def test_worker_serves_receipts_back_and_client_reads_them(self):
  self.assertIn("parts[0]==='receipts'",(R/'cloudflare/state-worker/src/index.js').read_text())
  self.assertIn('receipts(runId)',(R/'runtime/lib/durable-state.mjs').read_text())
  self.assertIn("check('receipts read back by run_id'",(R/'scripts/state-smoke.mjs').read_text())
if __name__=='__main__': unittest.main()
