# Production Hardening Remediation

## Scope
Remediates HR-001 and HR-002 from the Phase 9 hostile review without modifying any product/business repository.

## HR-001 runtime wiring
`runtime/run.mjs` now invokes a concrete step factory. Missing steps fail closed rather than being silently counted as complete. The runtime performs durable precheck, state health, experiment planning, distribution reservation, OpenRouter generation, independent OpenRouter QA plus deterministic QA policy, media-mode selection, Buffer scheduling, and durable persistence/receipts. Confirmation, metrics, and optimization are explicitly recorded as deferred when the post has not published yet; they are no longer silently represented as completed work.

Maya high-stakes material remains fail-closed unless freshness/evidence is proven. This remediation does not weaken that rule.

## HR-002 durable state
A deployable Cloudflare Worker + D1 state service now owns cross-run state and append-only runtime receipts. GitHub Actions calls the service using a bearer token. The Worker exposes only health, keyed state GET/PUT, and receipt POST endpoints.

## Activation remains gated
This artifact does not contain real credentials, Cloudflare resource IDs, approved face assets, or enabled Buffer accounts. Production remains NOT_READY until those are supplied and live health/configuration checks pass.
