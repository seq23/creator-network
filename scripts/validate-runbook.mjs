#!/usr/bin/env node
/**
 * THE RUNBOOK NAMES REAL THINGS, AND THE RULES IT STATES ARE STILL IN THE LEDGER.
 *
 * `RUNBOOK.md` is what an AI employee reads at plan time. A runbook that names a script that was
 * renamed, or restates a rule the ledger dropped, is worse than none: it is read, believed, and
 * wrong. So: every backtick path in it exists; every `npm run x` it names is in package.json; and
 * the four standing rules it carries — read-only product repos, one Buffer account per creator,
 * the ledger as status truth, keys only via vault-exec — are still stated in the ledger it cites.
 *
 * RULE 0: a runbook with no paths to check fails. Run: node scripts/validate-runbook.mjs [--self-test]
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export function findings(runbook, pkg, ledger, exists) {
  const bad = [];
  // A path is checked when it is written as one — with a directory in it, or a top-level file. A
  // bare filename like `IDENTITY.json` (one per creator) is a name, not a path, and is skipped.
  // Every path-shaped token inside ANY backtick span — including one inside a command such as
  // `python3 scripts/vault-exec.py -- <cmd>` — so a renamed script named in a command is caught too.
  const paths = [...runbook.matchAll(/`([^`]+)`/g)]
    .flatMap((m) => [...m[1].matchAll(/(?:^|[\s(])([A-Za-z0-9_.-]+\/[A-Za-z0-9_./-]*|[A-Z_]+\.md|package\.json)(?=$|[\s),;:])/g)].map((x) => x[1]))
    .filter((p) => !p.startsWith("~") && !/^work\//.test(p) && !/[<>*]/.test(p));
  if (paths.length === 0) bad.push("RUNBOOK.md names no paths — nothing to check is a broken runbook, not a clean one.");
  for (const p of paths) {
    const clean = p.replace(/\/$/, "");
    if (!exists(clean)) bad.push(`RUNBOOK.md names \`${p}\` and it does not exist.`);
  }
  const scripts = new Set(Object.keys(pkg.scripts ?? {}));
  for (const m of runbook.matchAll(/`npm run ([a-z0-9:_-]+)`/g)) {
    if (!scripts.has(m[1])) bad.push(`RUNBOOK.md names \`npm run ${m[1]}\` and package.json has no such script.`);
  }
  for (const [rule, re] of [
    ["product repos are read-only", /MUST NOT mutate them/],
    ["one Buffer account per creator", /one per creator/i],
    ["keys only through the vault", /vault-exec\.py/],
    ["the named stop is stated", /## Named stops/],
  ]) {
    if (!re.test(ledger)) bad.push(`RUNBOOK.md restates "${rule}" and authority/PHASE_LEDGER.md no longer says it.`);
    if (!re.test(runbook) && rule !== "the named stop is stated") bad.push(`RUNBOOK.md no longer states "${rule}".`);
  }
  if (!/~\/bin\/land/.test(runbook) || !/deploy:state/.test(runbook)) bad.push("RUNBOOK.md no longer says how a change is released (~/bin/land → npm run deploy:state).");
  return bad;
}

function selfTest() {
  const pkg = { scripts: { test: "x", check: "y", "deploy:state": "z", "smoke:state": "w" } };
  const ledger = "Creator Network may READ portfolio repositories. It MUST NOT mutate them. one per creator vault-exec.py ## Named stops";
  const good = "see `authority/PHASE_LEDGER.md` and `scripts/vault-exec.py`; run `npm run test`; MUST NOT mutate them; one per creator; `~/bin/land` runs `npm run deploy:state`";
  const exists = (p) => ["authority/PHASE_LEDGER.md", "scripts/vault-exec.py"].includes(p);
  // A path inside a command is a path.
  if (findings("run `python3 scripts/nope.py -- x` MUST NOT mutate them one per creator `scripts/vault-exec.py` `~/bin/land` `npm run deploy:state`", pkg, ledger, exists).every((b) => !b.includes("scripts/nope.py"))) { console.error("  ✗ a dead path inside a command is not caught"); process.exit(1); }
  const checks = [
    ["a true runbook passes", findings(good, pkg, ledger, exists).length === 0],
    ["a missing path is caught", findings(good.replace("scripts/vault-exec.py", "scripts/gone.py"), pkg, ledger, exists).some((b) => b.includes("does not exist"))],
    ["a missing npm script is caught", findings(good.replace("npm run test", "npm run nope"), pkg, ledger, exists).some((b) => b.includes("no such script"))],
    ["a rule the ledger dropped is caught", findings(good, pkg, ledger.replace("MUST NOT mutate them", ""), exists).some((b) => b.includes("no longer says it"))],
    ["a rule the runbook dropped is caught", findings(good.replace("one per creator", ""), pkg, ledger, exists).some((b) => b.includes("no longer states"))],
    ["a runbook without a release path is caught", findings(good.replace("deploy:state", "deploy"), pkg, ledger, exists).some((b) => b.includes("released"))],
    ["an empty runbook fails (rule 0)", findings("nothing here", pkg, ledger, exists).length > 0],
  ];
  const failed = checks.filter(([, ok]) => !ok);
  for (const [name] of failed) console.error(`  ✗ ${name}`);
  if (failed.length) { console.error(`validate-runbook self-test: ${failed.length} case(s) wrong`); process.exit(1); }
  console.log(`validate-runbook self-test: ${checks.length}/${checks.length} cases.`);
}

if (process.argv.includes("--self-test")) { selfTest(); process.exit(0); }
const bad = findings(
  readFileSync(join(ROOT, "RUNBOOK.md"), "utf8"),
  JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")),
  readFileSync(join(ROOT, "authority/PHASE_LEDGER.md"), "utf8"),
  (p) => existsSync(join(ROOT, p)),
);
if (bad.length) { console.error("RUNBOOK CHECK FAILED:"); for (const b of bad) console.error(`  ✗ ${b}`); process.exit(1); }
console.log("RUNBOOK CHECK PASSED: every path and script named in RUNBOOK.md exists, and its rules are the ledger's.");
