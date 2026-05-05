import type { SimulationContext } from "@/lib/simMachine";
import { calculateGrade, calculateOverallScore, buildTeachingReport } from "@/lib/simulationInsights";

export interface SimulationScoreBreakdownDraft {
  phase: string;
  category: string;
  score: number;
  maxScore: number;
  insight: string;
  metadata: Record<string, unknown>;
}

export interface SimulationRecommendationDraft {
  priority: number;
  title: string;
  body: string;
  phase: string;
  category: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function toScore(value: number): number {
  return Math.round(clamp(value, 0, 100));
}

function quarterScore(context: SimulationContext, quarterKey: "Q1" | "Q2" | "Q3" | "Q4"): number {
  const quarter = context.quarters[quarterKey];
  const tacticCount = quarter.tactics.length;
  const spendSignal = quarter.budgetSpent > 0 ? 12 : 0;
  const profitSignal = quarter.results.profit > 0 ? 20 : 0;
  const revenueSignal = clamp(quarter.results.revenue / 40000, 0, 20);
  const marketSignal = quarter.results.marketShare * 0.3;
  const satisfactionSignal = quarter.results.customerSatisfaction * 0.2;
  const awarenessSignal = quarter.results.brandAwareness * 0.2;
  const depthSignal = clamp(tacticCount * 5, 0, 15);

  return toScore(
    spendSignal +
      profitSignal +
      revenueSignal +
      marketSignal +
      satisfactionSignal +
      awarenessSignal +
      depthSignal,
  );
}

export function buildSimulationScoreBreakdowns(
  context: SimulationContext,
): SimulationScoreBreakdownDraft[] {
  const setupScore = toScore(
    (context.scenarioId ? 20 : 0) +
      (context.strategy.companyName?.trim() ? 25 : 0) +
      (context.strategy.logoStyle ? 15 : 0) +
      (context.strategy.budgetAllocation ? 20 : 0) +
      (Object.keys(context.strategy.budgetAllocation ?? {}).length > 0 ? 10 : 0) +
      (typeof context.totalBudget === "number" ? 10 : 0),
  );

  const strategyScore = toScore(
    (context.strategy.targetAudience?.trim() ? 30 : 0) +
      (context.strategy.brandPositioning?.trim() ? 30 : 0) +
      ((context.strategy.primaryChannels?.length ?? 0) > 0 ? 25 : 0) +
      ((context.strategy.primaryChannels?.length ?? 0) >= 2 ? 15 : 0),
  );

  const q1 = quarterScore(context, "Q1");
  const q2 = quarterScore(context, "Q2");
  const q3 = quarterScore(context, "Q3");
  const q4 = quarterScore(context, "Q4");
  const overallRaw = Math.min(100, calculateOverallScore(context));
  const overallScore = toScore(overallRaw);
  const report = buildTeachingReport(context);

  return [
    {
      phase: "setup",
      category: "foundation",
      score: setupScore,
      maxScore: 100,
      insight:
        setupScore >= 80
          ? "The operating setup is structurally sound and ready for execution."
          : "The setup needs more structure before the simulation can compound well.",
      metadata: {
        scenarioId: context.scenarioId ?? null,
        companyName: context.strategy.companyName ?? null,
        logoStyle: context.strategy.logoStyle ?? null,
        budgetAllocation: context.strategy.budgetAllocation ?? null,
      },
    },
    {
      phase: "strategy",
      category: "clarity",
      score: strategyScore,
      maxScore: 100,
      insight:
        strategyScore >= 80
          ? "The audience, positioning, and channel mix are focused enough to act on."
          : "The strategy needs clearer audience, positioning, or channel alignment.",
      metadata: {
        targetAudience: context.strategy.targetAudience ?? null,
        brandPositioning: context.strategy.brandPositioning ?? null,
        primaryChannels: context.strategy.primaryChannels ?? [],
      },
    },
    {
      phase: "Q1",
      category: "launch",
      score: q1,
      maxScore: 100,
      insight:
        q1 >= 80
          ? "Q1 launched with useful signal and disciplined early execution."
          : "Q1 needs a tighter launch plan or stronger early-quarter conversion signal.",
      metadata: {
        tactics: context.quarters.Q1.tactics.length,
        revenue: context.quarters.Q1.results.revenue,
        profit: context.quarters.Q1.results.profit,
      },
    },
    {
      phase: "Q2",
      category: "scale",
      score: q2,
      maxScore: 100,
      insight:
        q2 >= 80
          ? "Q2 scaled without losing too much control."
          : "Q2 likely needs sharper tradeoff discipline around spend and market response.",
      metadata: {
        tactics: context.quarters.Q2.tactics.length,
        revenue: context.quarters.Q2.results.revenue,
        profit: context.quarters.Q2.results.profit,
      },
    },
    {
      phase: "Q3",
      category: "optimization",
      score: q3,
      maxScore: 100,
      insight:
        q3 >= 80
          ? "Q3 shows strong optimization and course-correction instincts."
          : "Q3 suggests the portfolio needs a better balance between scale and efficiency.",
      metadata: {
        tactics: context.quarters.Q3.tactics.length,
        revenue: context.quarters.Q3.results.revenue,
        profit: context.quarters.Q3.results.profit,
      },
    },
    {
      phase: "Q4",
      category: "finish",
      score: q4,
      maxScore: 100,
      insight:
        q4 >= 80
          ? "Q4 finished with strong closing discipline."
          : "Q4 should be tuned for a stronger finish and cleaner annual close.",
      metadata: {
        tactics: context.quarters.Q4.tactics.length,
        revenue: context.quarters.Q4.results.revenue,
        profit: context.quarters.Q4.results.profit,
      },
    },
    {
      phase: "debrief",
      category: "overall",
      score: overallScore,
      maxScore: 100,
      insight:
        overallScore >= 80
          ? `Final outcome is strong. ${report.growthLeaderTakeaway}`
          : `Final outcome leaves room to improve. ${report.nextMove}`,
      metadata: {
        grade: calculateGrade(overallRaw),
        report,
      },
    },
  ];
}

export function deriveSimulationRecommendations(
  context: SimulationContext,
  scoreBreakdowns: SimulationScoreBreakdownDraft[],
): SimulationRecommendationDraft[] {
  const byPhase = new Map(scoreBreakdowns.map((entry) => [entry.phase, entry]));
  const recommendations: SimulationRecommendationDraft[] = [];

  const setup = byPhase.get("setup");
  const strategy = byPhase.get("strategy");
  const q1 = byPhase.get("Q1");
  const q2 = byPhase.get("Q2");
  const q3 = byPhase.get("Q3");
  const q4 = byPhase.get("Q4");
  const overall = byPhase.get("debrief");

  if ((setup?.score ?? 0) < 75) {
    recommendations.push({
      priority: 1,
      title: "Tighten the operating setup",
      body: "Capture the company profile, scenario choice, and budget posture more deliberately before starting the next run.",
      phase: "setup",
      category: "foundation",
    });
  }

  if ((strategy?.score ?? 0) < 75) {
    recommendations.push({
      priority: 2,
      title: "Clarify the go-to-market stance",
      body: "Make the audience, positioning, and primary channel mix more explicit so the quarter plan has a sharper edge.",
      phase: "strategy",
      category: "clarity",
    });
  }

  if ((q1?.score ?? 0) < 70) {
    recommendations.push({
      priority: 3,
      title: "Strengthen the opening quarter",
      body: "Front-load the first quarter with a cleaner launch hypothesis and more visible market signal.",
      phase: "Q1",
      category: "launch",
    });
  }

  if ((q2?.score ?? 0) < 70) {
    recommendations.push({
      priority: 4,
      title: "Scale with more discipline",
      body: "Use Q2 to grow only what is working and protect the budget from overextension.",
      phase: "Q2",
      category: "scale",
    });
  }

  if ((q3?.score ?? 0) < 70) {
    recommendations.push({
      priority: 5,
      title: "Rebalance the portfolio sooner",
      body: "Shift some spend away from crowded or weak channels before the endgame pressure rises.",
      phase: "Q3",
      category: "optimization",
    });
  }

  if ((q4?.score ?? 0) < 70) {
    recommendations.push({
      priority: 6,
      title: "Plan for a stronger finish",
      body: "Reserve enough flexibility for the final quarter so the annual close is more defensible.",
      phase: "Q4",
      category: "finish",
    });
  }

  if ((context.remainingBudget ?? 0) > context.totalBudget * 0.2) {
    recommendations.push({
      priority: 7,
      title: "Deploy more of the budget",
      body: "A meaningful share of budget is still unused. Push harder on the highest-confidence bets next run.",
      phase: "debrief",
      category: "efficiency",
    });
  }

  if ((overall?.score ?? 0) >= 85) {
    recommendations.push({
      priority: 8,
      title: "Run a tougher scenario",
      body: "The current strategy is working well enough to justify a harder scenario or a tighter budget split.",
      phase: "debrief",
      category: "stretch",
    });
  }

  return recommendations.slice(0, 4);
}

