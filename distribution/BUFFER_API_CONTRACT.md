# Buffer API Contract

Verified against Buffer's current GraphQL developer documentation during Phase 5 construction. Runtime endpoint: `https://api.buffer.com`; authentication is Bearer API key; scheduling uses `createPost` with `mode: customScheduled`, `schedulingType: automatic`, and UTC `dueAt`. Confirmation queries sent posts by organization/channel and matches the returned Buffer post ID.

Secrets are environment references only. Each employee is isolated at configuration level. Live writes are disabled by default until credentials, organization IDs, channel IDs, and owner-controlled launch gates are configured.
