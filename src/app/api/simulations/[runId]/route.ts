import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ runId: string }> },
) {
  try {
    const { runId } = await context.params;

    if (!runId) {
      return NextResponse.json({ error: "Missing run ID." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { error } = await supabase
      .from("cmo_simulation_runs")
      .delete()
      .eq("run_id", runId)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete run.", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
