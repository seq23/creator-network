# Deferred Attribution Runbook

## Authority boundary
Creator Network is standalone. Existing product/business repositories are READ-ONLY knowledge sources and MUST NOT be mutated by this repository or its coding agents. Any future downstream attribution work is a separate project requiring separate owner approval.

## Deferred objective
Later, connect creator/platform/experiment identifiers to purchases or qualified leads without making attribution a prerequisite for creator-network launch. Prefer external/native evidence (redirect tracking, platform analytics, Stripe/Gumroad/provider APIs or webhooks, existing business analytics). Never claim deeper attribution than evidence proves.

## Stable source dimensions
`src_creator`, `src_platform`, `src_experiment`, `src_icp`, `src_franchise`, `src_cta`.

## Event vocabulary
creator_landing, content_click, lead_started, lead_completed, email_captured, tool_started, checkout_started, purchase_completed, qualified_lead.

## Future-agent TODO
1. Inventory externally observable signals per destination.
2. Implement Creator-Network-owned redirect/click tracking first.
3. Add external conversion evidence adapters where APIs/webhooks permit.
4. Define an attribution ceiling per destination.
5. Keep PII out of creator-network event payloads unless a separately approved privacy design requires it.
6. Add dedupe/idempotency and synthetic tests.
7. If any destination-repo mutation is proposed, STOP and obtain separate owner approval; it is outside Creator Network scope.

## Validation
A click is not a purchase. A checkout start is not a purchase. A provider CTA click is not a qualified lead. Reports must label the deepest proven event only.
