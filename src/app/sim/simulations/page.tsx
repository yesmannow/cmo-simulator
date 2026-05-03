"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { resumeSimulationRun } from "@/lib/resumeSimulationRun";
import type { SimulationContext } from "@/lib/simMachine";

type PersistedRun = {
  run_id: string;
  company_name: string;
  current_phase: string;
  status: "in_progress" | "completed";
  overall_score: number | null;
  grade: string | null;
  context: Partial<SimulationContext> | null;
  saved_at: string;
};

function safeDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown save time";
  return date.toLocaleString();
}

/** Map PostgREST / Supabase errors to a short UI message when the table or schema is wrong. */
function loadSimulationsUserMessage(apiError: string | undefined, details: unknown): string {
  const d = typeof details === "string" ? details : "";
  const combined = `${apiError ?? ""} ${d}`.toLowerCase();
  if (
    combined.includes("pgrst205")
    || combined.includes("schema cache")
    || combined.includes("could not find the table")
    || combined.includes("relation \"public.cmo_simulation_runs\" does not exist")
  ) {
    return "Saved runs are unavailable: the database table is missing or not migrated. Ask an admin to apply supabase/migrations/20260502_create_cmo_simulation_runs.sql (see supabase/verification/cmo_simulation_runs.sql for checks).";
  }
  return apiError ?? "Unable to load simulations.";
}

function StatusBadge({ status }: { status: "in_progress" | "completed" }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
        Completed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
      In progress
    </span>
  );
}

export default function SimulationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [runs, setRuns] = useState<PersistedRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadRuns = useCallback(async (signal?: AbortSignal) => {
    setError(null);
    try {
      const response = await fetch("/api/simulations", { signal });
      if (signal?.aborted) return;
      const data = await response.json();
      if (signal?.aborted) return;
      if (!response.ok) {
        setError(loadSimulationsUserMessage(data?.error, data?.details));
        return;
      }
      setRuns(Array.isArray(data?.runs) ? data.runs : []);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError("Unable to load simulations.");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    void loadRuns(controller.signal).finally(() => {
      if (!controller.signal.aborted) setIsLoading(false);
    });
    return () => controller.abort();
  }, [loadRuns]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadRuns();
    setIsRefreshing(false);
  };

  const handleResume = (run: PersistedRun) => {
    const path = resumeSimulationRun({
      context: run.context as Record<string, unknown> | null,
      current_phase: run.current_phase,
    });
    if (path) router.push(path);
  };

  const handleDelete = async (runId: string) => {
    if (!window.confirm("Delete this simulation run? This cannot be undone.")) return;
    setDeletingId(runId);
    try {
      const response = await fetch(`/api/simulations/${runId}`, { method: "DELETE" });
      if (response.ok) {
        setRuns((prev) => prev.filter((r) => r.run_id !== runId));
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data?.error ?? "Failed to delete run.");
      }
    } catch {
      setError("Failed to delete run.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">My simulations</h1>
            <p className="mt-1 text-sm text-slate-600">
              {user?.email ? `Signed in as ${user.email}` : "Your saved runs are listed below."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
        <div className="mt-4">
          <Link
            href="/sim/setup"
            className="inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            New simulation
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-6 text-sm text-slate-600">Loading saved runs…</div>
        ) : error ? (
          <div className="p-6 text-sm text-rose-700">{error}</div>
        ) : runs.length === 0 ? (
          <div className="flex flex-col items-start gap-4 p-6">
            <p className="text-sm text-slate-600">
              No saved runs yet. Start your first simulation to begin tracking your decisions and score.
            </p>
            <Link
              href="/sim/setup"
              className="inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Start a simulation
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-200">
            {runs.map((run) => (
              <li
                key={run.run_id}
                className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-950">
                      {run.company_name || "Untitled Company"}
                    </p>
                    <StatusBadge status={run.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {safeDate(run.saved_at)} · phase {run.current_phase}
                  </p>
                  {(run.overall_score !== null || run.grade) && (
                    <p className="mt-1 text-xs text-slate-600">
                      Score: {run.overall_score ?? "n/a"}
                      {run.grade ? ` · Grade ${run.grade}` : ""}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    disabled={!run.context}
                    onClick={() => handleResume(run)}
                  >
                    {run.status === "completed" ? "Review run" : "Resume run"}
                  </button>
                  <button
                    type="button"
                    className="inline-flex rounded-md border border-rose-100 bg-white px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                    disabled={deletingId === run.run_id}
                    onClick={() => handleDelete(run.run_id)}
                  >
                    {deletingId === run.run_id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
