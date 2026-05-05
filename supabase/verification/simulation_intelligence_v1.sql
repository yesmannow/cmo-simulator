-- =============================================================================
-- Read-only verification for the v1 simulation intelligence tables.
-- Run after applying the additive migration in supabase/migrations/20260505_create_personalized_simulation_intelligence_v1.sql
-- =============================================================================

-- 1) Tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('user_profiles', 'simulation_events', 'simulation_score_breakdowns')
ORDER BY table_name;

-- 2) Columns
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('user_profiles', 'simulation_events', 'simulation_score_breakdowns')
ORDER BY table_name, ordinal_position;

-- 3) RLS enabled
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname IN ('user_profiles', 'simulation_events', 'simulation_score_breakdowns')
ORDER BY relname;

-- 4) Policies
SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('user_profiles', 'simulation_events', 'simulation_score_breakdowns')
ORDER BY tablename, policyname;

-- 4b) No anon/public policies
SELECT tablename, policyname, roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('user_profiles', 'simulation_events', 'simulation_score_breakdowns')
  AND (
    roles IS NULL
    OR 'public' = ANY (roles)
    OR 'anon' = ANY (roles)
  );

-- 4c) Policy scope check: all policies should target authenticated
SELECT tablename, policyname, roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('user_profiles', 'simulation_events', 'simulation_score_breakdowns')
  AND NOT ('authenticated' = ANY (roles));

-- 4d) FK cascade confirmation
SELECT conrelid::regclass AS table_name, conname, pg_get_constraintdef(oid) AS constraint_def
FROM pg_constraint
WHERE connamespace = 'public'::regnamespace
  AND conrelid::regclass::text IN (
    'public.simulation_events',
    'public.simulation_score_breakdowns'
  )
  AND conname IN (
    'simulation_events_run_id_fkey',
    'simulation_score_breakdowns_run_id_fkey'
  );

-- 5) Indexes
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('user_profiles', 'simulation_events', 'simulation_score_breakdowns')
ORDER BY tablename, indexname;

-- 5b) Expected user_id/run_id indexes
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND (
    (tablename = 'simulation_events' AND (indexname ILIKE '%user%' OR indexname ILIKE '%run%'))
    OR (tablename = 'simulation_score_breakdowns' AND (indexname ILIKE '%user%' OR indexname ILIKE '%run%'))
    OR (tablename = 'user_profiles' AND indexname ILIKE '%user_profiles%')
  )
ORDER BY tablename, indexname;
