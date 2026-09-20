CREATE TABLE IF NOT EXISTS state_objects (
  state_key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS runtime_receipts (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  employee_id TEXT,
  step TEXT NOT NULL,
  status TEXT NOT NULL,
  detail_json TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_runtime_receipts_run ON runtime_receipts(run_id, created_at);
CREATE INDEX IF NOT EXISTS idx_runtime_receipts_employee ON runtime_receipts(employee_id, created_at);
