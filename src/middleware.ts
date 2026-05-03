import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { user, response } = await updateSession(request);
  const { pathname } = request.nextUrl;
  const requiresAuth =
    pathname.startsWith("/sim") || pathname.startsWith("/api/simulations");

  if (requiresAuth && !user) {
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
  matcher: ["/sim/:path*", "/api/simulations/:path*"],
};
