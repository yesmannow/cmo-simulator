import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/sim/setup";
  }
  return next;
}

/**
 * Completes Supabase email confirmation (PKCE): user lands here with ?code= from the verify redirect.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNextPath(url.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(new URL("/auth/sign-in?message=missing_code", url.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/sign-in?message=${encodeURIComponent("confirm_link_invalid")}`, url.origin),
    );
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
