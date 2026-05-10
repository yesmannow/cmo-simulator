import type { SimulationContext } from "@/lib/simMachine";
import type { SimulationTeachingGrade } from "@/lib/simulationContracts";
import { buildTeachingReport, calculateGrade, calculateOverallScore } from "@/lib/simulationInsights";

export interface PersistedRunPayload {
  runId: string;
  userId: string;
  userEmail: string;
  userName?: string;
  scenarioId: string;
  companyName: string;
  currentPhase: string;
  status: "in_progress" | "completed";
  overallScore: number;
  grade: SimulationTeachingGrade;
  debrief: ReturnType<typeof buildTeachingReport>;
  context: SimulationContext;
  savedAtIso: string;
}

export function toPersistedRunPayload(
  context: SimulationContext,
  auth: { userId: string; email: string; name?: string },
  options?: { phase?: string; status?: "in_progress" | "completed" },
): PersistedRunPayload {
  const overallScore = calculateOverallScore(context);
  const grade = calculateGrade(overallScore);
  const now = new Date().toISOString();

  return {
    runId: context.simulationId || crypto.randomUUID(),
    userId: auth.userId,
    userEmail: auth.email,
    userName: auth.name,
    scenarioId: context.scenarioId || "custom",
    companyName: context.strategy?.companyName || "Untitled Company",
    currentPhase: options?.phase ?? "completed",
    status: options?.status ?? "completed",
    overallScore,
    grade,
    debrief: buildTeachingReport(context),
    context,
    savedAtIso: now,
  };
}
