# Creator Network Durable State Worker

This Worker is the durable cross-run state boundary for GitHub Actions. D1 stores state objects and append-only runtime receipts. It contains no product-repository logic and does not touch any destination repo.

## Live (since 2026-09-20)
- Worker: `creator-network-state` → `https://creator-network-state.seq-taylor.workers.dev`
- D1: `creator-network-state` (`fe891a54-7870-4c2d-b4da-ec5ea7456989`, WNAM), migration `0001_init.sql` applied remotely
- Bearer token: vault credential `creator-network-state-api-token`, injected as `CREATOR_STATE_API_TOKEN`; Worker secret `STATE_API_TOKEN`
- Proof: `npm run smoke:state` → `state/proof/state-worker-smoke.json` (401 on bad/no token, health→D1, PUT/GET versioning, idempotent receipts)

## Operating it
| Action | Command | Notes |
|---|---|---|
| Deploy | `npm run deploy:state` | pinned `wrangler@4.76.0`; `land` runs this after every merge to `main` |
| Rotate the bearer | `repo vault set creator-network-state-api-token --from-file <0600 file>` then `npm run secret:state` | value moves Keychain → stdin → Worker; never argv, never a file in the repo |
| Migrate | `npx wrangler@4.76.0 d1 migrations apply creator-network-state --remote --config cloudflare/state-worker/wrangler.toml` | new migrations go in `migrations/NNNN_*.sql` |
| Prove | `npm run smoke:state` | writes only under `smoke/` keys |

GitHub Actions gets `CREATOR_STATE_API_URL` (variable) and `CREATOR_STATE_API_TOKEN` (secret) in Phase 4; until then the daily lane stays in SAFE_STANDBY.
