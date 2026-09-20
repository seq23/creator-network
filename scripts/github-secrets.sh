#!/bin/sh
# Push this project's vault credentials to GitHub Actions secrets. Runs ONLY inside the vault child:
#     npm run secrets:github      (= python3 scripts/vault-exec.py -- sh scripts/github-secrets.sh)
# Each value moves Keychain -> child env -> gh's stdin. Never argv, never a file, never printed; names only.
set -eu
REPO="${GITHUB_REPO:-seq23/creator-network}"
NAMES="BUFFER_API_KEY_MARCUS_VALE BUFFER_API_KEY_NIA_BROOKS BUFFER_API_KEY_CAMILLE_ROSE BUFFER_API_KEY_MAYA_REYES CREATOR_STATE_API_TOKEN"
for name in $NAMES; do
  eval "value=\${$name:-}"
  if [ -z "$value" ]; then echo "NAMED STOP: $name is not injected — run through scripts/vault-exec.py" >&2; exit 4; fi
  printf %s "$value" | gh secret set "$name" -R "$REPO"
  echo "secret set: $name"
done
unset value
gh secret list -R "$REPO"
