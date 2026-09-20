# Phase 9 Hostile Review — 2026-09-20

## Verdict
The Phase 9 baseline is a strong **control-plane scaffold**, but the prior description overstated production readiness. It is **not yet an autonomous operating system**. SAFE_STANDBY is the only truthful runtime state until the missing execution wiring and durable state backend exist.

## Critical findings

### HR-001 — Autonomous orchestrator was not wired to real work — CRITICAL
`launch/run.mjs` calls `runNetworkDay()` without a `stepFactory`. `runEmployeeDay()` treats a missing step function as completed and advances through PRECHECK → PERSIST. If readiness ever became READY, the runtime could report `COMPLETE` while performing no research, generation, QA, media, scheduling, confirmation, metrics, optimization, or persistence.

**Disposition:** guarded in this review baseline with a hard `runtime_wired` readiness blocker. Production must remain blocked until a real step factory is implemented and integration-tested.

### HR-002 — GitHub Actions state was ephemeral — CRITICAL
Daily and weekly workflows check out the repository read-only. Runtime writes under `state/` disappear when the runner ends. The weekly report therefore cannot reliably observe daily runtime history.

**Disposition:** hard `durable_state` readiness blocker added. A durable backend (Cloudflare D1/KV/R2 or another approved store) must be implemented before autonomous launch.

### HR-003 — Readiness could become READY without required configuration — CRITICAL
The prior readiness check validated Buffer API keys but not organization IDs/channel IDs, weekly email omitted FROM/enabled state, renderer/model configuration was not verified, and hard budget caps were not checked.

**Disposition:** readiness strengthened and explicit blockers added. It now refuses READY while runtime wiring/durable state are absent and checks the configuration that can be proven locally.

### HR-004 — Identity readiness checked directories, not approved references — HIGH
Empty `references/` directories counted as valid identity slots.

**Disposition:** readiness now requires at least one non-README file in each creator reference directory when canonical identity is required.

### HR-005 — Distribution capacity used a date as a “week” — HIGH
`reserveSlot()` used `publishAt.slice(0,10)`, creating a per-day capacity while naming/configuring it weekly.

**Disposition:** fixed to ISO week keys.

### HR-006 — Weekly employee accounting used wrong field — HIGH
Publish-job schema uses `employee`; weekly report filtered jobs by `creator_id`. Per-employee counts would be zero.

**Disposition:** fixed to accept canonical `employee` (and legacy `creator_id` defensively).

### HR-007 — Weekly report did not actually constrain “last week” — HIGH
The compiler counted the whole distribution ledger rather than the report period.

**Disposition:** report now filters jobs by relevant timestamps when available and marks records without usable timestamps as unperiodized rather than silently calling them last-week activity.

### HR-008 — Buffer workflow omitted IDs/channels from environment — HIGH
The daily workflow injected API keys only. Organization/channel refs declared in `accounts.json` were absent.

**Disposition:** workflow now maps the full declared Buffer environment inventory.

### HR-009 — Health checks were implementation-presence checks, not live proof — HIGH
Several checks returned HEALTHY because modules/contracts existed, not because the live subsystem worked.

**Disposition:** documentation/readiness truth tightened. These checks must not be used as production certification until live synthetic adapters are supplied.

### HR-010 — No dependency lock / package manifest — MEDIUM
The current Node runtime is mostly built-ins, so tests run, but there is no package manifest pinning runtime metadata or Wrangler tooling.

**Disposition:** not a current execution break. Add package/tool pinning when Cloudflare runtime deployment is implemented.

## What was actually validated in this review
- Python structural suite passes.
- Node behavioral suites pass.
- All JS/MJS files pass `node --check`.
- ZIP can be reopened.
- No external product/business repository was touched.
- No credentials were inserted.

## Launch truth
This baseline must remain **SAFE_STANDBY / NOT_READY**. The next implementation work after secret collection is not “turn it on”; it is wiring the real autonomous steps and durable Cloudflare-backed state, then proving them with integration tests.
