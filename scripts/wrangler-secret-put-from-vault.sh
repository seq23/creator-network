#!/usr/bin/env bash
set -euo pipefail
# Usage: ./scripts/wrangler-secret-put-from-vault.sh SECRET_NAME
# Requires an existing Wrangler-configured Worker and secrets/creator-network.env.
NAME="${1:-}"
[[ -n "$NAME" ]] || { echo "SECRET_NAME required" >&2; exit 2; }
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VAULT="$ROOT/secrets/creator-network.env"
[[ -f "$VAULT" ]] || { echo "Missing $VAULT" >&2; exit 3; }
VALUE="$(grep -E "^${NAME}=" "$VAULT" | tail -1 | cut -d= -f2-)"
[[ -n "$VALUE" ]] || { echo "No value collected for $NAME" >&2; exit 4; }
printf '%s' "$VALUE" | npx wrangler secret put "$NAME"
