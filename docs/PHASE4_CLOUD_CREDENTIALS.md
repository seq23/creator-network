# Phase 4 — Cloud credential provisioning (LIVE VALIDATED 2026-09-20)

Every value reached GitHub through `vault → scripts/vault-exec.py → gh secret set` on stdin. Nothing was typed, nothing
was written to a file, nothing was printed. The plaintext `secrets/creator-network.env` path and its helpers are gone.

## GitHub Actions secrets — `gh secret list -R seq23/creator-network`
| Name | Set (UTC) | Source |
|---|---|---|
| `BUFFER_API_KEY_MARCUS_VALE` | 2026-09-20T21:53:31Z | vault `creator-network` |
| `BUFFER_API_KEY_NIA_BROOKS` | 2026-09-20T21:53:32Z | vault `creator-network` |
| `BUFFER_API_KEY_CAMILLE_ROSE` | 2026-09-20T21:53:33Z | vault `creator-network` |
| `BUFFER_API_KEY_MAYA_REYES` | 2026-09-20T21:53:33Z | vault `creator-network` |
| `CREATOR_STATE_API_TOKEN` | 2026-09-20T21:53:34Z | vault `creator-network-state-api-token` |

Re-run: `npm run secrets:github` (idempotent; rotates all five to whatever the vault holds).

## GitHub Actions variables — `gh variable list -R seq23/creator-network`
| Name | Value | Why |
|---|---|---|
| `CREATOR_STATE_API_URL` | `https://creator-network-state.seq-taylor.workers.dev` | Phase 3 Worker |
| `DURABLE_STATE_CONFIGURED` | `true` | proven by `state/proof/state-worker-smoke.json` |
| `AUTONOMOUS_RUNTIME_WIRED` | `false` | CONFIRM/METRICS/OPTIMIZE are still no-ops (Phase 11) |
| `LIVE_PUBLISHING_ENABLED` | `false` | no channels exist (named stop) |
| `WEEKLY_REPORT_DELIVERY_ENABLED` | `false` | no provider chosen (Phase 13) |
| `REQUIRE_LIVE_READY` | `false` | until Phase 14 |
| `BUFFER_ORG_ID_{MARCUS_VALE,NIA_BROOKS,CAMILLE_ROSE,MAYA_REYES}` | from `distribution/config/buffer-discovery.json` | Phase 1 discovery |
| `BUFFER_ENABLED_{…}` ×4 | `false` | until channels exist |

Deliberately **not** set: `OPENROUTER_*` (credential not yet authorised to this project — Phase 6),
`BUFFER_CHANNEL_*` (no channels — signup kit after Phase 7). Re-run: `npm run vars:github`.

## The lane leaves a durable trace (Rule 0)
`.github/workflows/daily-creator-network.yml` now runs `scripts/actions-state-probe.mjs precheck` before
`runtime/run.mjs` (health must reach D1, receipt `actions/<run_id>:<attempt>:precheck`) and
`… outcome <exit_code>` after it with `if: always()` (receipt `…:outcome`, then reads the run's receipts back).

Proof run, dispatched from the Phase 4 branch and watched to terminal:
- **https://github.com/seq23/creator-network/actions/runs/35540046455** — success; operate step reported
  `readiness.status=NOT_READY`, `SAFE_STANDBY`, exit 0 (expected: nothing is enabled yet).
- Receipts read back from D1 through the vault child, independently of the Actions log:
  `state/proof/actions-lane-receipts.json` — `ACTIONS_PRECHECK/PASS` (health `{ok:true,backend:'d1'}`, sha
  `c7beed9`) and `ACTIONS_OUTCOME/SAFE_STANDBY_OR_RUN` (exit_code 0).

A SAFE_STANDBY run is still inert in *effect* (it publishes nothing — correct), but it can no longer exit 0 having
touched nothing: every run writes two rows any later phase (12 health, 13 weekly report) can read.
