import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { hasEnvVar } from "@/lib/env";

async function checkSupabaseReachable(): Promise<boolean> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!base || !anon) return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch(`${base}/auth/v1/health`, {
      method: "GET",
      headers: { apikey: anon, Authorization: `Bearer ${anon}` },
      signal: controller.signal,
    });
    if (res.ok) return true;
    if (res.status === 404) {
      const rest = await fetch(`${base}/rest/v1/`, {
        method: "HEAD",
        headers: { apikey: anon, Authorization: `Bearer ${anon}` },
        signal: controller.signal,
      });
      return rest.ok || rest.status === 401 || rest.status === 404;
    }
    return false;
  } catch (e) {
    logger.warn("Supabase health probe failed", { error: String(e) });
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * GET /api/health — liveness + optional dependency checks for proxies (Coolify, etc.)
 */
export async function GET() {
  try {
    const supabaseOk = await checkSupabaseReachable();
    const resendConfigured =
      hasEnvVar("RESEND_API_KEY") && hasEnvVar("RESEND_FROM_EMAIL");
    const serviceRolePresent = hasEnvVar("SUPABASE_SERVICE_ROLE_KEY");

    const dependencies = {
      supabaseReachable: supabaseOk,
      resendConfigured,
      serviceRolePresent,
    };

    const ready = supabaseOk;

    return NextResponse.json(
      {
        status: ready ? "healthy" : "unhealthy",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || "unknown",
        environment: process.env.NODE_ENV || "development",
        dependencies,
      },
      { status: ready ? 200 : 503 },
    );
  } catch (error) {
    logger.error("Health check failed: unexpected error", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Service unavailable",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || "unknown",
      },
      { status: 503 },
    );
  }
}
