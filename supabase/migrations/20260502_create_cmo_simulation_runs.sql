-- Migration: create_cmo_simulation_runs
-- Applied to: fresh project (cmo_simulation_runs does not exist prior to this migration)
-- Schema state confirmed 2026-05-02: public schema is empty.
--
-- NOTE: If applying to a project that already has cmo_simulation_runs from the legacy
-- supabase-schema-runs.sql (BIGINT id, user_id TEXT, non-null score/grade), that table
-- is incompatible with this schema. A manual migration (export data, drop, recreate)
-- is required before running this file. CREATE TABLE IF NOT EXISTS will NOT reshape
-- an existing incompatible table — it will silently skip and leave the old shape in place.
-- UUID strategy: run_id is always a UUID — app generates IDs via crypto.randomUUID().

-- ---------------------------------------------------------------------------
-- Helper: auto-update updated_at on every row update
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.cmo_simulation_runs (
  run_id        uuid          PRIMARY KEY,
  user_id       uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email    text          NOT NULL,
  user_name     text          NULL,
  scenario_id   text          NOT NULL DEFAULT 'custom',
  company_name  text          NOT NULL DEFAULT 'Untitled Company',
  current_phase text          NOT NULL DEFAULT 'setup',
  status        text          NOT NULL CHECK (status IN ('in_progress', 'completed')),
  overall_score numeric       NULL,
  grade         text          NULL,
  debrief       jsonb         NOT NULL DEFAULT '{}'::jsonb,
  context       jsonb         NOT NULL DEFAULT '{}'::jsonb,
  saved_at      timestamptz   NOT NULL DEFAULT now(),
  created_at    timestamptz   NOT NULL DEFAULT now(),
  updated_at    timestamptz   NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_cmo_simulation_runs_user_saved
  ON public.cmo_simulation_runs (user_id, saved_at DESC);

CREATE INDEX IF NOT EXISTS idx_cmo_simulation_runs_status
  ON public.cmo_simulation_runs (status);

CREATE INDEX IF NOT EXISTS idx_cmo_simulation_runs_current_phase
  ON public.cmo_simulation_runs (current_phase);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

DROP TRIGGER IF EXISTS trg_cmo_simulation_runs_updated_at ON public.cmo_simulation_runs;

CREATE TRIGGER trg_cmo_simulation_runs_updated_at
  BEFORE UPDATE ON public.cmo_simulation_runs
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

ALTER TABLE public.cmo_simulation_runs ENABLE ROW LEVEL SECURITY;

-- Policies (idempotent: DROP IF EXISTS before each CREATE)

DROP POLICY IF EXISTS "cmo_sim_runs_select_own"  ON public.cmo_simulation_runs;
DROP POLICY IF EXISTS "cmo_sim_runs_insert_own"  ON public.cmo_simulation_runs;
DROP POLICY IF EXISTS "cmo_sim_runs_update_own"  ON public.cmo_simulation_runs;
DROP POLICY IF EXISTS "cmo_sim_runs_delete_own"  ON public.cmo_simulation_runs;

CREATE POLICY "cmo_sim_runs_select_own"
  ON public.cmo_simulation_runs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "cmo_sim_runs_insert_own"
  ON public.cmo_simulation_runs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cmo_sim_runs_update_own"
  ON public.cmo_simulation_runs
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cmo_sim_runs_delete_own"
  ON public.cmo_simulation_runs
  FOR DELETE
  USING (auth.uid() = user_id);
