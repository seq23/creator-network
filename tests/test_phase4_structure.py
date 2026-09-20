from pathlib import Path
import json
r=Path(__file__).resolve().parents[1]
req=['media/config/media_policy.json','media/config/renderer_registry.json','media/lib/media-director.js','media/lib/cost-governor.js','media/lib/job-state.js','media/renderers/http-renderer.js','media/renderers/local-ffmpeg.js','media/bakeoff/BAKEOFF_PROTOCOL.md','state/media.json','schemas/media_job.schema.json']
for p in req: assert (r/p).exists(),p
for c in ['marcus_vale','nia_brooks','camille_rose','maya_reyes']:
 p=r/'media/identities'/c
 assert (p/'IDENTITY.json').exists() and (p/'VOICE.json').exists() and (p/'references/README.md').exists()
 d=json.loads((p/'IDENTITY.json').read_text()); assert d['canonical_subject']['synthetic'] is True
s=json.loads((r/'state/media.json').read_text()); assert s['live_paid_rendering_enabled'] is False
print('phase4 structure PASS')
