#!/bin/sh
# Set the non-secret GitHub Actions variables for the daily lane. Idempotent; needs no vault (nothing here is secret).
#     npm run vars:github
# Org ids come from distribution/config/buffer-discovery.json (Phase 1 discovery), never typed by hand.
# Channel ids and OpenRouter models are deliberately NOT set: the social accounts do not exist yet (ledger named stop)
# and OpenRouter is not yet authorised to this project (Phase 6).
set -eu
REPO="${GITHUB_REPO:-seq23/creator-network}"
setvar(){ gh variable set "$1" --body "$2" -R "$REPO"; echo "variable set: $1=$2"; }
setvar CREATOR_STATE_API_URL "https://creator-network-state.seq-taylor.workers.dev"
setvar DURABLE_STATE_CONFIGURED true
setvar AUTONOMOUS_RUNTIME_WIRED false
setvar LIVE_PUBLISHING_ENABLED false
setvar WEEKLY_REPORT_DELIVERY_ENABLED false
setvar REQUIRE_LIVE_READY false
for creator in MARCUS_VALE NIA_BROOKS CAMILLE_ROSE MAYA_REYES; do
  org=$(node -e 'const d=require("./distribution/config/buffer-discovery.json");const v=d.org_env[process.argv[1]];if(!v)process.exit(1);process.stdout.write(v)' "BUFFER_ORG_ID_$creator")
  setvar "BUFFER_ORG_ID_$creator" "$org"
  setvar "BUFFER_ENABLED_$creator" false
done
gh variable list -R "$REPO"
