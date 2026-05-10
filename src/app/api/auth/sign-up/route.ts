import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrCreateRequestId, withRequestIdHeaders } from "@/lib/apiRequestId";
import { logger } from "@/lib/logger";

const MAX_SIGNUP_BODY_BYTES = 32 * 1024;
const MAX_EMAIL_LEN = 254;

function publicSiteUrl(request: NextRequest): string {
  const fromEnv = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv;
  }
  return request.nextUrl.origin;
}

function resendFromAddress(): string | null {
  return (
    process.env.RESEND_FROM_EMAIL?.trim()
    || process.env.EMAIL_FROM?.trim()
    || null
  );
}

function confirmationEmailHtml(confirmUrl: string): string {
  return `
<!DOCTYPE html>
<html>
  <body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #0f172a;">
    <p>Thanks for creating a CMO Simulator account.</p>
    <p>Confirm your email to finish setup (link expires after a while):</p>
    <p><a href="${confirmUrl}" style="display:inline-block;padding:10px 16px;background:#0f172a;color:#fff;text-decoration:none;border-radius:6px;">Confirm email</a></p>
    <p style="font-size:12px;color:#64748b;">If the button does not work, paste this URL into your browser:<br/><span style="word-break:break-all;">${confirmUrl}</span></p>
  </body>
</html>`.trim();
}

export async function POST(request: NextRequest) {
  const requestId = getOrCreateRequestId(request);
  const headers = withRequestIdHeaders(requestId);
  const len = Number(request.headers.get("content-length") ?? "0");
  if (len > MAX_SIGNUP_BODY_BYTES) {
    return NextResponse.json({ message: "Request body too large." }, { status: 413, headers });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = resendFromAddress();
  const admin = createAdminClient();

  if (!apiKey || !from || !admin) {
    return NextResponse.json(
      { code: "email_not_configured", message: "Resend + Supabase service role are not configured on the server." },
      { status: 503, headers },
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400, headers });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email.includes("@") || email.length > MAX_EMAIL_LEN) {
    return NextResponse.json({ message: "Enter a valid email address." }, { status: 400, headers });
  }
  if (password.length < 8 || password.length > 256) {
    return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 400, headers });
  }

  const site = publicSiteUrl(request);
  const redirectTo = `${site}/auth/callback?next=${encodeURIComponent("/sim/setup")}`;

  const { data, error } = await admin.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: { redirectTo },
  });

  if (error) {
    const blob = `${error.message} ${error.code || ""}`.toLowerCase();
    if (
      blob.includes("already")
      || blob.includes("registered")
      || blob.includes("exists")
      || blob.includes("user_already")
    ) {
      return NextResponse.json(
        { message: "An account with this email already exists. Sign in instead." },
        { status: 409, headers },
      );
    }
    logger.error("sign-up generateLink failed", error, { requestId });
    return NextResponse.json({ message: "Sign up failed. Check your details and try again." }, { status: 400, headers });
  }

  const actionLink = data.properties?.action_link;
  const userId = data.user?.id;
  if (!actionLink || !userId) {
    logger.error("sign-up missing action_link or user id", new Error("invalid generateLink payload"), {
      requestId,
    });
    return NextResponse.json(
      { message: "Could not create a confirmation link." },
      { status: 500, headers },
    );
  }

  const resend = new Resend(apiKey);
  const replyTo = process.env.RESEND_REPLY_TO?.trim() || process.env.RESEND_TO_EMAIL?.trim();

  const { error: sendError } = await resend.emails.send(
    {
      from,
      to: [email],
      ...(replyTo ? { replyTo } : {}),
      subject: "Confirm your email — CMO Simulator",
      html: confirmationEmailHtml(actionLink),
    },
    { idempotencyKey: `cmo-signup-confirm/${userId}` },
  );

  if (sendError) {
    await admin.auth.admin.deleteUser(userId);
    logger.error("sign-up Resend send failed", sendError, { requestId });
    return NextResponse.json(
      { message: "Failed to send confirmation email." },
      { status: 502, headers },
    );
  }

  return NextResponse.json({ ok: true }, { headers });
}
