import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { getOrCreateRequestId, withRequestIdHeaders } from "@/lib/apiRequestId";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ runId: string }> },
) {
  const requestId = getOrCreateRequestId(request);
  const headers = withRequestIdHeaders(requestId);
  try {
    const { runId } = await context.params;

    if (!runId) {
      return NextResponse.json({ error: "Missing run ID." }, { status: 400, headers });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers });
    }

    const { error } = await supabase
      .from("cmo_simulation_runs")
      .delete()
      .eq("run_id", runId)
      .eq("user_id", user.id);

    if (error) {
      logger.error("DELETE /api/simulations/[runId] failed", error, { requestId, runId });
      return NextResponse.json({ error: "Failed to delete run." }, { status: 500, headers });
    }

    return NextResponse.json({ ok: true }, { headers });
  } catch (error) {
    logger.error("DELETE /api/simulations/[runId] unexpected error", error, { requestId });
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500, headers },
    );
  }
}
