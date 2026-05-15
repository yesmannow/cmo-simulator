import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { PersistedRunPayload } from "@/lib/simulationPersistence";
import type { SimulationTeachingGrade } from "@/lib/simulationContracts";
import { buildSimulationScoreBreakdowns } from "@/lib/simulationIntelligence";
import { buildTeachingReport, calculateGrade, calculateOverallScore } from "@/lib/simulationInsights";
import { logger } from "@/lib/logger";
import { getOrCreateRequestId, withRequestIdHeaders } from "@/lib/apiRequestId";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_BODY_BYTES = 6 * 1024 * 1024;
const MAX_SAVED_RUNS_PER_USER = 5;

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function validatePayload(payload: unknown): payload is PersistedRunPayload {
  if (!isRecord(payload)) return false;
  if (typeof payload.runId !== "string" || !UUID_RE.test(payload.runId)) return false;
  if (typeof payload.userId !== "string" || typeof payload.userEmail !== "string") return false;
  if (!payload.context || typeof payload.context !== "object") return false;
  if (payload.status !== "in_progress" && payload.status !== "completed") return false;
  return true;
}

function toRpcRunRow(
  payload: PersistedRunPayload,
  finalized: {
    overallScore: number;
    grade: SimulationTeachingGrade;
    debrief: ReturnType<typeof buildTeachingReport>;
  },
) {
  return {
    run_id: payload.runId,
    user_id: payload.userId,
    user_email: payload.userEmail,
    user_name: payload.userName ?? null,
    scenario_id: payload.scenarioId,
    company_name: payload.companyName,
    current_phase: payload.currentPhase,
    status: payload.status,
    overall_score: finalized.overallScore,
    grade: finalized.grade,
    debrief: finalized.debrief,
    context: payload.context,
    saved_at: payload.savedAtIso,
  };
}

export async function POST(request: NextRequest) {
  const requestId = getOrCreateRequestId(request);
  const headers = withRequestIdHeaders(requestId);

  try {
    const rawLength = Number(request.headers.get("content-length") ?? "0");
    if (rawLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "Request body too large." },
        { status: 413, headers },
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id || !user.email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400, headers });
    }

    if (!validatePayload(body)) {
      return NextResponse.json({ error: "Missing or invalid payload fields." }, { status: 400, headers });
    }

    const payload = body;

    const payloadEmailNorm = payload.userEmail.trim().toLowerCase();
    const sessionEmailNorm = (user.email ?? "").trim().toLowerCase();
    // Mirror client body fields with cookie session so a tampered JSON body cannot save under another user.
    if (payload.userId !== user.id || payloadEmailNorm !== sessionEmailNorm) {
      return NextResponse.json({ error: "Payload identity mismatch." }, { status: 403, headers });
    }

    // Enforce max saved runs (creation only). Updates to an existing run_id are allowed.
    // We also enforce this in the RPC for race-safety, but this gives a clearer client error code/message.
    try {
      const { data: existingRow, error: existingError } = await supabase
        .from("cmo_simulation_runs")
        .select("run_id")
        .eq("user_id", user.id)
        .eq("run_id", payload.runId)
        .maybeSingle();

      if (existingError) {
        logger.warn("Run existence check failed; deferring to RPC enforcement", {
          requestId,
          errorMessage: existingError.message,
        });
      } else if (!existingRow) {
        const { count, error: countError } = await supabase
          .from("cmo_simulation_runs")
          .select("run_id", { count: "exact", head: true })
          .eq("user_id", user.id);

        if (countError) {
          logger.warn("Run count check failed; deferring to RPC enforcement", {
            requestId,
            errorMessage: countError.message,
          });
        } else if ((count ?? 0) >= MAX_SAVED_RUNS_PER_USER) {
          return NextResponse.json(
            {
              error:
                "Run limit reached (5 saved simulations). Delete one from My simulations before starting a new run.",
            },
            { status: 409, headers },
          );
        }
      }
    } catch (limitError) {
      logger.warn("Run limit precheck failed; deferring to RPC enforcement", {
        requestId,
        error: limitError,
      });
    }

    // Authoritative teaching score + debrief from context (same formulas as client `toPersistedRunPayload`).
    // Client-sent overallScore/grade/debrief are ignored for persistence so tampered JSON cannot skew stored runs.
    const finalizedOverallScore = calculateOverallScore(payload.context);
    const finalizedGrade = calculateGrade(finalizedOverallScore);
    const finalizedDebrief = buildTeachingReport(payload.context);

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

    const pRun = toRpcRunRow(payload, {
      overallScore: finalizedOverallScore,
      grade: finalizedGrade,
      debrief: finalizedDebrief,
    });

    const { data: rpcResult, error: rpcError } = await supabase.rpc("save_simulation_run_atomic", {
      p_run: pRun,
      p_breakdowns: breakdownRows,
    });

    if (rpcError) {
      logger.error("save_simulation_run_atomic RPC failed", rpcError, {
        requestId,
        rpcMessage: rpcError.message,
        rpcCode: "code" in rpcError ? rpcError.code : undefined,
        rpcDetails: "details" in rpcError ? rpcError.details : undefined,
      });
      return NextResponse.json(
        { error: "Failed to persist simulation run." },
        { status: 500, headers },
      );
    }

    const result = rpcResult as { ok?: boolean; error?: string } | null;
    if (!result?.ok) {
      logger.error("save_simulation_run_atomic returned failure", new Error(String(result?.error)), {
        requestId,
        result,
      });
      if (result?.error === "forbidden") {
        return NextResponse.json({ error: "Payload identity mismatch." }, { status: 403, headers });
      }
      if (result?.error === "invalid_input") {
        return NextResponse.json({ error: "Missing or invalid payload fields." }, { status: 400, headers });
      }
      if (result?.error === "run_limit_reached") {
        return NextResponse.json(
          {
            error:
              "Run limit reached (5 saved simulations). Delete one from My simulations before starting a new run.",
          },
          { status: 409, headers },
        );
      }
      return NextResponse.json({ error: "Failed to persist simulation run." }, { status: 500, headers });
    }

    const { data: runRow, error: fetchError } = await supabase
      .from("cmo_simulation_runs")
      .select("*")
      .eq("run_id", payload.runId)
      .single();

    if (fetchError) {
      logger.error("Failed to re-fetch run after atomic save", fetchError, { requestId });
    }

    return NextResponse.json(
      { ok: true, run: runRow ?? null, scoreBreakdowns },
      { headers },
    );
  } catch (error) {
    logger.error("POST /api/simulations/save unexpected error", error, { requestId });
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500, headers: withRequestIdHeaders(requestId) },
    );
  }
}
