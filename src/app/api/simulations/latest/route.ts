import { NextRequest, NextResponse } from "next/server";
import { supabaseRestRequest } from "@/lib/supabaseRest";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId query parameter." }, { status: 400 });
    }

    const response = await supabaseRestRequest(
      `/rest/v1/cmo_simulation_runs?user_id=eq.${encodeURIComponent(
        userId,
      )}&select=*&order=saved_at.desc&limit=1`,
      { method: "GET" },
    );

    if (!response.ok) {
      const details = await response.text();
      return NextResponse.json(
        { error: "Failed to load latest simulation run.", details },
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

