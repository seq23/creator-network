#!/usr/bin/env python3
"""Run one command with this project's vault-authorised credentials injected.

The value moves Keychain -> child environment block and nowhere else: it is
never an argument, never written to disk, and every byte the child prints is
passed through the vault's redactor before it reaches this terminal.

    python3 scripts/vault-exec.py -- node scripts/buffer-discovery.mjs

Requires the owner's Repo Operator checkout (default ~/repo-tools/agent) and an
existing authorisation: `repo vault requirements creator-network`.
"""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

PROJECT = "creator-network"
AGENT_ROOT = Path(os.environ.get("REPO_OPERATOR_AGENT_ROOT", Path.home() / "repo-tools" / "agent"))


def main(argv: list[str]) -> int:
    if "--" in argv:
        argv = argv[argv.index("--") + 1:]
    if not argv:
        print("usage: vault-exec.py -- <command> [args...]", file=sys.stderr)
        return 2
    if not (AGENT_ROOT / "repo_operator").is_dir():
        print(f"NAMED STOP: Repo Operator not found at {AGENT_ROOT}", file=sys.stderr)
        return 3
    sys.path.insert(0, str(AGENT_ROOT))
    from repo_operator.vault import inject  # noqa: E402

    with inject.bind(PROJECT, task="vault-exec", run_id=os.environ.get("VAULT_EXEC_RUN_ID", "")) as authority:
        if not authority.injected:
            print(f"NAMED STOP: no credentials are authorised for project {PROJECT}", file=sys.stderr)
            return 4
        print(f"vault-exec: injected {sorted(authority.injected)}", file=sys.stderr)
        proc = subprocess.Popen(argv, env=authority.env, stdout=subprocess.PIPE,
                                stderr=subprocess.STDOUT, text=True, bufsize=1)
        assert proc.stdout is not None
        for line in proc.stdout:
            sys.stdout.write(authority.redactor.scrub(line))
            sys.stdout.flush()
        return proc.wait()


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
