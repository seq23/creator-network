from pathlib import Path
import json
r=Path(__file__).resolve().parents[1]
req=['distribution/config/policy.json','distribution/config/accounts.json','distribution/buffer/client.mjs','distribution/lib/slots.mjs','distribution/lib/publisher.mjs','schemas/publish_job.schema.json','state/distribution.json','distribution/BUFFER_API_CONTRACT.md']
for p in req: assert (r/p).exists(),p
a=json.loads((r/'distribution/config/accounts.json').read_text()); assert len(a)==4
for v in a.values(): assert v['credential_ref'].startswith('env:') and v['enabled'] is False
p=json.loads((r/'distribution/config/policy.json').read_text()); assert p['live_writes_enabled'] is False and p['confirmation']['required'] is True
text=''.join((r/p).read_text(errors='ignore') for p in req if (r/p).suffix in {'.js','.json','.md'})
assert 'sprylabs-hpc-site' not in text and 'approvalprep/functions' not in text
print('Phase 5 structural tests: PASS')
