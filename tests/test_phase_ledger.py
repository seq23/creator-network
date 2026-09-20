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
 def test_boundaries_and_deferrals_stated(self):
  t,_=self.rows()
  for needle in ('MUST NOT mutate','Conversion attribution is a separate deferred project','buffer-access-token','never written to the repository'): self.assertIn(needle,t)
 def test_named_stops_section_exists(self):
  t,_=self.rows(); self.assertIn('## Named stops (owner-only)',t)
if __name__=='__main__': unittest.main()
