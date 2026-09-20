# CODING AGENT MASTER RUNBOOK — Creator Network

**Purpose:** This is the durable handoff for any future coding agent. It describes the entire approved system, all phases, boundaries, TODOs, ordering, and proof requirements. Read this file, `REPO_IDENTITY.md`, `authority/PHASE_LEDGER.md`, and `authority/SECURITY_AND_AUTONOMY.md` before planning or mutation.

## 0. Non-negotiable operating rules
1. Do not infer that later phases are implemented because their contracts/directories exist.
2. Never commit secrets. Credentials are external; Git contains references/config only.
3. Do not modify portfolio product repos unless the active approved task explicitly names them.
4. Preserve the four employee identities and experiment IDs unless an approved migration explicitly changes them.
5. Generator and renderer vendors are replaceable adapters. Never make an employee identity vendor-owned.
6. Fail closed on unsupported/high-stakes claims. Quarantine rather than publish uncertain content.
7. Self-healing is bounded/deterministic. Never give an LLM open-ended authority to rewrite production to recover.
8. Budgets are hard safety controls. No job may bypass them.
9. Do not claim HEALTHY without executing the health proof for that layer.
10. Before each implementation artifact, obey the Repo Work OS approval/phase ledger boundary.

## 1. Full intended lifecycle
`performance/state -> optimizer -> experiment queue -> research if needed -> content generation -> independent QA -> media-director format selection -> render/assemble -> Buffer -> social -> owned site -> Cloudflare attribution -> purchase/qualified lead -> analytics -> optimizer -> weekly owner report`.

## 2. Employees
- Marcus Vale -> A Player Mode. Reinvention/execution/ambition.
- Nia Brooks -> ApprovalPrep. Adulting/application/admin translator.
- Camille Rose -> Wedding. Bride Bestie / wedding operations.
- Maya Reyes -> Industry Guides. General Figure-It-Out Friend across accident, dentistry, hormones/IV/hair, neuro evaluations, USCIS medical exams.

Each employee must remain independently operable so one failure does not stop the network.

## 3. Experiment law
Registry contains exactly 120 Generation-1 core records: 4 creators x 5 hypotheses x 3 hook families (P/C/O) x 2 formats (D/S). IDs are stable. Batch 1 is 60 records (01-03 per hypothesis); Batch 2 contains 04-06 and should not be blindly executed before Batch-1 evidence is analyzed.

## 4. Phase TODO ledger

### PHASE 1 — CONTROL PLANE FOUNDATION [THIS ARTIFACT]
- [x] Repo identity and scope.
- [x] Phase ledger.
- [x] Four employee/persona contracts.
- [x] Employee memory, budget, health seed state.
- [x] Deterministic 120-experiment registry.
- [x] Batch 1/2 registries.
- [x] Attribution/content/health schemas for future interfaces.
- [x] Network/pipeline/optimizer/budget state contracts.
- [x] Health and recovery doctrine.
- [x] Weekly owner report contract.
- [x] Master coding-agent runbook.
- [x] Structural tests.
- [ ] Live execution of any subsystem — intentionally absent.

### PHASE 2 — ATTRIBUTION [DEFERRED BY OWNER — NOT LAUNCH-BLOCKING]
- [x] Preserve prior attribution schemas/research as reference.
- [x] Create `docs/DEFERRED_ATTRIBUTION_RUNBOOK.md` for a separate future agent/project.
- [x] Lock boundary: Creator Network may READ existing business repos but MUST NOT mutate them.
- [ ] Future conversion attribution integration — explicitly deferred and requires separate approval.
Definition of done for current Creator Network: documentation exists and attribution is not a blocker for Phases 3–9.

### PHASE 3 — INTELLIGENCE ENGINE
- [x] OpenRouter provider abstraction; no provider hard-coding in business logic.
- [x] Research classification: NONE/LIGHT/CURRENT/HIGH_STAKES.
- [x] Perplexity Sonar through OpenRouter for current research where justified.
- [x] Hard daily/monthly OpenRouter spend caps.
- [x] Reusable knowledge-pack format: sources, claims, questions, terminology, opportunities, reviewed/freshness metadata.
- [x] Source freshness rules by risk.
- [x] Generator input contract: persona + experiment + product knowledge + approved facts + recent content + performance + platform.
- [x] Generator output contract: thesis, hook, script, visual plan, caption, CTA, destination, platform variants.
- [x] Generator cannot alter assigned ICP/hook family/format.
- [x] Independent QA pass with PASS/REVISE/HUMAN_REVIEW/REJECT.
- [x] Maya stricter factual/compliance routing.
- [x] Quarantine HUMAN_REVIEW rather than interrupt owner by default.
- [x] Duplicate/continuity detection using employee memory.
Definition of done: deterministic fixtures prove routing, spend caps, assignment locking, QA state transitions, stale-source blocking, quarantine behavior, and no unsupported high-stakes PASS path. Live provider calls remain intentionally disabled until credentials/configuration are supplied in a later launch phase.

