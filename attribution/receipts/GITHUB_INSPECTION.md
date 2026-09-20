# Phase 2 GitHub inspection receipt
Inspected current GitHub repository identity/stack before designing downstream integration. This is context only, not source-of-truth mutation input.
- `seq23/sprylabs-hpc-site`: generated static publishing system; canonical public source `site/public/`; Cloudflare Pages Functions at root; Gumroad checkout.
- `seq23/approvalprep`: Astro static-first + Cloudflare Pages; V1 no accounts/customer-document persistence.
- `seq23/dream-wedding-builder`: Next.js + TypeScript, OpenNext on Cloudflare Workers, D1/Stripe tooling present.
- `seq23/local-guides-generator`: canonical generator/source for uscisexam.com, theaccidentguides.com, dentistryguides.com, hormonesivhair.com, neuroevalguides.com; snapshot mode only; do not edit dist directly.
- `seq23/local-guides-citation-velocity`: separate citation-velocity property and not the canonical source for those five destinations.
No downstream mutation is represented by this receipt.
