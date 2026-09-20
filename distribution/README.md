# Phase 5 — Distribution

Creator Network owns distribution. Existing portfolio repositories are never mutated.

## Contract
A publish job is created only after QA PASS and a valid media/content package. Capacity is reserved before research/render spend. Each virtual employee has an isolated Buffer account configuration and secret reference. No API key is stored in Git.

Lifecycle: DRAFT -> RESERVED -> SCHEDULED -> SENT | RETRY_WAIT | QUARANTINED. Publication is not considered successful until Buffer reports the post in `sent` state.

Unsupported or unsafe platform automation fails closed. The system may preserve or reschedule an asset; it may not browser-automate around a provider restriction.

## Buffer read-only discovery (Phase 1, 2026-09-20)
`python3 scripts/vault-exec.py -- node scripts/buffer-discovery.mjs` runs inside a vault-injected child: each creator's key is checked against `account.email`, organizations and channels are listed, and no account/org/channel id may be visible to two creators. Output is ids only — `distribution/config/buffer-discovery.json` and `docs/BUFFER_DISCOVERY_REPORT.md`. No mutation is ever sent. Re-run it after connecting channels; `tests/test_buffer_discovery.mjs` pins the isolation law and the id-only output.