### PHASE 4 — MEDIA FACTORY
- [x] Visual identity package per employee: canonical face references, body references, wardrobe, environments, identity lock.
- [x] Original synthetic voice specification per employee; no unauthorized real-person cloning.
- [x] `VideoRenderer` interface.
- [x] Bake-off harness using same image/audio/script across serious candidates (e.g. HeyGen plus selected Chinese/other providers available at implementation time).
- [x] Score identity consistency 25%, human realism 20%, speech realism 20%, motion 15%, social-native feel 10%, cost per usable output 10%.
- [x] Renderer vendor chosen from evidence, not marketing.
- [x] Media modes: premium talking creator, lifestyle/voiceover, low-cost edited social.
- [x] Reserve publishing capacity before paid render.
- [x] FFmpeg assembly for captions/B-roll/graphics where appropriate.
- [x] Reusable media library indexed by creator/context.
- [x] Renderer retry/fallback chain and spend recording.
Definition of done: repeatable render test, cost receipt, quality decision record, deterministic assembly tests, and safe fallback when paid rendering is unavailable/capped.

### PHASE 5 — DISTRIBUTION
- [x] Buffer adapter behind internal publish-job interface.
- [x] Separate employee/account configuration; credentials external.
- [x] Channel capacity model; reserve slot before expensive production.
- [x] Schedule/publish/retry/status capture.
- [x] Capture platform post ID/URL when available.
- [x] Prevent duplicate publication under retries.
- [x] Respect platform/provider terms and actual account allowances; do not design around circumvention.
- [x] Confirm publication rather than equating queue success with publication.
Definition of done: safe sandbox/test workflow proves idempotent scheduling, retry, failure preservation, and publication-state reconciliation.

### PHASE 6 — ANALYTICS + OPTIMIZER
- [x] Ingest platform performance and conversion/lead value.
- [x] Attention, intent, conversion, and economic scores.
- [x] Primary normalized metric: economic value per 1,000 impressions.
- [x] Direct product hierarchy: revenue -> purchases -> qualified intent -> clicks -> attention -> followers.
- [x] Industry Guides: qualified lead value -> qualified leads -> high-intent sessions -> clicks -> attention -> followers.
- [x] Lifecycle states EXPLORE/ITERATE/SCALE/HOLD/KILL.
- [x] Recommendation-only mode first; execution only after proof/approval.
- [x] Never scale solely on views.
- [x] Do not act on incomplete analytics.
- [x] Mutations retain lineage to parent experiment.
Definition of done: fixture data produces reproducible decisions, incomplete data blocks unsafe decisions, and economic scoring traces to raw evidence.

### PHASE 7 — SELF-HEALING
- [x] Independent heartbeat per employee.
- [x] Health checks for identity, memory, experiment, research, generation, QA, renderer, Buffer, publishing, attribution, analytics, budget.
- [x] Synthetic tests for critical external/internal paths.
- [x] Incident ledger.
- [x] Deterministic recovery playbooks: research, generation, QA, renderer, Buffer, analytics, attribution, GitHub workflow, state/database, email.
- [x] Retry with bounded backoff.
- [x] Last-known-good recovery.
- [x] Failover/fallback without bypassing QA or budget.
- [x] Unknown/human-only failures -> ACTION_REQUIRED.
- [x] Health states HEALTHY/DEGRADED/ACTION_REQUIRED/UNVERIFIED.
Definition of done: fault-injection fixtures prove recovery paths and prove the system does not falsely report HEALTHY.

### PHASE 8 — WEEKLY OWNER REPORTING
- [ ] Monday schedule.
- [ ] Reconcile planned vs released last week.
- [ ] Exact failed/missed count and recovery status.
- [ ] Current production pipeline by employee/video/experiment/status/planned release.
- [ ] Exact next-week planned release count.
- [ ] Employee scorecards.
- [ ] Economic value and operating spend.
- [ ] What system learned.
- [ ] Autonomous actions taken.
- [ ] Pipeline coverage days.
- [ ] Self-healing incidents/resolutions.
- [ ] Run health audit -> recover -> re-audit BEFORE report.
- [ ] Email only says HEALTHY where proof exists.
- [ ] Bottom line: `OWNER ACTION REQUIRED: NONE` or exact human intervention.
Definition of done: report generated from fixture/live-safe state reconciles counts exactly and cannot claim false health.

### PHASE 9 — AUTONOMOUS LAUNCH + HARDENING
- [ ] Connect live accounts and secrets through approved secret stores.
- [ ] Controlled Batch-1 launch.
- [ ] Failure simulations and kill switches.
- [ ] Spend-limit tests.
- [ ] Duplicate-prevention tests.
- [ ] Pipeline coverage policy (target to be owner-approved; do not invent).
- [ ] Unattended multi-day run.
- [ ] Verify publication -> attribution -> economics -> optimizer -> reporting loop.
- [ ] Only then label the system hands-off.
Definition of done: integration/E2E evidence proves the full lifecycle; unproven layers remain explicitly labeled.

