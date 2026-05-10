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
      .select("*")
      .eq("user_id", user.id)
      .order("saved_at", { ascending: false })
      .limit(1);

    if (error) {
      logger.error("GET /api/simulations/latest failed", error, { requestId });
      return NextResponse.json(
        { error: "Failed to load latest simulation run." },
        { status: 500, headers },
      );
    }

    return NextResponse.json({ ok: true, run: data?.[0] ?? null }, { headers });
  } catch (error) {
    logger.error("GET /api/simulations/latest unexpected error", error, { requestId });
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500, headers },
    );
  }
}
