"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { resolveSimulationPath } from "@/lib/simulationRouting";
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

export default function SimulationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [runs, setRuns] = useState<PersistedRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/simulations");
        const data = await response.json();
        if (!response.ok) {
          setError(data?.error ?? "Unable to load simulations.");
          return;
        }
        setRuns(Array.isArray(data?.runs) ? data.runs : []);
      } catch {
        setError("Unable to load simulations.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const resumeRun = (run: PersistedRun) => {
    if (!run.context) return;
    localStorage.setItem("cmo-sim-state-v2", JSON.stringify(run.context));
    router.push(resolveSimulationPath(run.current_phase));
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">My simulations</h1>
        <p className="mt-2 text-sm text-slate-600">
          {user?.email ? `Signed in as ${user.email}` : "Your saved runs are listed below."}
        </p>
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
          <div className="p-6 text-sm text-slate-600">No saved runs yet. Start a new simulation to begin tracking.</div>
        ) : (
          <ul className="divide-y divide-slate-200">
            {runs.map((run) => (
              <li key={run.run_id} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-950">{run.company_name || "Untitled Company"}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {safeDate(run.saved_at)} · {run.status} · phase {run.current_phase}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Score: {run.overall_score ?? "n/a"} {run.grade ? `· Grade ${run.grade}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  disabled={!run.context}
                  onClick={() => resumeRun(run)}
                >
                  Resume
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

