# Health + Self-Healing

Phase 7 implements independent employee heartbeats, network certification, synthetic checks, incident records, bounded deterministic recovery, fault isolation, and last-known-good/fallback policy.

Health states are `HEALTHY`, `DEGRADED`, `ACTION_REQUIRED`, and `UNVERIFIED`. `HEALTHY` is proof-bearing: every critical check must have `verified=true` in the current audit. Unknown failures fail closed. Deferred attribution is explicitly non-blocking. External services intentionally left unconfigured before launch remain `UNVERIFIED`, not falsely healthy.

See `SELF_HEALING_RUNBOOK.md`, `config/policy.json`, and `recovery/RECOVERY_CONTRACT.md`.
