# Creator Network Environment Vault

This is the canonical inventory of configuration and secret material required by Creator Network. **Never put secret values in Git.** Values live in the owner's vault and reach GitHub Actions / Cloudflare only through the stdin paths in *Storage rule* below.

## Collection states
- `REQUIRED_NOW`: collect before production wiring/activation.
- `PROVIDER_SELECTION`: collect only after a renderer/email provider is selected.
- `IDENTIFIER`: not secret, but required configuration.
- `CONTROL`: non-secret runtime switch.

## Intelligence
| Variable | Type | State | Purpose |
|---|---|---|---|
| `OPENROUTER_API_KEY` | secret | REQUIRED_NOW | LLM/research access through OpenRouter |
| `OPENROUTER_GENERATION_MODEL` | identifier | REQUIRED_NOW | Explicit generation model ID |
| `OPENROUTER_QA_MODEL` | identifier | REQUIRED_NOW | Separate QA model ID |
| `OPENROUTER_HIGH_STAKES_MODEL` | identifier | REQUIRED_NOW | High-stakes/current research model |

## Buffer — Marcus Vale
`BUFFER_API_KEY_MARCUS_VALE` (secret), `BUFFER_ORG_ID_MARCUS_VALE` and five `BUFFER_CHANNEL_MARCUS_VALE_*` IDs for INSTAGRAM, THREADS, X, TIKTOK, YOUTUBE.

## Buffer — Nia Brooks
`BUFFER_API_KEY_NIA_BROOKS` (secret), `BUFFER_ORG_ID_NIA_BROOKS` and five `BUFFER_CHANNEL_NIA_BROOKS_*` IDs.

## Buffer — Camille Rose
`BUFFER_API_KEY_CAMILLE_ROSE` (secret), `BUFFER_ORG_ID_CAMILLE_ROSE` and five `BUFFER_CHANNEL_CAMILLE_ROSE_*` IDs.

## Buffer — Maya Reyes
`BUFFER_API_KEY_MAYA_REYES` (secret), `BUFFER_ORG_ID_MAYA_REYES` and five `BUFFER_CHANNEL_MAYA_REYES_*` IDs.

## Media providers
Collect only after the renderer bake-off selects providers:
- `TALKING_AVATAR_API_URL` — identifier
- `TALKING_AVATAR_API_KEY` — secret
- `IMAGE_VIDEO_API_URL` — identifier
- `IMAGE_VIDEO_API_KEY` — secret

If the selected provider uses different names, add them to the schema before activation rather than hiding them in code.

## Weekly owner email
- `WEEKLY_REPORT_DELIVERY_ENABLED` — control (`false` until verified)
- `WEEKLY_EMAIL_ENDPOINT` — identifier
- `WEEKLY_EMAIL_TOKEN` — secret
- `WEEKLY_OWNER_EMAIL` — identifier
- `WEEKLY_REPORT_FROM` — identifier

## Cloudflare runtime / durable state
Live since 2026-09-20 (Phase 3). IDs are configuration, not secrets:
- `CLOUDFLARE_ACCOUNT_ID` — `8d147e242033699dd37c6f5a451f48d2` (in `cloudflare/state-worker/wrangler.toml`)
- `CREATOR_NETWORK_D1_DATABASE_ID` — `fe891a54-7870-4c2d-b4da-ec5ea7456989`
- `CREATOR_STATE_API_URL` — `https://creator-network-state.seq-taylor.workers.dev`
- `CREATOR_STATE_API_TOKEN` — secret; vault credential `creator-network-state-api-token`
- `CREATOR_NETWORK_R2_BUCKET` / `CREATOR_NETWORK_KV_NAMESPACE_ID` — not created; only if the media library (Phase 9) needs object storage

## Runtime controls
- `REQUIRE_LIVE_READY=false` until final validation.
- `AUTONOMOUS_RUNTIME_WIRED=false` until real step wiring passes integration tests.
- `DURABLE_STATE_CONFIGURED=true` since Phase 3/4 (2026-09-20): write/read/receipt round-trips proven live by `npm run smoke:state`.

## Storage rule
Secret values exist in exactly one place at rest: the owner's Repo Operator vault (Keychain), authorised to project
`creator-network`. There is no local env file, no `.env.example`, no `secrets/` directory — that path was deleted in
Phase 4 (2026-09-20) because a plaintext file contradicts the vault contract.
1. **vault → `scripts/vault-exec.py` → child process env.** The value is never an argument, never on disk, and the
   child's output is redacted. Every command that needs a secret runs as `python3 scripts/vault-exec.py -- <cmd>`.
2. **GitHub Actions secrets:** `npm run secrets:github` (`scripts/github-secrets.sh` inside the vault child) pipes
   each value to `gh secret set NAME -R seq23/creator-network` on stdin and prints names only. Prove with
   `gh secret list`.
3. **GitHub Actions variables** (non-secret ids and switches): `npm run vars:github` (`scripts/github-variables.sh`);
   org ids are read from `distribution/config/buffer-discovery.json`, never typed.
4. **Cloudflare Worker secrets:** `npm run secret:state` pipes the vault value to `wrangler secret put` on stdin.
5. Workflow YAML maps every secret/variable explicitly (`.github/workflows/daily-creator-network.yml`); the lane's
   `state-check` step proves the injected credentials reach D1 before anything runs.
6. Never copy secret values into docs, state JSON, test fixtures, logs, receipts or ZIP receipts.
