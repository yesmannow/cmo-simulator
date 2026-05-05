import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { PersistedRunPayload } from "@/lib/simulationPersistence";
import { buildSimulationScoreBreakdowns } from "@/lib/simulationIntelligence";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toDatabaseRow(payload: PersistedRunPayload) {
  return {
    run_id: payload.runId,
    user_id: payload.userId,
    user_email: payload.userEmail,
    user_name: payload.userName ?? null,
    scenario_id: payload.scenarioId,
    company_name: payload.companyName,
    current_phase: payload.currentPhase,
    status: payload.status,
    overall_score: payload.overallScore ?? null,
    grade: payload.grade ?? null,
    debrief: payload.debrief,
    context: payload.context,
    saved_at: payload.savedAtIso,
    // created_at and updated_at are managed by DB defaults / trigger
  };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id || !user.email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const payload = (await request.json()) as PersistedRunPayload;

    if (!payload?.runId || !payload?.userId || !payload?.userEmail || !payload?.context) {
      return NextResponse.json({ error: "Missing required payload fields." }, { status: 400 });
    }

    if (!UUID_RE.test(payload.runId)) {
      return NextResponse.json({ error: "Invalid run ID format." }, { status: 400 });
    }

    if (payload.userId !== user.id || payload.userEmail !== user.email) {
      return NextResponse.json({ error: "Payload identity mismatch." }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("cmo_simulation_runs")
      .upsert(toDatabaseRow(payload), { onConflict: "run_id" })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to persist simulation run.", details: error.message },
        { status: 500 },
      );
    }

    const scoreBreakdowns = buildSimulationScoreBreakdowns(payload.context);
    const breakdownRows = scoreBreakdowns.map((breakdown) => ({
      breakdown_id: crypto.randomUUID(),
      run_id: payload.runId,
      user_id: user.id,
      phase: breakdown.phase,
      category: breakdown.category,
      score: breakdown.score,
      max_score: breakdown.maxScore,
      insight: breakdown.insight,
      metadata: breakdown.metadata,
    }));

    const { error: breakdownError } = await supabase
      .from("simulation_score_breakdowns")
      .upsert(breakdownRows, { onConflict: "run_id,phase,category" });

    if (breakdownError) {
      return NextResponse.json(
        { error: "Failed to persist score breakdowns.", details: breakdownError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, run: data, scoreBreakdowns });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
