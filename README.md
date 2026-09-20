# Creator Network

Standalone control plane for four persistent virtual employees: Marcus Vale, Nia Brooks, Camille Rose, and Maya Reyes.

Current implementation: **Phase 1 + Phase 3 Intelligence Engine**. Attribution is explicitly deferred to a separate future project. Existing product/business repos are read-only knowledge sources and must not be mutated by Creator Network.

Read first: `REPO_IDENTITY.md`, `authority/PHASE_LEDGER.md`, `CODING_AGENT_MASTER_RUNBOOK.md`.


## Phase 4 status
Media Factory contracts/runtime are present. Live paid rendering is disabled and canonical reference slots are intentionally empty until approved synthetic creator images are created/selected. Next: Phase 5 Distribution.


## Phase 5 status
Distribution control is implemented with Buffer GraphQL integration, employee isolation, slot reservation, idempotency, bounded retries, publication confirmation, and live-write fail-closed gating. No external portfolio repository is a mutation target.


## Phase 7 status
Self-Healing is implemented: independent employee heartbeats, proof-bearing health certification, bounded deterministic recovery, incident tracking, synthetic-check interfaces, and employee fault isolation. Live external services remain `UNVERIFIED` until configured and actively tested; the system does not claim false health. Attribution remains deferred and existing portfolio repositories remain read-only.

## Phase 8 — Weekly Owner Reporting
The repository now contains an evidence-bound weekly owner report compiler and a Monday GitHub Actions workflow. Live email delivery is fail-closed and remains disabled until Phase 9 credentials/configuration and health proof are supplied.

## Phase 9 — Autonomous Launch + Hardening
Production-gated orchestration and readiness certification are implemented. The codebase ships in `SAFE_STANDBY`: it will not fabricate credentials, approved creator references, or external account connections. Once operator configuration passes readiness, the daily workflow is the autonomous entrypoint. Existing portfolio repositories remain read-only and attribution remains deferred.

## Hostile-review correction (2026-09-20)
Phase 9 is **not production-autonomous yet**. A hostile review found that the launch orchestrator was not wired to real subsystem steps and GitHub Actions did not provide durable cross-run state. This baseline therefore hard-blocks READY until `AUTONOMOUS_RUNTIME_WIRED=true` and `DURABLE_STATE_CONFIGURED=true` are backed by actual implementation and integration proof. See `docs/reviews/PHASE9_HOSTILE_REVIEW.md` and `ops/env/ENV_VAULT.md`.

## Production completion (2026-09-20 →)
Phase numbering moved to the 15-phase completion ledger in `authority/PHASE_LEDGER.md`. Phase 1 (Buffer read-only discovery) is live-validated: four isolated accounts, identities verified, **zero social channels connected** — connecting channels is an owner action inside each Buffer login.
