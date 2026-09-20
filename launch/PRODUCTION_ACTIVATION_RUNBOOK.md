# Production Activation Runbook

## Boundary
Only `creator-network` is an implementation target. Existing A Player Mode, ApprovalPrep, Wedding, Industry Guides, and other portfolio repositories remain read-only. Conversion attribution is deferred.

## Required human configuration before live activation
1. Add OpenRouter credential as repository/environment secret.
2. Configure each employee's own Buffer account/channel IDs and enable that employee in `distribution/config/accounts.json`.
3. Populate/approve canonical synthetic creator references before unattended face media. Edited-social fallback may operate without them.
4. Configure the approved renderer only after bake-off selection; paid rendering remains budget governed.
5. Configure weekly owner-email endpoint/token/from/to.
6. Run `node launch/run.mjs` and require readiness `READY` before enabling live workflows.

## Hardening rules
- No credential values in Git.
- No live publish without reservation + idempotency key.
- No model self-approval: QA remains separate.
- Unknown/unsafe work quarantines instead of improvising.
- External outage uses bounded retry/fallback and preserves last-known-good state.
- One employee failure is isolated from the other three.
- Paid amplification remains prohibited.
- Health claims require proof; unverified stays UNVERIFIED.

## Launch state
The repository ships in SAFE_STANDBY. This is intentional: code is production-gated, but real credentials/accounts and approved identity media cannot be fabricated by the artifact.
