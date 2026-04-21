import { NextRequest, NextResponse } from "next/server";
import { supabaseRestRequest } from "@/lib/supabaseRest";
import type { PersistedRunPayload } from "@/lib/simulationPersistence";

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
    overall_score: payload.overallScore,
    grade: payload.grade,
    debrief: payload.debrief,
    context: payload.context,
    saved_at: payload.savedAtIso,
  };
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as PersistedRunPayload;

    if (!payload?.userId || !payload?.userEmail || !payload?.context) {
      return NextResponse.json({ error: "Missing required payload fields." }, { status: 400 });
    }

    const response = await supabaseRestRequest(
      "/rest/v1/cmo_simulation_runs?on_conflict=run_id",
      {
        method: "POST",
        headers: {
          Prefer: "resolution=merge-duplicates,return=representation",
        },
        body: JSON.stringify([toDatabaseRow(payload)]),
      },
    );

    if (!response.ok) {
      const details = await response.text();
      return NextResponse.json(
        { error: "Failed to persist simulation run.", details },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({ ok: true, run: data?.[0] ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

