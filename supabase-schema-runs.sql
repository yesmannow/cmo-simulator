-- CMO Simulator run persistence table
-- Safe additive schema for server-backed run snapshots and debrief artifacts.

CREATE TABLE IF NOT EXISTS cmo_simulation_runs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  run_id UUID UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT,
  scenario_id TEXT NOT NULL,
  company_name TEXT NOT NULL,
  current_phase TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed')),
  overall_score INTEGER NOT NULL DEFAULT 0,
  grade TEXT NOT NULL,
  debrief JSONB NOT NULL,
  context JSONB NOT NULL,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cmo_simulation_runs_user_saved
  ON cmo_simulation_runs(user_id, saved_at DESC);

CREATE INDEX IF NOT EXISTS idx_cmo_simulation_runs_score
  ON cmo_simulation_runs(overall_score DESC);

CREATE INDEX IF NOT EXISTS idx_cmo_simulation_runs_status
  ON cmo_simulation_runs(status);

