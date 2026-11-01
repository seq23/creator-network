#!/usr/bin/env python3
"""Run one command with this project's credentials injected from the Boss OS vault.

The values move vault -> this process (a pipe) -> child environment block and
nowhere else: never an argument, never written to disk, and every line the
child prints has the injected values scrubbed before it reaches this terminal.

    python3 scripts/vault-exec.py -- node scripts/buffer-discovery.mjs

Requires the owner's Boss OS checkout (default ~/GitHub/boss-os) and its vault.
Only the names in NEEDS reach the child.
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

PROJECT = "creator-network"
BOSS_OS = Path(os.environ.get("BOSS_OS_ROOT", Path.home() / "GitHub" / "boss-os"))
# child env name -> Boss OS vault name
NEEDS = {
    "CREATOR_STATE_API_TOKEN": "CREATOR_STATE_API_TOKEN",
    "OPENAI_IMAGE_API_KEY": "OPENAI_API_KEY",
    "BUFFER_API_KEY_MARCUS_VALE": "BUFFER_API_KEY_MARCUS_VALE",
    "BUFFER_API_KEY_MAYA_REYES": "BUFFER_API_KEY_MAYA_REYES",
    "BUFFER_API_KEY_NIA_BROOKS": "BUFFER_API_KEY_NIA_BROOKS",
    "BUFFER_API_KEY_CAMILLE_ROSE": "BUFFER_API_KEY_CAMILLE_ROSE",
}
DUMP = "import json,os,sys;sys.stdout.write(json.dumps({n:os.environ[n] for n in sys.argv[1:] if os.environ.get(n)}))"


def read_vault() -> dict[str, str]:
    cp = subprocess.run(
        ["node", "scripts/vault/vault.mjs", "run", "--", sys.executable, "-c", DUMP, *sorted(set(NEEDS.values()))],
        cwd=BOSS_OS, capture_output=True, text=True, timeout=60)
    if cp.returncode != 0:
        return {}
    return json.loads(cp.stdout or "{}")


def main(argv: list[str]) -> int:
    if "--" in argv:
        argv = argv[argv.index("--") + 1:]
    if not argv:
        print("usage: vault-exec.py -- <command> [args...]", file=sys.stderr)
        return 2
    if not (BOSS_OS / "scripts" / "vault" / "vault.mjs").is_file():
        print(f"NAMED STOP: Boss OS vault not found at {BOSS_OS}", file=sys.stderr)
        return 3
    vault = read_vault()
    injected = {env: vault[src] for env, src in NEEDS.items() if src in vault}
    if not injected:
        print(f"NAMED STOP: no credentials for project {PROJECT} in the Boss OS vault", file=sys.stderr)
        return 4
    missing = sorted(set(NEEDS) - set(injected))
    print(f"vault-exec: injected {sorted(injected)}" + (f"; missing {missing}" if missing else ""), file=sys.stderr)
    secrets = sorted((v for v in injected.values() if len(v) >= 8), key=len, reverse=True)
    proc = subprocess.Popen(argv, env={**os.environ, **injected}, stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT, text=True, bufsize=1)
    assert proc.stdout is not None
    for line in proc.stdout:
        for s in secrets:
            line = line.replace(s, "[REDACTED]")
        sys.stdout.write(line)
        sys.stdout.flush()
    return proc.wait()


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
