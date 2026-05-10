"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CloudOff, Loader2, RefreshCw, Check } from "lucide-react";
import { SAVE_SYNC_EVENT, type SaveSyncEventDetail } from "@/lib/saveSimulationSync";
import { useSimulation } from "@/hooks/useSimulation";
import { saveSimulationSnapshot } from "@/lib/saveSimulationSnapshot";
import { cn } from "@/lib/utils";

function phaseForSaveFromPath(pathname: string | null): string {
  if (!pathname) return "setup";
  if (pathname.includes("/sim/q1")) return "Q1";
  if (pathname.includes("/sim/q2")) return "Q2";
  if (pathname.includes("/sim/q3")) return "Q3";
  if (pathname.includes("/sim/q4")) return "Q4";
  if (pathname.includes("/sim/debrief")) return "debrief";
  if (pathname.includes("/sim/strategy")) return "strategy";
  return "setup";
}

export function SaveSyncStatus() {
  const [detail, setDetail] = useState<SaveSyncEventDetail | null>(null);
  const { context } = useSimulation();
  const pathname = usePathname();

  useEffect(() => {
    const handler = (event: Event) => {
      const e = event as CustomEvent<SaveSyncEventDetail>;
      if (e.detail) setDetail(e.detail);
    };
    window.addEventListener(SAVE_SYNC_EVENT, handler as EventListener);
    return () => window.removeEventListener(SAVE_SYNC_EVENT, handler as EventListener);
  }, []);

  useEffect(() => {
    if (detail?.state !== "saved") return;
    const t = window.setTimeout(() => setDetail(null), 2800);
    return () => window.clearTimeout(t);
  }, [detail?.state]);

  const handleRetry = useCallback(() => {
    const phase = phaseForSaveFromPath(pathname);
    void saveSimulationSnapshot(
      context,
      phase,
      context.finalResults ? "completed" : "in_progress",
    );
  }, [context, pathname]);

  if (!detail || detail.state === "idle") {
    return null;
  }

  const label =
    detail.state === "saving"
      ? "Saving…"
      : detail.state === "saved"
        ? "Saved"
        : detail.state === "offline"
          ? "Offline"
          : "Save issue";

  return (
    <div
      className={cn(
        "flex max-w-[min(100%,18rem)] flex-wrap items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-medium shadow-sm",
        detail.state === "saved" && "border-emerald-200 bg-emerald-50 text-emerald-900",
        detail.state === "saving" && "border-slate-200 bg-white text-slate-700",
        detail.state === "offline" && "border-amber-200 bg-amber-50 text-amber-950",
        detail.state === "error" && "border-rose-200 bg-rose-50 text-rose-900",
      )}
      role="status"
      aria-live="polite"
    >
      {detail.state === "saving" ? (
        <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-slate-500" aria-hidden />
      ) : null}
      {detail.state === "saved" ? (
        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
      ) : null}
      {detail.state === "offline" ? (
        <CloudOff className="h-3.5 w-3.5 shrink-0 text-amber-700" aria-hidden />
      ) : null}
      <span className="truncate">{label}</span>
      {detail.message && detail.state === "error" ? (
        <span className="w-full text-[11px] font-normal leading-snug text-rose-800">{detail.message}</span>
      ) : null}
      {(detail.state === "error" || detail.state === "offline") ? (
        <button
          type="button"
          onClick={handleRetry}
          className="inline-flex shrink-0 items-center gap-1 rounded border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-800 hover:bg-slate-50"
        >
          <RefreshCw className="h-3 w-3" aria-hidden />
          Retry
        </button>
      ) : null}
    </div>
  );
}
