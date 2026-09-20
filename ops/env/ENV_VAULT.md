# Creator Network Environment Vault

This is the canonical inventory of configuration and secret material required by Creator Network. **Never put secret values in Git.** Values belong in local ignored files during setup and in the deployment secret stores (GitHub Actions secrets and/or Cloudflare Wrangler secrets) once the relevant runtime exists.

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
- `DURABLE_STATE_CONFIGURED=false` until Cloudflare-backed persistence passes write/read/recovery tests.

## Storage rule
1. Local collection: `secrets/creator-network.env` (ignored, mode 600).
2. GitHub Actions: secrets/variables mapped explicitly in workflow YAML.
3. Cloudflare Worker secrets: use Wrangler `secret put` after the Worker exists.
4. Never copy secret values into `.env.example`, docs, state JSON, test fixtures, logs, or ZIP receipts.
