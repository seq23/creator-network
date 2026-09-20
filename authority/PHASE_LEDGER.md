# Phase Ledger

## Full intended system
Standalone hands-off network of four persistent virtual employees — Marcus Vale, Nia Brooks, Camille Rose, Maya Reyes — who research when necessary → plan → generate → QA → create media → schedule/publish through their own Buffer accounts → confirm → measure available platform signals → learn → maintain a pipeline floor → self-check → self-heal → report weekly. Existing product/business repositories are read-only knowledge sources and are never Creator Network mutation targets. Conversion attribution is a separate deferred project.

## Numbering
This ledger uses the **15-phase production-completion numbering** from the 2026-09-20 handoff. The original build used a 10-phase numbering (kept below under *Build history*); "Phase N" anywhere else in this repository refers to the build history unless it cites this table.

## Phase ledger (15)

| # | Phase | State | Evidence / what is still missing |
|---|---|---|---|
| 1 | Buffer read-only discovery | **COMPLETE — LIVE VALIDATED** (2026-09-20) | `scripts/vault-exec.py` + `scripts/buffer-discovery.mjs`; four keys verified against `account.email`, isolation PASS, ids in `distribution/config/buffer-discovery.json`, report in `docs/BUFFER_DISCOVERY_REPORT.md`. Finding: **zero social channels — the social accounts do not exist yet.** |
| 2 | Production gap audit | **COMPLETE** (2026-09-20) | `docs/reviews/PRODUCTION_GAP_AUDIT.md` — 36 capabilities classified, table parsed by `tests/test_phase_ledger.py` |
| 3 | Production infrastructure | **COMPLETE — LIVE VALIDATED** (2026-09-20) | Worker `creator-network-state` + D1 `fe891a54…` deployed, migration applied, bearer in vault, `state/proof/state-worker-smoke.json`; `land` redeploys it. R2/KV deliberately not created until Phase 9 needs them |
| 4 | Cloud credential provisioning | **COMPLETE — LIVE VALIDATED** (2026-09-20) | 5 GitHub secrets via vault → `gh secret set` (stdin), 15 variables; plaintext env path deleted; daily lane `state-check`/`state-outcome` write D1 receipts — run https://github.com/seq23/creator-network/actions/runs/35540046455, read back in `state/proof/actions-lane-receipts.json`; `docs/PHASE4_CLOUD_CREDENTIALS.md` |
| 5 | Employee completion | PARTIAL | contracts exist; memory empty; `knowledge/` is a README; three `public_email` values are placeholders |
| 6 | Intelligence + content engine | PARTIAL | router/QA policy/budget governor/freshness are unit-tested; the runtime INTELLIGENCE step performs no research, builds no evidence pack, never consults the budget governor; model ids unset |
| 7 | Visual identities | **COMPLETE — OWNER APPROVED** (2026-09-20) | casting researched (`docs/PHASE7_CASTING_RESEARCH.md`), four backgrounds recorded in each `IDENTITY.json`; 24 reference slots generated (gpt-image-2), hash-locked and `owner_approved` in every `references/manifest.json`; `media/identities/CONTACT_SHEET.png`; real `public_email`s |
| 8 | Renderer bake-off + integration | NOT STARTED | `media/bakeoff/BAKEOFF_PROTOCOL.md` only; no vendor selected; paid renderers disabled |
| 9 | Media production pipeline | PARTIAL | contracts, director, job-state, cost governor; the MEDIA step chooses a mode but renders nothing; library empty |
| 10 | Buffer distribution | PARTIAL | `createPost`/confirm/slots/idempotency/retry are mock-tested; never exercised live; all four accounts `enabled:false`; **no channels exist to post to** |
| 11 | Autonomous orchestration | PARTIAL | `runtime/run.mjs` wires PRECHECK→PERSIST; CONFIRM/METRICS/OPTIMIZE are `DEFERRED` no-ops that no later run picks up; SAFE_STANDBY still exits 0 but since Phase 4 leaves `ACTIONS_PRECHECK`/`ACTIONS_OUTCOME` receipts in D1 |
| 12 | Health + self-healing | PARTIAL | framework and playbooks unit-tested; nothing in the runtime invokes `runHeartbeat`/`boundedRecover`; every live check is an `UNVERIFIED` placeholder |
| 13 | Weekly owner report | PARTIAL | compiler + sender unit-tested; reads local `state/*.json` that GitHub Actions never persists; not wired to durable state; delivery disabled; no provider chosen |
| 14 | Controlled production launch | NOT STARTED | — |
| 15 | Hands-off certification | NOT STARTED | — |

## Current phase
Phases 1–4 and 7 delivered. **Next: the per-creator social-account signup kit** (owner-only signup), then 5/6/8/9/11/12/13, then 10/14/15.

## Named stops (owner-only)
- **The creators' social accounts do not exist yet** (owner, 2026-09-20), so no Buffer channels exist. Signup needs SMS/CAPTCHA on real hardware and automating it would flag the accounts at birth. Sequence: Phase 7 produces approved avatars → a per-creator signup kit (handle, bio, link, avatar, which creator email) → owner signs up and connects each channel in Buffer → re-run `scripts/buffer-discovery.mjs`. Phases 10 and 14 wait on this; nothing else does.

## Permanent repository boundary
Creator Network may READ portfolio repositories for product knowledge. It MUST NOT mutate them. Any future downstream mutation requires a separate owner-approved project.

## Credential law
Four Buffer credentials, one per creator, authorised to project `creator-network` in the owner's Repo Operator vault. The legacy `buffer-access-token` is not this project's and is never used. Values reach a process only through a vault-injected child (`scripts/vault-exec.py`) and are never written to the repository, printed, or placed in argv.

## Build history (original 10-phase numbering)
1. Control Plane Foundation — implemented.
2. Attribution Architecture — deferred; runbook retained at `docs/DEFERRED_ATTRIBUTION_RUNBOOK.md`; not launch-blocking.
3. Intelligence Engine — implemented; live provider credentials/spend disabled by default.
4. Media Factory — implemented; canonical reference images, renderer bake-off, and live rendering unconfigured.
5. Distribution — implemented; live credentials/accounts and publishing disabled.
6. Analytics + Optimizer — implemented; organic allocation only, paid amplification blocked.
7. Self-Healing — implemented; live external-path certification UNVERIFIED.
8. Weekly Owner Reporting — implemented; live delivery disabled.
9. Autonomous Launch + Hardening — production-gated, fail-closed orchestration; hostile review (`docs/reviews/PHASE9_HOSTILE_REVIEW.md`) and remediation (`docs/reviews/PRODUCTION_HARDENING_REMEDIATION.md`) applied.
10. Deferred Conversion Attribution Integration — separate future project, separate approval.
