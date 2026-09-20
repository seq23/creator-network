# Recovery Contract

Recovery is deterministic, bounded, idempotent where possible, and may not mutate production code, bypass QA, exceed budget, weaken identity locks, or duplicate publication.

Registered playbooks cover research, generation, QA, renderer, Buffer, publishing, analytics, workflow, state, budget, email, and deferred attribution. Unknown or human-only failures become `ACTION_REQUIRED`. A recovered failure is `DEGRADED` for the audit in which it occurred; it does not disappear from the incident ledger. Last-known-good state may be restored only when its provenance and compatibility are known.
