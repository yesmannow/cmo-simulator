import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

function attachRequestId(request: NextRequest, response: NextResponse) {
  const existing = request.headers.get("x-request-id")?.trim();
  const id =
    existing && existing.length > 0 && existing.length < 200
      ? existing
      : crypto.randomUUID();
  response.headers.set("x-request-id", id);
}

export async function middleware(request: NextRequest) {
  const { user, response } = await updateSession(request);
  attachRequestId(request, response);
  const { pathname } = request.nextUrl;
  const requiresAuth =
    pathname.startsWith("/sim") || pathname.startsWith("/api/simulations");
  const requiresApiAuth =
    pathname.startsWith("/api/profile") || pathname.startsWith("/api/simulation-events");

  if ((requiresAuth || requiresApiAuth) && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/sign-in";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

// Only run Supabase session refresh + auth checks where needed. A global matcher
// would call getUser() on every page (including `/`), which blocks the UI on a
// slow or unreachable Supabase host during local dev.
export const config = {
  matcher: ["/sim/:path*", "/api/simulations/:path*", "/api/profile/:path*", "/api/simulation-events/:path*"],
};
