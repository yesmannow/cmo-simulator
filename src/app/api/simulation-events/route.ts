import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body || !isRecord(body)) {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const runId = typeof body.runId === "string" ? body.runId.trim() : "";
    const eventType = typeof body.eventType === "string" ? body.eventType.trim() : "";
    const phase = typeof body.phase === "string" ? body.phase.trim() : "";
    const payload = isRecord(body.payload) ? body.payload : {};

    if (!runId || !eventType || !phase) {
      return NextResponse.json({ error: "Missing runId, eventType, or phase." }, { status: 400 });
    }

    const { data: run, error: runError } = await supabase
      .from("cmo_simulation_runs")
      .select("run_id, user_id")
      .eq("run_id", runId)
      .maybeSingle();

    if (runError) {
      return NextResponse.json({ error: "Failed to validate simulation run.", details: runError.message }, { status: 500 });
    }

    if (!run) {
      return NextResponse.json({ error: "Run not found." }, { status: 404 });
    }

    if (run.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { error } = await supabase.from("simulation_events").insert({
      run_id: runId,
      user_id: user.id,
      event_type: eventType,
      phase,
      payload,
    });

    if (error) {
      return NextResponse.json({ error: "Failed to record simulation event.", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

