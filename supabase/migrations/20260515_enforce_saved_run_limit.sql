-- Enforce per-user saved run limit (5) inside the atomic save RPC to prevent race conditions.
-- Client + API route also precheck for UX, but this is the source of truth.

CREATE OR REPLACE FUNCTION public.save_simulation_run_atomic(p_run jsonb, p_breakdowns jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_run_id uuid;
  v_user_id uuid;
  v_existing boolean;
  v_run_count integer;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'unauthorized');
  END IF;

  v_run_id := (p_run->>'run_id')::uuid;
  v_user_id := (p_run->>'user_id')::uuid;

  IF v_run_id IS NULL OR v_user_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_input');
  END IF;

  IF v_uid <> v_user_id THEN
    RETURN jsonb_build_object('ok', false, 'error', 'forbidden');
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM public.cmo_simulation_runs r
    WHERE r.run_id = v_run_id AND r.user_id = v_user_id
  ) INTO v_existing;

  IF NOT v_existing THEN
    SELECT COUNT(*)
    INTO v_run_count
    FROM public.cmo_simulation_runs r
    WHERE r.user_id = v_user_id;

    IF COALESCE(v_run_count, 0) >= 5 THEN
      RETURN jsonb_build_object('ok', false, 'error', 'run_limit_reached');
    END IF;
  END IF;

  INSERT INTO public.cmo_simulation_runs (
    run_id,
    user_id,
    user_email,
    user_name,
    scenario_id,
    company_name,
    current_phase,
    status,
    overall_score,
    grade,
    debrief,
    context,
    saved_at
  )
  VALUES (
    v_run_id,
    v_user_id,
    COALESCE(p_run->>'user_email', ''),
    NULLIF(btrim(p_run->>'user_name'), ''),
    COALESCE(NULLIF(btrim(p_run->>'scenario_id'), ''), 'custom'),
    COALESCE(NULLIF(btrim(p_run->>'company_name'), ''), 'Untitled Company'),
    COALESCE(NULLIF(btrim(p_run->>'current_phase'), ''), 'setup'),
    COALESCE(NULLIF(btrim(p_run->>'status'), ''), 'in_progress'),
    CASE
      WHEN p_run ? 'overall_score' AND jsonb_typeof(p_run->'overall_score') = 'number'
        THEN (p_run->>'overall_score')::numeric
      WHEN p_run ? 'overall_score' AND p_run->>'overall_score' IS NOT NULL AND btrim(p_run->>'overall_score') <> ''
        THEN (p_run->>'overall_score')::numeric
      ELSE NULL
    END,
    NULLIF(btrim(p_run->>'grade'), ''),
    COALESCE(p_run->'debrief', '{}'::jsonb),
    COALESCE(p_run->'context', '{}'::jsonb),
    COALESCE((p_run->>'saved_at')::timestamptz, now())
  )
  ON CONFLICT (run_id) DO UPDATE SET
    user_email = EXCLUDED.user_email,
    user_name = EXCLUDED.user_name,
    scenario_id = EXCLUDED.scenario_id,
    company_name = EXCLUDED.company_name,
    current_phase = EXCLUDED.current_phase,
    status = EXCLUDED.status,
    overall_score = EXCLUDED.overall_score,
    grade = EXCLUDED.grade,
    debrief = EXCLUDED.debrief,
    context = EXCLUDED.context,
    saved_at = EXCLUDED.saved_at;

  DELETE FROM public.simulation_score_breakdowns WHERE run_id = v_run_id;

  INSERT INTO public.simulation_score_breakdowns (
    breakdown_id,
    run_id,
    user_id,
    phase,
    category,
    score,
    max_score,
    insight,
    metadata
  )
  SELECT
    COALESCE((rows.breakdown->>'breakdown_id')::uuid, gen_random_uuid()),
    v_run_id,
    v_user_id,
    COALESCE(rows.breakdown->>'phase', ''),
    COALESCE(rows.breakdown->>'category', ''),
    COALESCE((rows.breakdown->>'score')::numeric, 0),
    COALESCE((rows.breakdown->>'max_score')::numeric, 100),
    COALESCE(rows.breakdown->>'insight', ''),
    COALESCE(rows.breakdown->'metadata', '{}'::jsonb)
  FROM (
    SELECT jsonb_array_elements(COALESCE(p_breakdowns, '[]'::jsonb)) AS breakdown
  ) AS rows;

  RETURN jsonb_build_object('ok', true, 'run_id', v_run_id);
END;
$$;

REVOKE ALL ON FUNCTION public.save_simulation_run_atomic(jsonb, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.save_simulation_run_atomic(jsonb, jsonb) TO authenticated;

