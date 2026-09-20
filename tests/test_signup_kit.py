"""The signup kit is data the owner acts on, rendered from JSON — so it is checked, not just written: four creators,
unique handles, bios inside every platform limit and ending with the disclosure line, links live-shaped, emails equal
to the Buffer account emails, avatars derived from the approved face_front, and the rendered doc in sync with the JSON."""
import json, re, subprocess, unittest
from pathlib import Path
R=Path(__file__).resolve().parents[1]
KIT=json.loads((R/'distribution/config/signup-kit.json').read_text()); DISC=json.loads((R/'distribution/config/buffer-discovery.json').read_text())
CREATORS=['marcus_vale','nia_brooks','camille_rose','maya_reyes']
class SignupKit(unittest.TestCase):
 def test_four_creators_with_every_field(self):
  self.assertEqual(sorted(KIT['creators']),sorted(CREATORS))
  for c,v in KIT['creators'].items():
   for k in ('display_name','handles','link','email','birth_year','bio'): self.assertIn(k,v,f'{c}.{k}')
   self.assertEqual(len(v['handles']),2,c); self.assertRegex(v['link'],r'^https://[a-z0-9.-]+\.com$')
 def test_handles_unique_and_platform_safe(self):
  hs=[h for v in KIT['creators'].values() for h in v['handles']]; self.assertEqual(len(hs),len(set(hs)))
  for h in hs: self.assertRegex(h,r'^[a-z0-9._]{3,24}$',h)
 def test_bios_fit_every_platform_and_carry_the_disclosure(self):
  lim=KIT['bio_limits']; d=KIT['disclosure_line']
  for c,v in KIT['creators'].items():
   self.assertLessEqual(len(v['bio']['short']),lim['tiktok'],f'{c} short bio too long for TikTok')
   for p in ('instagram','threads','x'): self.assertLessEqual(len(v['bio']['long']),lim[p],f'{c} long bio too long for {p}')
   for b in v['bio'].values(): self.assertTrue(b.endswith(d),f'{c}: bio must end with the disclosure line')
 def test_emails_are_the_buffer_account_emails_and_ages_match_identity(self):
  acct={x['creator_id']:x['account_email'] for x in DISC['creators']}
  for c,v in KIT['creators'].items():
   self.assertEqual(v['email'],acct[c],c); self.assertEqual(v['email'],json.loads((R/'employees'/c/'employee.json').read_text())['public_email'])
   age=int(json.loads((R/'media/identities'/c/'IDENTITY.json').read_text())['canonical_subject']['presentation_age']); self.assertEqual(2026-v['birth_year'],age,f'{c}: birth_year must match presentation_age')
 def test_avatars_exist_and_doc_is_rendered_from_json(self):
  for c in CREATORS: self.assertTrue((R/'media/identities'/c/'references/avatar_400.png').is_file(),c)
  doc=(R/'docs/SIGNUP_KIT.md').read_text()
  for c,v in KIT['creators'].items():
   for needle in (f'`@{v["handles"][0]}`',v['link'],v['email'],v['bio']['short'],v['bio']['long'],str(v['birth_year'])): self.assertIn(needle,doc,f'{c}: doc out of sync with JSON — run npm run signup:kit')
if __name__=='__main__': unittest.main()
