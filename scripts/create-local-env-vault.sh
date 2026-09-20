#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
mkdir -p "$ROOT/secrets"
TARGET="$ROOT/secrets/creator-network.env"
if [[ -e "$TARGET" ]]; then echo "Vault already exists: $TARGET"; exit 0; fi
cp "$ROOT/ops/env/creator-network.env.example" "$TARGET"
chmod 600 "$TARGET"
echo "Created ignored local vault: $TARGET"
