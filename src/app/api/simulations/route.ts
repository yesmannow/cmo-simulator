import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { getOrCreateRequestId, withRequestIdHeaders } from "@/lib/apiRequestId";

export async function GET(request: NextRequest) {
  const requestId = getOrCreateRequestId(request);
  const headers = withRequestIdHeaders(requestId);
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers });
    }

    const { data, error } = await supabase
      .from("cmo_simulation_runs")
      .select("run_id, company_name, current_phase, status, overall_score, grade, context, saved_at")
      .eq("user_id", user.id)
      .order("saved_at", { ascending: false })
      .limit(25);

    if (error) {
      logger.error("GET /api/simulations failed", error, { requestId });
      return NextResponse.json(
        { error: "Failed to load simulations." },
        { status: 500, headers },
      );
    }

    return NextResponse.json({ ok: true, runs: data ?? [] }, { headers });
  } catch (error) {
    logger.error("GET /api/simulations unexpected error", error, { requestId });
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500, headers },
    );
  }
}

