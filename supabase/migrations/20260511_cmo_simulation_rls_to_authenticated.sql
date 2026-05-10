-- Align cmo_simulation_runs RLS with newer tables: explicit TO authenticated.

ALTER TABLE public.cmo_simulation_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cmo_sim_runs_select_own" ON public.cmo_simulation_runs;
DROP POLICY IF EXISTS "cmo_sim_runs_insert_own" ON public.cmo_simulation_runs;
DROP POLICY IF EXISTS "cmo_sim_runs_update_own" ON public.cmo_simulation_runs;
DROP POLICY IF EXISTS "cmo_sim_runs_delete_own" ON public.cmo_simulation_runs;

CREATE POLICY "cmo_sim_runs_select_own"
  ON public.cmo_simulation_runs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "cmo_sim_runs_insert_own"
  ON public.cmo_simulation_runs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cmo_sim_runs_update_own"
  ON public.cmo_simulation_runs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cmo_sim_runs_delete_own"
  ON public.cmo_simulation_runs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
