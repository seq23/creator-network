# RUNBOOK — creator-network

Read this before changing anything. It is the file an AI employee (Danielle in Boss OS) reads at
plan time; `scripts/validate-runbook.mjs` fails `npm test` if the paths, scripts and rules named
here stop existing.

## What this repo is
The standalone control plane for four persistent virtual creator employees — Marcus Vale (A Player
Mode), Nia Brooks (ApprovalPrep), Camille Rose (Wedding), Maya Reyes (Industry Guides) — who plan,
generate, QA, render, schedule through their own Buffer accounts, measure, self-heal and report
weekly. Private repo seq23/creator-network. Longer authority, in reading order:
`REPO_IDENTITY.md` → `authority/PHASE_LEDGER.md` → `authority/SECURITY_AND_AUTONOMY.md` →
`CODING_AGENT_MASTER_RUNBOOK.md`.

| Piece | Where | Runs |
|---|---|---|
| Durable state | `cloudflare/state-worker/` (Worker `creator-network-state` + D1) | redeployed on every land |
| Daily lane | `.github/workflows/daily-creator-network.yml` | GitHub Actions, reads `main` at fire time; `SAFE_STANDBY` until readiness |
| Weekly owner report | `.github/workflows/weekly-owner-report.yml` | Monday; delivery fail-closed until configured |
| Employees | `employees/` (contracts); `media/identities/` — per creator, an IDENTITY.json and a hash-locked references manifest (`media/identities/marcus_vale/references/manifest.json` is the shape) | — |
| Experiments | `experiments/` (120 Generation-1 records; IDs stable) | — |
| Distribution | `distribution/` (`distribution/config/buffer-discovery.json`, Buffer adapter) | live writes disabled by default |
| Signup kit | `docs/SIGNUP_KIT.md` from `npm run signup:kit` | owner-only signup |

## Standing rules (owners' decisions, dated)
- **Never mutate the four product repos.** Creator Network READS portfolio repositories for product
  knowledge and MUST NOT mutate them (ledger, "Permanent repository boundary"). Any downstream
  mutation is a separate owner-approved project.
- **One Buffer account per creator, never consolidated.** Four credentials, one per creator,
  authorised to project `creator-network` in the vault; the legacy `buffer-access-token` is not this
  project's and is never used (ledger, "Credential law").
- **`authority/PHASE_LEDGER.md` is status truth.** The 15-phase table is what is done and what is
  not; `tests/test_phase_ledger.py` parses it and fails on an invalid state, a proven row with no
  live artifact, or a missing named stop. Never infer a phase is done because its directory exists.
- **Keys reach a process only through the vault**: `python3 scripts/vault-exec.py -- <cmd>`. Never
  in the repo, never printed, never in argv. `npm run secret:state`, `smoke:state`, `secrets:github`,
  `probe:actions` and `identities:generate` are the wrapped forms.
- **The four identities and the experiment IDs are preserved** unless an approved migration says
  otherwise; a renderer or generator vendor is a replaceable adapter and never owns an identity.
- **Fail closed.** Uncertain or high-stakes content is quarantined, not published; budgets are hard
  stops; nothing reports HEALTHY without executing that layer's health proof; SAFE_STANDBY never
  fabricates credentials, references or account connections.
- **Named stop (owner-only):** the creators' social accounts do not exist yet, so no Buffer channel
  exists. Signup is hers, on real hardware (SMS/CAPTCHA). Phases 10 and 14 wait on it; nothing else
  does. Never automate signup — it flags the accounts at birth.
- **Decisions an employee must ask, not make**: anything about a creator's persona, face, voice or
  name; copy meaning; legal, medical or financial claims (Maya's routes are stricter by design);
  spend caps; enabling a live write (Buffer, renderer, email). Structure, tests, validators, state
  contracts, workflow wiring, docs: decide, record on the card, keep going.

## How to make a change
1. Branch `work/<slug>` off `main` (CI runs on the PR).
2. Edit. Anything that changes what is done or not done also updates the ledger table in
   `authority/PHASE_LEDGER.md` with evidence — a run URL, a proof file under `state/proof/`, a doc.
3. `npm run check` (every `.js`/`.mjs` parses) and `npm test` (the Python structural suites incl.
   the ledger parser, then the Node phase suites and production hardening). All must pass.
4. If a Worker change: `npm run smoke:state` through the vault after deploy, and put the proof in
   `state/proof/`.
5. PR with the change spelled out; `~/bin/land <pr>` verifies green, merges, watches `main`, and
   runs `npm run deploy:state` (the state Worker redeploys on every land; the Actions lanes read
   `main` at fire time). Prove it: `npm run smoke:state`.

## Guards, and what each pins
| Script | Pins |
|---|---|
| `tests/test_phase_ledger.py` | 15 phases in order with valid states; proven rows name a live artifact; boundaries, deferrals and named stops stated |
| `tests/test_phase1.py` … `tests/test_phase9.py`, `tests/test_signup_kit.py` | structural contracts per build phase; the signup kit renders from JSON with disclosure tags |
| `tests/test_phase3.js` … `tests/test_phase8.mjs` | routing, spend caps, QA transitions, media modes, Buffer idempotency/retry, optimizer lifecycle, recovery playbooks, report reconciliation |
| `tests/test_production_hardening.mjs` | READY is hard-blocked until runtime wiring and durable state are real |
| `tests/test_buffer_discovery.mjs` | four isolated accounts, identity verified per key |
| `scripts/validate-runbook.mjs` | this file names real paths and scripts, and the rules it states are still in the ledger |

Prove a new guard negatively before merging: plant the defect, watch it fail, remove it.
