/**
 * Shared contracts for simulation **outcomes** (KPI snapshots) and **scores** (numeric + letter grade).
 *
 * ## Two score pipelines — keep them distinct
 *
 * - **Machine debrief** (`calculateFinalResults` in `simMachine.ts`): sets `context.finalResults` when XState
 *   enters `debrief`. Uses `SimulationMachineGrade` (A–F only).
 * - **Teaching / persistence** (`simulationInsights.calculateOverallScore` + `calculateGrade`): powers
 *   PDF export, `PersistedRunPayload`, and `simulationIntelligence` breakdowns. Uses `SimulationTeachingGrade` (A+–F).
 *
 * Do not assume machine `finalResults.score` matches persisted `overallScore` without reconciling formulas.
 */

/** KPI bundle used on `QuarterData.results` and `SimulationContext.kpis` (cumulative vs quarter-local semantics stay in `simMachine`). */
export interface SimulationKpiSnapshot {
  revenue: number;
  profit: number;
  marketShare: number;
  customerSatisfaction: number;
  brandAwareness: number;
}

/** Letter grades attached to XState-computed `finalResults`. */
export type SimulationMachineGrade = "A" | "B" | "C" | "D" | "F";

/** Letter grades used for teaching copy, exports, and Supabase-run rows (`simulationInsights.calculateGrade`). */
export type SimulationTeachingGrade = "A+" | "A" | "B" | "C" | "D" | "F";
