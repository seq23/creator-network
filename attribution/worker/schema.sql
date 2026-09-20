CREATE TABLE IF NOT EXISTS creator_events (
  dedupe_key TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  event TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  received_at TEXT NOT NULL,
  src_creator TEXT NOT NULL,
  src_platform TEXT NOT NULL,
  src_experiment TEXT NOT NULL,
  src_icp TEXT NOT NULL,
  src_franchise TEXT NOT NULL,
  src_cta TEXT NOT NULL,
  properties_json TEXT NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_creator_events_experiment ON creator_events(src_experiment, occurred_at);
CREATE INDEX IF NOT EXISTS idx_creator_events_creator ON creator_events(src_creator, occurred_at);
CREATE INDEX IF NOT EXISTS idx_creator_events_event ON creator_events(event, occurred_at);
