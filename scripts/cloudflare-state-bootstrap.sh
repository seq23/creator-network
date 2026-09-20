#!/usr/bin/env bash
set -euo pipefail
CONFIG="cloudflare/state-worker/wrangler.toml"
echo "Creating D1 database. Capture the database_id and place it in $CONFIG."
npx wrangler@4.37.1 d1 create creator-network-state --config "$CONFIG"
echo "After updating database_id, run:"
echo "npx wrangler@4.37.1 d1 migrations apply creator-network-state --remote --config $CONFIG"
echo "npx wrangler@4.37.1 secret put STATE_API_TOKEN --config $CONFIG"
echo "npx wrangler@4.37.1 deploy --config $CONFIG"
