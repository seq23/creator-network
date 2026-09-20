"""Phase 7 — visual identities. Every creator has a casting block (ethnicity stated, four different backgrounds — the
owner's rule), six canonical reference slots that exist and hash-match their manifest, all derived from one face_front,
real creator emails, and — once the ledger calls row 7 COMPLETE — an owner_approved stamp on every manifest."""
import hashlib, json, re, unittest
from pathlib import Path
R=Path(__file__).resolve().parents[1]; ID=R/'media/identities'
CREATORS=['marcus_vale','nia_brooks','camille_rose','maya_reyes']; SLOTS=['face_front','face_left','face_right','face_smile','face_neutral','body']
def ident(c): return json.loads((ID/c/'IDENTITY.json').read_text())
def manifest(c): return json.loads((ID/c/'references/manifest.json').read_text())
class Casting(unittest.TestCase):
 def test_every_creator_states_ethnicity_skin_hair_and_cites_research(self):
  for c in CREATORS:
   cast=ident(c).get('casting'); self.assertIsInstance(cast,dict,c)
   for k in ('ethnicity','skin_tone','hair','features','signature','research','rule'): self.assertTrue(cast.get(k),f'{c}.casting.{k}')
   anchor=cast['research'].split('#')[1]; self.assertIn(f'## {anchor.replace("-"," ").title()}'.split(' — ')[0].lower(),(R/'docs/PHASE7_CASTING_RESEARCH.md').read_text().lower())
 def test_four_different_backgrounds(self):
  eth=[ident(c)['casting']['ethnicity'].split(' (')[0].split(' — ')[0].lower() for c in CREATORS]
  self.assertEqual(len(set(eth)),4,f'owner rule: four different backgrounds, got {eth}')
  self.assertTrue(any('black' in e for e in eth),'a Black lead is never missing')
 def test_generator_states_casting_in_every_prompt(self):
  s=(R/'scripts/identity-references.mjs').read_text(); self.assertIn('${c.ethnicity}',s); self.assertIn('${c.skin_tone}',s); self.assertIn('${c.hair}',s)
  self.assertIn('OPENAI_IMAGE_API_KEY',s); self.assertIn('NAMED STOP',s); self.assertIn("if(fs.existsSync(out)&&!force)",s)
  self.assertEqual(json.loads((R/'package.json').read_text())['scripts']['identities:generate'],'python3 scripts/vault-exec.py -- node scripts/identity-references.mjs')
class References(unittest.TestCase):
 def test_six_slots_exist_and_hash_match_manifest(self):
  for c in CREATORS:
   slots=ident(c)['reference_slots']; self.assertEqual(sorted(slots),sorted(SLOTS)); m=manifest(c)
   for s in SLOTS:
    p=ID/c/slots[s]; self.assertTrue(p.is_file(),f'{c}/{s} missing'); self.assertGreater(p.stat().st_size,200_000,f'{c}/{s} suspiciously small')
    self.assertEqual(hashlib.sha256(p.read_bytes()).hexdigest(),m['slots'][s]['sha256'],f'{c}/{s} does not match manifest — regenerate or restore')
    self.assertEqual(m['slots'][s]['derived_from'],None if s=='face_front' else 'face_front.png')
    self.assertIn(ident(c)['casting']['ethnicity'],m['slots'][s]['prompt'],f'{c}/{s} prompt did not state ethnicity')
 def test_contact_sheet_exists(self): self.assertTrue((ID/'CONTACT_SHEET.png').is_file())
 def test_owner_approval_required_once_ledger_says_complete(self):
  t=(R/'authority/PHASE_LEDGER.md').read_text(); row=re.search(r'^\| 7 \| Visual identities \| ([^|]+) \|',t,re.M).group(1)
  if 'COMPLETE' in row:
   for c in CREATORS: a=manifest(c).get('owner_approved'); self.assertTrue(a and a.get('at'),f'{c}: ledger says COMPLETE but manifest has no owner_approved stamp')
class Emails(unittest.TestCase):
 def test_public_emails_are_real_creator_addresses(self):
  disc={x['creator_id']:x['account_email'] for x in json.loads((R/'distribution/config/buffer-discovery.json').read_text())['creators']}
  for c in CREATORS:
   e=json.loads((R/'employees'/c/'employee.json').read_text())['public_email']; self.assertNotIn('[',e,c); self.assertEqual(e,disc[c],f'{c}: public_email must be the Buffer account email')
if __name__=='__main__': unittest.main()
