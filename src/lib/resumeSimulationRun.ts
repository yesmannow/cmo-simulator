// TODO: Future improvement — hydrate SimulationProvider directly from database/server
// state instead of this localStorage bridge. The bridge is intentional and safe for now:
// SimulationProvider reads 'cmo-sim-state-v2' on mount, so writing here before navigation
// is equivalent to the user having that state saved locally.

import { resolveSimulationPath } from "@/lib/simulationRouting";

const SIMULATION_STORAGE_KEY = "cmo-sim-state-v2";

export type ResumeableRun = {
  current_phase: string;
  context: Record<string, unknown> | null;
};

/**
 * Write a saved run's context into localStorage and return the route to navigate to.
 * Returns null if the run has no usable context or phase.
 */
export function resumeSimulationRun(run: ResumeableRun): string | null {
  if (!run.context || typeof run.context !== "object" || Array.isArray(run.context)) {
    return null;
  }
  if (!run.current_phase || typeof run.current_phase !== "string") {
    return null;
  }

  localStorage.setItem(SIMULATION_STORAGE_KEY, JSON.stringify(run.context));
  return resolveSimulationPath(run.current_phase);
}
