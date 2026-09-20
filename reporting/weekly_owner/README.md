# Weekly Owner Reporting

Phase 8 compiles the owner-facing operating report from persisted Creator Network state. It never invents performance, spend, conversion value, pipeline coverage, or health proof.

Before a live send, Phase 9 must run reconciliation and the Network Health Audit. `HEALTHY` may appear only when the persisted health state is proof-bearing HEALTHY. Unconfigured services remain UNVERIFIED.

Delivery is fail-closed. `WEEKLY_REPORT_DELIVERY_ENABLED=true` plus endpoint/token/from/to environment configuration is required. Secrets are never stored in Git.

Deferred conversion attribution is reported as deferred and is not a launch-health blocker by owner direction.
