import json, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class Phase1Tests(unittest.TestCase):
    def load(self,p): return json.loads((ROOT/p).read_text())
    def test_registry_exactly_120_unique(self):
        d=self.load('experiments/registry.json'); ids=[x['id'] for x in d['records']]
        self.assertEqual(d['count'],120); self.assertEqual(len(ids),120); self.assertEqual(len(set(ids)),120)
    def test_each_creator_has_30(self):
        rec=self.load('experiments/registry.json')['records']
        creators={x['creator_id'] for x in rec}
        self.assertEqual(len(creators),4)
        for c in creators: self.assertEqual(sum(x['creator_id']==c for x in rec),30)
    def test_each_hypothesis_has_six_matrix_cells(self):
        rec=self.load('experiments/registry.json')['records']; groups={}
        for x in rec: groups.setdefault((x['creator_id'],x['hypothesis_code']),set()).add((x['hook_family'],x['format']))
        expected={('P','D'),('P','S'),('C','D'),('C','S'),('O','D'),('O','S')}
        self.assertEqual(len(groups),20)
        self.assertTrue(all(v==expected for v in groups.values()))
    def test_batches_are_60_each_and_partition_registry(self):
        reg={x['id'] for x in self.load('experiments/registry.json')['records']}
        b1=set(self.load('experiments/batches/batch_1.json')['experiment_ids']); b2=set(self.load('experiments/batches/batch_2.json')['experiment_ids'])
        self.assertEqual(len(b1),60); self.assertEqual(len(b2),60); self.assertFalse(b1 & b2); self.assertEqual(b1|b2,reg)
    def test_four_employee_contracts(self):
        dirs=['marcus_vale','nia_brooks','camille_rose','maya_reyes']
        for d in dirs:
            e=self.load(f'employees/{d}/employee.json'); self.assertEqual(e['id'],d); self.assertEqual(len(e['icp_hypotheses']),5)
    def test_no_live_execution_claim(self):
        n=self.load('state/network.json'); self.assertFalse(n['live_execution_enabled']); self.assertIn(n['autonomy_status'], ['NOT_IMPLEMENTED','IMPLEMENTED_PRODUCTION_GATED'])
    def test_runbook_contains_all_phases(self):
        t=(ROOT/'CODING_AGENT_MASTER_RUNBOOK.md').read_text()
        for i in range(1,10): self.assertIn(f'PHASE {i}',t)
if __name__=='__main__': unittest.main()
