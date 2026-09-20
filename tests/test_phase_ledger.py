"""The 15-phase ledger is the single status truth for the production-completion work; this parses it rather than
grepping prose, so a row that drifts out of the vocabulary or a phase that goes missing fails here."""
import re, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
STATES={'COMPLETE','PARTIAL','NOT STARTED','BLOCKED','UNKNOWN / REQUIRES PROOF'}
NAMES=['Buffer read-only discovery','Production gap audit','Production infrastructure','Cloud credential provisioning','Employee completion','Intelligence + content engine','Visual identities','Renderer bake-off + integration','Media production pipeline','Buffer distribution','Autonomous orchestration','Health + self-healing','Weekly owner report','Controlled production launch','Hands-off certification']
class PhaseLedger(unittest.TestCase):
 def rows(self):
  t=(ROOT/'authority/PHASE_LEDGER.md').read_text()
  return t,[m for m in re.findall(r'^\| (\d+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|$',t,re.M)]
 def test_fifteen_phases_in_order_with_valid_states(self):
  t,rows=self.rows(); self.assertEqual(len(rows),15,'ledger table must have exactly 15 phase rows')
  for i,(n,name,state,evidence) in enumerate(rows,1):
   self.assertEqual(int(n),i); self.assertEqual(name.strip(),NAMES[i-1])
   word=re.sub(r'\*|\(.*?\)|—.*','',state).strip(); self.assertIn(word,STATES,f'phase {i} state {state!r}')
   self.assertTrue(evidence.strip() and evidence.strip()!='—' or word in {'NOT STARTED'},f'phase {i} needs evidence')
 def test_phase1_is_complete_and_live_validated(self):
  t,rows=self.rows(); self.assertIn('COMPLETE',rows[0][2]); self.assertIn('LIVE VALIDATED',rows[0][2])
  self.assertTrue((ROOT/'distribution/config/buffer-discovery.json').is_file()); self.assertTrue((ROOT/'docs/BUFFER_DISCOVERY_REPORT.md').is_file())
 def test_phase4_is_complete_with_a_run_url_and_d1_receipts(self):
  import json; t,rows=self.rows(); self.assertIn('COMPLETE',rows[3][2]); self.assertIn('LIVE VALIDATED',rows[3][2])
  self.assertRegex(rows[3][3],r'https://github\.com/seq23/creator-network/actions/runs/\d+'); self.assertTrue((ROOT/'docs/PHASE4_CLOUD_CREDENTIALS.md').is_file())
  d=json.loads((ROOT/'state/proof/actions-lane-receipts.json').read_text()); self.assertTrue(d['run_id'].startswith('actions/'))
  steps={r['step']:r for r in d['receipts']}; self.assertEqual(steps['ACTIONS_PRECHECK']['status'],'PASS'); self.assertEqual(steps['ACTIONS_PRECHECK']['detail']['health'],{'ok':True,'backend':'d1'})
  self.assertIn('ACTIONS_OUTCOME',steps); self.assertEqual(steps['ACTIONS_OUTCOME']['detail']['run_url'],'https://github.com/seq23/creator-network/actions/runs/'+d['run_id'].split('/')[1])
 def test_boundaries_and_deferrals_stated(self):
  t,_=self.rows()
  for needle in ('MUST NOT mutate','Conversion attribution is a separate deferred project','buffer-access-token','never written to the repository'): self.assertIn(needle,t)
 def test_named_stops_section_exists(self):
  t,_=self.rows(); self.assertIn('## Named stops (owner-only)',t)
GAP_STATES={'IMPLEMENTED + PROVEN','IMPLEMENTED + UNPROVEN','PARTIAL','MISSING','BLOCKED'}
class GapAudit(unittest.TestCase):
 def test_every_capability_row_has_a_valid_state_and_evidence(self):
  t=(ROOT/'docs/reviews/PRODUCTION_GAP_AUDIT.md').read_text()
  rows=[m for m in re.findall(r'^\| ([^|#]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|$',t,re.M) if m[0].strip() not in ('Capability','---')]
  self.assertGreaterEqual(len(rows),30,'gap audit must classify the major capabilities, not a summary')
  for cap,state,evidence,closes in rows:
   self.assertIn(state.strip(),GAP_STATES,f'{cap.strip()!r}: {state.strip()!r}'); self.assertTrue(evidence.strip(),cap)
 def test_proven_rows_name_a_live_artifact(self):
  t=(ROOT/'docs/reviews/PRODUCTION_GAP_AUDIT.md').read_text()
  for cap,state,evidence,_ in re.findall(r'^\| ([^|#]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|$',t,re.M):
   if state.strip()=='IMPLEMENTED + PROVEN': self.assertRegex(evidence,r'docs/|state/proof/|scripts/|provisioning report|readiness',f'{cap.strip()!r} claims PROVEN without a proof artifact')
 def test_state_worker_proof_is_live_validated(self):
  import json; d=json.loads((ROOT/'state/proof/state-worker-smoke.json').read_text())
  self.assertEqual(d['status'],'LIVE_VALIDATED'); self.assertTrue(all(c['ok'] for c in d['checks'])); self.assertGreaterEqual(len(d['checks']),8)
if __name__=='__main__': unittest.main()
