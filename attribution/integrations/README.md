# Product integration kits
These are durable, vendor-neutral integration assets for Phase 2. They are not evidence that the downstream repositories were mutated. Apply only to the named canonical source repo using its own updater/validation authority.

- A Player Mode: `seq23/sprylabs-hpc-site`; canonical public source is `site/public/`; Cloudflare Pages Functions at repo root. Checkout is Gumroad, so browser/session attribution can be proven to checkout-start; purchase-completed requires a future verified Gumroad return/webhook seam and is not claimed here.
- ApprovalPrep: `seq23/approvalprep`; Astro + Cloudflare Pages; Stripe fulfillment exists. Integrate capture at site shell and propagate attribution into checkout/session metadata at the existing Stripe creation seam.
- Wedding: `seq23/dream-wedding-builder`; Next.js/TypeScript/OpenNext Cloudflare Worker; integrate capture client-side and attach normalized attribution to the existing Stripe checkout/fulfillment seam.
- Industry Guides canonical source: `seq23/local-guides-generator`; it owns `uscisexam.com`, `theaccidentguides.com`, `dentistryguides.com`, `hormonesivhair.com`, `neuroevalguides.com`. Do not hand-edit `dist/`; integrate into durable generator/source and rebuild.
- `seq23/local-guides-citation-velocity` is NOT the canonical destination source for these five domains and must not be modified for their attribution integration.
