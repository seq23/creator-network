import json, pathlib, re, unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
class Phase2(unittest.TestCase):
 def test_worker_assets(self):
  for f in ['attribution/worker/index.js','attribution/worker/schema.sql','attribution/browser/creator-attribution.js','attribution/contracts/EVENT_TAXONOMY.md','attribution/integrations/README.md']:
   self.assertTrue((ROOT/f).is_file(),f)
 def test_schema(self):
  s=json.loads((ROOT/'schemas/attribution.schema.json').read_text())
  self.assertEqual(set(s['properties']['attribution']['required']),{'src_creator','src_platform','src_experiment','src_icp','src_franchise','src_cta'})
  self.assertEqual(len(s['properties']['event']['enum']),9)
  self.assertFalse(s['additionalProperties'])
 def test_worker_privacy_allowlist(self):
  t=(ROOT/'attribution/worker/index.js').read_text()
  for bad in ['email_address','phone_number','full_name','street_address','document_contents']:
   self.assertNotIn("'"+bad+"'",t)
  self.assertIn("INSERT OR IGNORE",t)
  self.assertIn("persistence_unconfigured",t)
 def test_browser_capture_expiry(self):
  t=(ROOT/'attribution/browser/creator-attribution.js').read_text()
  self.assertIn('30 * 24 * 60 * 60 * 1000',t)
  self.assertIn('localStorage.removeItem',t)
 def test_canonical_guides_repo_guard(self):
  t=(ROOT/'attribution/integrations/README.md').read_text()
  self.assertIn('seq23/local-guides-generator',t)
  self.assertIn('must not be modified',t)
 def test_phase_ledger_truth(self):
  t=(ROOT/'authority/PHASE_LEDGER.md').read_text()
  self.assertIn('Phase 2A',t)
  self.assertIn('downstream repository mutation is not claimed',t)
if __name__=='__main__': unittest.main()
