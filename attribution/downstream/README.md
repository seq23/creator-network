# Phase 2B — Read-only downstream integration kit

This directory is implementation-ready guidance derived from read-only inspection of the live GitHub repositories on 2026-09-20. It does **not** mutate those repositories.

## Verified repository seams

### A Player Mode — `seq23/sprylabs-hpc-site`
- Authority inspected: `REPO_IDENTITY.md`, `config/conversion_contract.json`, `download.html`.
- Preferred public endpoint is `https://aplayermode.com`; canonical product page is `https://billionairehighperformancecoach.com/download`.
- Purchase CTA currently leaves the owned site for Gumroad (`sprylabs.gumroad.com/l/billionaire-high-performance-coach`).
- Safe owned-site integration: install browser capture on owned pages, emit `creator_landing`, and decorate/observe purchase CTA as `checkout_started` before leaving the site.
- **Unproven boundary:** the inspected repo contains no verified Gumroad sale callback/webhook seam tying a completed Gumroad purchase back to Creator Network attribution. Therefore `purchase_completed` for A Player Mode remains UNVERIFIED until a supported Gumroad completion signal is integrated and proven. Do not infer purchase from click.

### ApprovalPrep — `seq23/approvalprep`
- Authority inspected: `REPO_IDENTITY.md`, `functions/api/create-checkout-session.js`, `functions/api/stripe-webhook.js`, `functions/api/track-event.js`.
- Checkout is created server-side through Stripe.
- Exact propagation seam: add the six Creator Network attribution dimensions to Stripe Checkout Session metadata in `functions/api/create-checkout-session.js`.
- Exact completion seam: on verified `checkout.session.completed`, read those metadata fields and emit `purchase_completed` to Creator Network after local entitlement recording succeeds.
- Existing `/api/track-event` has its own privacy allowlist and must not be silently overloaded with Creator Network fields without an explicit migration.

### Wedding — `seq23/dream-wedding-builder`
- Authority inspected: `REPO_IDENTITY.md`, `components/CheckoutButton.tsx`, `app/api/checkout/route.ts`, `lib/checkout-contract.ts`, `app/api/stripe-webhook/route.ts`, `app/order/success/page.tsx`.
- Checkout form currently submits only `sku`.
- Exact propagation seam: submit the six dimensions with checkout, validate them server-side, and add them to Stripe metadata in `buildCheckoutContract`.
- Exact completion seam: after verified paid Stripe completion and successful local fulfillment writes, emit `purchase_completed` using Stripe metadata.
- Do not put customer email in Creator Network attribution events.

### Industry Guides — `seq23/local-guides-generator`
- This repo owns the five canonical hosts: `uscisexam.com`, `theaccidentguides.com`, `dentistryguides.com`, `hormonesivhair.com`, `neuroevalguides.com`.
- `local-guides-citation-velocity` is explicitly not the owner of these hosts.
- Authority inspected: `REPO_IDENTITY.md`, `templates/partials/primary_conversion_cta.html`, `templates/partials/inline_conversion_cta.html`, `scripts/build_city_sites.js`, `scripts/helpers/buyouts.js`, `scripts/validation/conversion_contract.js`, `data/buyouts.json`.
- Generated CTA anchors already expose structured context through `data-provider-type`, `data-page-src`, `data-button-source`, `data-intent-type`, `data-market-slug`, `data-page-kind`, and `data-vertical-key`.
- Exact safe seam: install browser attribution in the generator/template layer, never hand-edit `dist/`; emit landing and CTA intent events using existing data attributes.
- `data/buyouts.json` was empty when inspected. Provider lead routing/completion depends on configured sponsor/buyout state. `qualified_lead` must only be emitted from an actual lead-completion surface or provider handoff receipt; CTA clicks are not qualified leads.

## Common rule
The six dimensions are:
`src_creator`, `src_platform`, `src_experiment`, `src_icp`, `src_franchise`, `src_cta`.

They may be persisted in browser state and server/payment metadata. They must not contain customer PII. Purchase/qualified-lead events require a verified completion signal; never promote a click to a conversion.