## 5. Email/domain architecture
Professional domain addresses are public employee identities. Cloudflare Email Routing may forward them to a human-controlled recovery/receiving inbox configured outside this repo. Do not place the destination inbox in public UI/config unless operationally required. Outbound custom-domain sending must later use a deliverable authenticated method (SPF/DKIM/DMARC as applicable); free Gmail forwarding alone is not assumed to solve outbound identity.

## 6. Distribution/content economics
One thesis may produce one premium render plus TikTok/Reel/Short and text/carousel derivatives. Media is reusable capital. Prefer reuse and free formats where quality is adequate. Paid rendering follows evidence and budget. Followers are diagnostic, not the business objective.

## 7. Required future coding-agent procedure
For every phase:
1. Read governing repo authority and this runbook.
2. Inspect the actual current repo and existing tooling before proposing duplicates.
3. Lock exact phase scope and list explicit exclusions.
4. Obtain required approval before artifact/mutation.
5. Implement only approved scope.
6. Add tests proving behavior, not merely file presence.
7. Package from correct root.
8. Structural checks by assistant; local updater performs full validation unless verification mode was explicitly requested.
9. Never claim a later lifecycle layer is complete without its required proof.
10. Update this runbook/ledger if approved architecture changes.

## 8. Generation-2 law
Do not add creators because they are interesting. Evidence earns specialization. The optimizer may recommend a dedicated creator (e.g. Dental or Budget Bride), but initial creation of new employees is owner-approved.

## 9. Current handoff state
Phase 1 is implemented. Attribution is explicitly deferred by owner and is not launch-blocking; downstream product repos are permanent read-only dependencies for this project. Phase 3 Intelligence Engine is implemented with live spend disabled by default. Phase 4 Media Factory is implemented with live paid rendering disabled and canonical visual references awaiting owner-approved generation/selection. Phase 5 Distribution is implemented with live publishing disabled by default. Phase 6 Analytics + Optimizer is implemented with conversion attribution still deferred and paid amplification blocked. Phase 7 Self-Healing is implemented with live external checks intentionally UNVERIFIED until launch configuration. Next required phase is Phase 8 Weekly Owner Reporting. Phases 8–9 remain.


## 10. Phase 4 implementation receipt
Phase 4 is implemented in the standalone Creator Network only. It adds canonical visual/voice contracts for all four employees, reference-image slots, a fail-closed identity rule, three media modes, media selection and cost governance, a renderer registry, a production-capable generic authenticated HTTP renderer, deterministic FFmpeg still/audio assembly, media-job state transitions, media-library policy, and a renderer bake-off protocol. Paid rendering is disabled by default and no provider endpoint is hard-coded; provider selection is configuration after a controlled bake-off. Missing canonical face references force EDITED_SOCIAL fallback rather than unattended identity invention. Existing product/business repos remain read-only.

### Phase 5 implementation receipt — Distribution
Implemented employee-isolated Buffer configuration, publish-job schema, capacity reservation before spend, idempotency/duplicate prevention, platform variants, Buffer GraphQL scheduling, bounded retry/quarantine behavior, and sent-state publication confirmation. Credentials are environment references only and live writes are disabled by default. No destination-repo changes.

### Phase 6 implementation receipt — Analytics + Optimizer
Implemented post-level social metric normalization, latest-snapshot deduplication, experiment aggregation, derived attention/intent signals, EXPLORE/ITERATE/SCALE/HOLD/KILL lifecycle decisions, exploration-floor capacity allocation, incomplete/anomaly HOLD behavior, and low-signal KILL behavior after minimum sample. Conversion attribution remains deferred: revenue/purchases/qualified leads are unavailable rather than zero, and SCALE authorizes organic production only. Paid amplification is hard-blocked until real economic evidence exists.

### Phase 7 implementation receipt — Self-Healing
Implemented independent employee heartbeats, proof-bearing HEALTHY certification, synthetic-check interfaces, deterministic bounded retries/fallbacks, incident ledger, unknown/human-only ACTION_REQUIRED escalation, last-known-good doctrine, and employee fault isolation. Deferred attribution is explicitly non-blocking. Unconfigured launch-critical external services remain UNVERIFIED until Phase 9 live configuration and proof.

## Phase 8 receipt — Weekly Owner Reporting
Implemented deterministic weekly owner-report compilation and fail-closed email delivery. The report includes executive summary, four employee scorecards, release/pipeline counts, next-week schedule, autonomous recovery activity, health certification, and exact owner-action status. Missing metrics are never invented. Deferred attribution is disclosed and non-blocking. Live email credentials/delivery remain disabled until Phase 9 configuration.

## Production Hardening Remediation — Hostile Review Findings HR-001/HR-002
- Creator Network runtime now uses `runtime/run.mjs` and a concrete step factory; absent runtime steps fail closed.
- Durable cross-run state is implemented as the standalone Cloudflare Worker + D1 service under `cloudflare/state-worker/`.
- GitHub Actions is wired to the durable-state API contract but remains SAFE_STANDBY until real resources, secrets, creator references, Buffer accounts, and explicit spend caps are configured.
- Product/business repositories remain READ-ONLY and are not deployment targets for Creator Network.
- Conversion attribution remains deferred to a separate future project.
