import type { NextRequest } from "next/server";

export function getOrCreateRequestId(request: NextRequest): string {
  const fromHeader = request.headers.get("x-request-id")?.trim();
  if (fromHeader && fromHeader.length > 0 && fromHeader.length < 200) {
    return fromHeader;
  }
  return crypto.randomUUID();
}

export function withRequestIdHeaders(
  requestId: string,
  headers?: HeadersInit,
): Headers {
  const h = new Headers(headers);
  h.set("x-request-id", requestId);
  return h;
}
