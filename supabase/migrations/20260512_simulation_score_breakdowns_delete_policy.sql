-- Allow users to DELETE their own score breakdown rows during atomic save replay.
-- save_simulation_run_atomic runs DELETE-then-INSERT inside SECURITY INVOKER; without a
-- DELETE policy, Postgres removes 0 rows under RLS, then INSERT conflicts with
-- uq_simulation_score_breakdowns_run_phase_category.

DROP POLICY IF EXISTS "simulation_score_breakdowns_delete_own" ON public.simulation_score_breakdowns;

CREATE POLICY "simulation_score_breakdowns_delete_own"
  ON public.simulation_score_breakdowns
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() IS NOT NULL
    AND auth.uid() = user_id
    AND EXISTS (
      SELECT 1
      FROM public.cmo_simulation_runs r
      WHERE r.run_id = simulation_score_breakdowns.run_id
        AND r.user_id = auth.uid()
    )
  );
