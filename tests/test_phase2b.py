import json, pathlib, unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
class Phase2B(unittest.TestCase):
 def test_application_map(self):
  p=json.loads((ROOT/'attribution/downstream/PHASE2B_APPLICATION_MAP.json').read_text())
  self.assertFalse(p['mutation_performed'])
  self.assertEqual(len(p['repositories']),4)
  self.assertIn('seq23/local-guides-generator',[r['repo'] for r in p['repositories']])
 def test_stripe_adapter_complete_only(self):
  t=(ROOT/'attribution/downstream/stripe-metadata.js').read_text()
  for k in ['src_creator','src_platform','src_experiment','src_icp','src_franchise','src_cta']:
   self.assertIn(k,t)
  self.assertIn('return null',t)
 def test_truth_boundaries(self):
  t=(ROOT/'attribution/downstream/README.md').read_text()
  self.assertIn('UNVERIFIED',t)
  self.assertIn('never promote a click to a conversion',t)
  self.assertIn('never hand-edit `dist/`',t)
 def test_read_only_receipt(self):
  t=(ROOT/'attribution/receipts/PHASE2B_READ_ONLY_INSPECTION.md').read_text()
  self.assertIn('No GitHub write',t)
if __name__=='__main__': unittest.main()
