import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: "Failed to load profile.", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, profile: data ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id || !user.email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body || !isRecord(body)) {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const profileRow = {
      user_id: user.id,
      email: user.email,
      full_name: typeof body.fullName === "string" ? body.fullName.trim() : null,
      company_name: typeof body.companyName === "string" ? body.companyName.trim() : null,
      role: typeof body.role === "string" ? body.role.trim() : null,
      marketing_maturity: typeof body.marketingMaturity === "string" ? body.marketingMaturity.trim() : null,
      selected_goals: toStringArray(body.selectedGoals),
      onboarding_answers: isRecord(body.onboardingAnswers) ? body.onboardingAnswers : {},
      preferred_difficulty: typeof body.preferredDifficulty === "string" ? body.preferredDifficulty.trim() : null,
    };

    const { data, error } = await supabase
      .from("user_profiles")
      .upsert(profileRow, { onConflict: "user_id" })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to save profile.", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, profile: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

