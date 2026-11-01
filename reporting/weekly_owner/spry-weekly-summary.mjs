#!/usr/bin/env node
/**
 * THE SPRY LABS WEEKLY HAND-OFF (owner, 1 Nov 2026). This repo no longer emails its weekly owner
 * report. It writes spry-weekly-summary.json (schema spry-weekly-summary-v1) from
 * state/reporting/latest-weekly-report.json, and the workflow uploads it as the artifact
 * `spry-weekly-summary`. Boss OS reads the newest one on Wednesday at 08:15 Central and puts one short
 * Creator Network section into the one "Spry Labs weekly" email.
 *
 *   node reporting/weekly_owner/spry-weekly-summary.mjs [report.json] [out.json]
 *   node reporting/weekly_owner/spry-weekly-summary.mjs --self-check
 */
import { readFileSync, writeFileSync } from 'node:fs';

const STATE = { HEALTHY: 'fine', ACTION_REQUIRED: 'needs-a-look' };

export function summarise(report, runUrl = null) {
  if (!report || !report.summary) throw new Error('NAMED STOP [NO_REPORT] the weekly owner report has no summary; nothing to hand to Boss OS.');
  const s = report.summary;
  const n = (v) => (v == null ? 0 : Number(v));
  const notes = [`Released ${n(s.released)} of ${n(s.planned)} planned posts; ${n(s.failed_or_missed)} failed or were missed; ${n(s.planned_next_week)} planned for next week.`];
  const action = Array.isArray(report.owner_action_required) ? report.owner_action_required : [];
  for (const a of action.slice(0, 3)) notes.push(String(a));
  return {
    schema: 'spry-weekly-summary-v1', business: 'Creator Network', week: report.period?.end ?? null,
    generated_at: report.generated_at ?? new Date().toISOString(), run_url: runUrl,
    state: STATE[report.network_health] ?? 'watch', sites: [], notes,
  };
}

export function selfCheck() {
  const r = summarise({ network_health: 'ACTION_REQUIRED', owner_action_required: ['Reconnect Buffer'], summary: { planned: 4, released: 3, failed_or_missed: 1, planned_next_week: 5 } });
  if (r.state !== 'needs-a-look' || r.notes.length !== 2 || !r.notes[0].startsWith('Released 3 of 4')) throw new Error('self-check: summary is wrong');
  if (summarise({ network_health: 'UNVERIFIED', summary: {} }).state !== 'watch') throw new Error('self-check: an unverified network must read "watch", never "fine"');
  let refused = false;
  try { summarise({}); } catch { refused = true; }
  if (!refused) throw new Error('self-check: an empty report was handed on (rule 0)');
  console.log('spry-weekly-summary self-check: ok');
}

if (import.meta.url === `file://${process.argv[1]}` && process.argv[2] === '--self-check') selfCheck();
else if (import.meta.url === `file://${process.argv[1]}`) {
  const [input = 'state/reporting/latest-weekly-report.json', out = 'spry-weekly-summary.json'] = process.argv.slice(2);
  const summary = summarise(JSON.parse(readFileSync(input, 'utf8')), process.env.RUN_URL ?? null);
  writeFileSync(out, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`spry weekly summary: ${summary.state} -> ${out}`);
}
