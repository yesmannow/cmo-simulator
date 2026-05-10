/** Maps XState `state.value` strings to App Router paths — phases owned by `simulationMachine` in `simMachine.ts`. */
export type SimulationPhase =
  | "idle"
  | "strategySession"
  | "Q1"
  | "Q2"
  | "Q3"
  | "Q4"
  | "debrief"
  | "completed"
  | string;

export function resolveSimulationPath(phase: SimulationPhase): string {
  switch (phase) {
    case "strategySession":
      return "/sim/strategy";
    case "Q1":
      return "/sim/q1";
    case "Q2":
      return "/sim/q2";
    case "Q3":
      return "/sim/q3";
    case "Q4":
      return "/sim/q4";
    case "debrief":
    case "completed":
      return "/sim/debrief";
    case "idle":
    default:
      return "/sim/setup";
  }
}

