# Creator Network Durable State Worker

This Worker is the durable cross-run state boundary for GitHub Actions. D1 stores state objects and append-only runtime receipts. It contains no product-repository logic and does not touch any destination repo.

## Deploy with Wrangler
1. Wrangler is invoked at the pinned CLI version `4.37.1`.
2. `npx wrangler@4.37.1 d1 create creator-network-state`
3. Put the returned database ID in `cloudflare/state-worker/wrangler.toml`.
4. `npx wrangler@4.37.1 d1 migrations apply creator-network-state --remote --config cloudflare/state-worker/wrangler.toml`
5. Generate a high-entropy `CREATOR_STATE_API_TOKEN` locally and run `npx wrangler@4.37.1 secret put STATE_API_TOKEN --config cloudflare/state-worker/wrangler.toml`.
6. `npx wrangler@4.37.1 deploy --config cloudflare/state-worker/wrangler.toml`
7. Set `CREATOR_STATE_API_URL` to the deployed Worker URL and store the same token as the GitHub secret `CREATOR_STATE_API_TOKEN`.

Do not commit the token or a populated local env vault.
