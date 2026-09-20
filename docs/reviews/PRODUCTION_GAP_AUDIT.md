# Production Gap Audit — 2026-09-20

Classification of every major capability in the 2026-09-20 handoff against the code, tests and live infrastructure — not filenames. `tests/test_phase_ledger.py` parses this table; every row's state must be one of `IMPLEMENTED + PROVEN`, `IMPLEMENTED + UNPROVEN`, `PARTIAL`, `MISSING`, `BLOCKED`. "Proven" means exercised against the real dependency, not a mock.

| Capability | State | Evidence | Closes in |
|---|---|---|---|
| Four isolated Buffer accounts + credentials | IMPLEMENTED + PROVEN | `docs/BUFFER_DISCOVERY_REPORT.md`: identities verified, isolation PASS | — |
| Buffer read-only discovery | IMPLEMENTED + PROVEN | `scripts/buffer-discovery.mjs`, live 2026-09-20 | — |
| Social channels to post to | BLOCKED | 0 channels on all four accounts; the social accounts do not exist (owner, 2026-09-20) | signup kit after Phase 7 |
| Local credential injection (vault → child) | IMPLEMENTED + PROVEN | `scripts/vault-exec.py`; inherited provider keys scrubbed, output redacted | — |
| Durable state (Worker + D1) | IMPLEMENTED + PROVEN | `state/proof/state-worker-smoke.json`: 401, health→D1, versioned PUT/GET, idempotent receipts | — |
| Cloud credential provisioning (GitHub secrets/vars) | IMPLEMENTED + PROVEN | `docs/PHASE4_CLOUD_CREDENTIALS.md`: 5 secrets + 15 variables from the vault via stdin (`gh secret list` 2026-09-20); plaintext path deleted | — |
| Employee persona/boundary contracts | IMPLEMENTED + UNPROVEN | `employees/*/employee.json` schema-validated; never consumed by a live generation | Phase 5/6 |
| Employee memory/state | PARTIAL | `memory.json` empty for all four; runtime persists `content_history` only | Phase 5/11 |
| Product knowledge packs | MISSING | `knowledge/` is a README | Phase 5 |
| Research routing (tiers) | IMPLEMENTED + UNPROVEN | `research-router.js` unit-tested; runtime INTELLIGENCE step never calls it | Phase 6 |
| OpenRouter integration | IMPLEMENTED + UNPROVEN | `providers/openrouter.js`; credential exists in vault, not authorised; models unset | Phase 6 |
| Evidence packs | MISSING | schema only (`knowledge_pack.schema.json`), one fixture | Phase 6 |
| Content generation | IMPLEMENTED + UNPROVEN | step factory prompt → JSON; never run against a model | Phase 6 |
| Independent QA + states (PASS/REVISE/HUMAN_REVIEW/REJECT) | IMPLEMENTED + UNPROVEN | `qa-policy.js` + model audit; unit-tested; no bounded regeneration loop in runtime | Phase 6 |
| Quarantine | IMPLEMENTED + UNPROVEN | `quarantine.js` unit-tested; runtime halts but never writes a quarantine record | Phase 6 |
| Budget governors (intelligence + media) | IMPLEMENTED + UNPROVEN | unit-tested; runtime never consults them | Phase 6/9 |
| Canonical visual identities | IMPLEMENTED + PROVEN | `docs/PHASE7_CASTING_RESEARCH.md`; 24 hash-locked, owner-approved references, `media/identities/CONTACT_SHEET.png` | — |
| Renderer abstraction | PARTIAL | registry + generic HTTP submit; no vendor, no result polling, no asset retrieval | Phase 8 |
| Renderer bake-off | MISSING | protocol doc only | Phase 8 |
| Media assembly (EDITED_SOCIAL) | PARTIAL | `local-ffmpeg.js` probe only; MEDIA step chooses a mode, renders nothing | Phase 9 |
| Media library / storage / provenance | MISSING | README; no R2 | Phase 9 |
| Publish jobs + idempotency + retry + confirm | IMPLEMENTED + UNPROVEN | `distribution/lib/*` mock-tested; `createPost` never sent live | Phase 10 |
| Capacity reservation before spend | IMPLEMENTED + UNPROVEN | `slots.mjs` ISO-week keyed; RESERVE precedes INTELLIGENCE in runtime | Phase 10 |
| Daily loop PRECHECK→PERSIST | PARTIAL | wired; CONFIRM/METRICS/OPTIMIZE are DEFERRED no-ops nothing revisits | Phase 11 |
| Fail-closed standby | IMPLEMENTED + PROVEN | `runtime/run.mjs` refuses without readiness; exits 0 but the lane now writes D1 receipts every run (`state/proof/actions-lane-receipts.json`) | Phase 11 |
| Pipeline floor (3 days) | PARTIAL | policy value exists; no inventory, nothing enforces it | Phase 11 |
| Independent heartbeats | IMPLEMENTED + UNPROVEN | `runHeartbeat` unit-tested; runtime never calls it | Phase 12 |
| Synthetic live checks | MISSING | every live check is an `UNVERIFIED` placeholder | Phase 12 |
| Deterministic recovery | IMPLEMENTED + UNPROVEN | `boundedRecover` unit-tested; runtime never calls it | Phase 12 |
| Analytics normalisation + optimizer | IMPLEMENTED + UNPROVEN | unit-tested; no metrics are ever ingested | Phase 11/13 |
| Weekly report compiler | IMPLEMENTED + UNPROVEN | reads local `state/*.json` that Actions never persists; not wired to D1 | Phase 13 |
| Weekly report delivery | BLOCKED | Resend-shaped sender; no provider chosen; no authenticated outbound domain | Phase 13 |
| Inbound creator email | IMPLEMENTED + PROVEN | four Cloudflare Email Routing rules → owner inbox (provisioning report) | — |
| Outbound creator email | MISSING | no SPF/DKIM/DMARC sending path; not required for publishing | later, if needed |
| Portfolio-repo boundary | IMPLEMENTED + PROVEN | policy flag + readiness check + no code path touches another repo | — |
| Conversion attribution | BLOCKED | deferred by owner; reference code parked under `attribution/` | separate project |
