import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { getOrCreateRequestId, withRequestIdHeaders } from "@/lib/apiRequestId";

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
}

export async function GET(request: NextRequest) {
  const requestId = getOrCreateRequestId(request);
  const headers = withRequestIdHeaders(requestId);
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers });
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      logger.error("GET /api/profile failed", error, { requestId });
      return NextResponse.json({ error: "Failed to load profile." }, { status: 500, headers });
    }

    return NextResponse.json({ ok: true, profile: data ?? null }, { headers });
  } catch (error) {
    logger.error("GET /api/profile unexpected error", error, { requestId });
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500, headers },
    );
  }
}

export async function POST(request: NextRequest) {
  const requestId = getOrCreateRequestId(request);
  const headers = withRequestIdHeaders(requestId);
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id || !user.email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers });
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body || !isRecord(body)) {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400, headers });
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
      logger.error("POST /api/profile failed", error, { requestId });
      return NextResponse.json({ error: "Failed to save profile." }, { status: 500, headers });
    }

    return NextResponse.json({ ok: true, profile: data }, { headers });
  } catch (error) {
    logger.error("POST /api/profile unexpected error", error, { requestId });
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500, headers },
    );
  }
}

