import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("cmo_simulation_runs")
      .select("run_id, company_name, current_phase, status, overall_score, grade, context, saved_at")
      .eq("user_id", user.id)
      .order("saved_at", { ascending: false })
      .limit(25);

    if (error) {
      return NextResponse.json({ error: "Failed to load simulations.", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, runs: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

