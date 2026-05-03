-- =============================================================================
-- Read-only verification for public.cmo_simulation_runs (Coolify / self-hosted)
-- Run in the SQL editor for the database behind NEXT_PUBLIC_SUPABASE_URL.
--
-- Supabase MCP in Cursor may be linked to a different cloud project than
-- https://supabase.darlingmartech.com — always verify against your app URL.
--
-- After running (1)–(5), classify:
--   CASE A: table missing → apply supabase/migrations/20260502_create_cmo_simulation_runs.sql
--           only after explicit approval (review full file in repo).
--   CASE B: columns/policies match migration → optional idempotent repair migration only if gaps.
--   CASE C: legacy shape (BIGINT id PK, user_id TEXT, etc.) → backup/transform plan; no drop
--           without approval.
--   CASE D: partial match → additive repair only.
-- =============================================================================

-- 1) Table exists
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'cmo_simulation_runs';

-- 2) Columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'cmo_simulation_runs'
ORDER BY ordinal_position;

-- 3) RLS enabled
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname = 'cmo_simulation_runs';

-- 4) Policies
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'cmo_simulation_runs';

-- 5) Indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'cmo_simulation_runs';

-- -----------------------------------------------------------------------------
-- CASE C (legacy table): if you see BIGINT "id" PK, "user_id" TEXT, no FK to
-- auth.users — do NOT run DROP or ALTER TYPE without:
--   1) COPY/backup existing rows to a file or staging table
--   2) plan mapping TEXT user_id -> uuid auth.users.id (may require manual join)
--   3) explicit approval, then new table or migrate-in-place with a written script
-- -----------------------------------------------------------------------------
