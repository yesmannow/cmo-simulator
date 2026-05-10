import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { getOrCreateRequestId, withRequestIdHeaders } from "@/lib/apiRequestId";

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export async function POST(request: NextRequest) {
  const requestId = getOrCreateRequestId(request);
  const headers = withRequestIdHeaders(requestId);
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers });
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body || !isRecord(body)) {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400, headers });
    }

    const runId = typeof body.runId === "string" ? body.runId.trim() : "";
    const eventType = typeof body.eventType === "string" ? body.eventType.trim() : "";
    const phase = typeof body.phase === "string" ? body.phase.trim() : "";
    const payload = isRecord(body.payload) ? body.payload : {};

    if (!runId || !eventType || !phase) {
      return NextResponse.json({ error: "Missing runId, eventType, or phase." }, { status: 400, headers });
    }

    const { data: run, error: runError } = await supabase
      .from("cmo_simulation_runs")
      .select("run_id, user_id")
      .eq("run_id", runId)
      .maybeSingle();

    if (runError) {
      logger.error("POST /api/simulation-events run lookup failed", runError, { requestId });
      return NextResponse.json(
        { error: "Failed to validate simulation run." },
        { status: 500, headers },
      );
    }

    if (!run) {
      return NextResponse.json({ error: "Run not found." }, { status: 404, headers });
    }

    if (run.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403, headers });
    }

    const { error } = await supabase.from("simulation_events").insert({
      run_id: runId,
      user_id: user.id,
      event_type: eventType,
      phase,
      payload,
    });

    if (error) {
      logger.error("POST /api/simulation-events insert failed", error, { requestId });
      return NextResponse.json(
        { error: "Failed to record simulation event." },
        { status: 500, headers },
      );
    }

    return NextResponse.json({ ok: true }, { headers });
  } catch (error) {
    logger.error("POST /api/simulation-events unexpected error", error, { requestId });
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500, headers },
    );
  }
}

