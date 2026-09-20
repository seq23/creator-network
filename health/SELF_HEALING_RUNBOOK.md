# Self-Healing Runbook

## Authority
Self-healing is deterministic, bounded, idempotent where possible, and may never bypass QA, budget, identity, security, platform, or publication-duplication controls. No LLM may rewrite production code as a recovery action.

## Certification sequence
1. Run each employee heartbeat independently.
2. Run synthetic tests for every configured critical path.
3. Classify failures.
4. Apply only the registered deterministic playbook with bounded retries.
5. Re-run the failed check.
6. Record incident and recovery result.
7. Certify health only from the post-recovery checks.

## Health meanings
- `HEALTHY`: every launch-critical check was actively verified in the current audit. Deferred checks may be unverified only when policy marks them non-blocking.
- `DEGRADED`: a known failure occurred and a safe recovery/fallback is active; work may continue within the fallback's scope.
- `ACTION_REQUIRED`: human-only, unknown, credential/account/payment/identity, or unrecoverable failure prevents safe operation for the affected scope.
- `UNVERIFIED`: a required path was not actually tested. It must never be represented as healthy.

## Fault isolation
Employee heartbeats are independent. An `ACTION_REQUIRED` state for one employee does not stop healthy/degraded/unverified employees unless the failed subsystem is a shared network dependency. Shared dependency failures are recorded at network scope.

## Registered recovery behavior
- Research: retry -> approved provider fallback -> approved fresh-enough knowledge or skip.
- Generation: retry once -> approved model fallback -> preserve/skip.
- QA: bounded revision -> quarantine. Never auto-approve.
- Renderer: retry -> alternate renderer -> edited-social fallback.
- Buffer/publishing: retry/backoff -> reconcile -> reschedule -> quarantine/preserve. Never duplicate.
- Analytics: retry -> mark incomplete -> HOLD optimizer.
- Budget: free-format mode or queue. Never exceed cap.
- Workflow/state: idempotent retry -> last-known-good -> action required.
- Email: retry -> preserve report -> action required when delivery is required.
- Attribution: deferred by owner; it is not a launch-critical Creator Network health check until a separately approved project enables it.
