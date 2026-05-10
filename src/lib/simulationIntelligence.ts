import type { SimulationContext } from "@/lib/simMachine";
import {
  buildTeachingReport,
  calculateExecutiveScoreRubric,
  calculateGrade,
  calculateOverallScore,
  EXECUTIVE_RUBRIC_LABELS,
  EXECUTIVE_RUBRIC_WEIGHTS,
  type ExecutiveRubricKey,
} from "@/lib/simulationInsights";

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

const RUBRIC_ORDER: ExecutiveRubricKey[] = [
  "growth_quality",
  "efficiency",
  "strategic_coherence",
  "resilience",
  "finish_quality",
];

function buildRubricInsight(key: ExecutiveRubricKey, score: number, context: SimulationContext): string {
  const deployed = Math.max(0, context.totalBudget - context.remainingBudget);
  const utilization = context.totalBudget > 0 ? deployed / context.totalBudget : 0;
  const q4 = context.quarters.Q4.results;
  const q1 = context.quarters.Q1.results;

  if (key === "growth_quality") {
    if (score >= 78) {
      return "Revenue mass, late-stage share, and satisfaction trajectory compound — growth looks durable rather than one-quarter noise.";
    }
    if (q4.revenue <= q1.revenue * 1.05) {
      return "Growth quality is capped by flat year-over-year revenue arc; push harder on repeatable demand engines or tighten conversion through the funnel.";
    }
    return "Growth is uneven: strengthen Q4 lift vs early quarters and protect satisfaction while scaling so gains survive the full year.";
  }

  if (key === "efficiency") {
    if (score >= 78) {
      return "Spend converts to profit with healthy utilization — you extracted learning without hoarding budget or bleeding margin.";
    }
    if (utilization < 0.55) {
      return "Efficiency score is dragged by under-deployment; idle budget starves the experiment loop and hides true channel ROI.";
    }
    return "Margin or profit-per-dollar deployed is soft; rebalance toward higher-yield tactics and trim low-conviction spend.";
  }

  if (key === "strategic_coherence") {
    if (score >= 78) {
      return "Stated audience/positioning/channels line up with where dollars actually flowed — the plan reads as one narrative.";
    }
    if (!(context.strategy.primaryChannels?.length ?? 0)) {
      return "Coherence suffers from vague channel intent; name 2–3 primary routes and bias spend toward that spine next run.";
    }
    return "Execution drifted from the declared strategy spine or portfolio skewed too narrowly — reconcile channels vs positioning.";
  }

  if (key === "resilience") {
    if (score >= 78) {
      return "Execution stayed resilient: profits held across quarters, volatility stayed manageable, and wildcards were addressed.";
    }
    const negatives = [context.quarters.Q1, context.quarters.Q2, context.quarters.Q3, context.quarters.Q4].filter(
      (q) => q.results.profit <= 0,
    ).length;
    if (negatives >= 2) {
      return "Profit instability across multiple quarters signals brittle execution — pace bets and defend downside before scaling.";
    }
    return "Resilience gaps likely tie to wildcard responses, uneven quarterly profits, or thin tactical breadth — diversify bets.";
  }

  if (key === "finish_quality") {
    if (score >= 78) {
      return "The fiscal close lands cleanly — late momentum on revenue/share plus durable sentiment.";
    }
    if (q4.marketShare <= context.quarters.Q3.results.marketShare + 0.25) {
      return "Finish quality reflects stalled share momentum into Q4; sequence a sharper endgame push and awareness follow-through.";
    }
    return "Q4 outcomes trail what an enterprise-grade close expects — tighten final-quarter priorities and customer sentiment.";
  }

  return "Review quarter metrics and tactic mix against plan — multiple rubric signals conflict.";
}

function buildRubricRows(context: SimulationContext): SimulationScoreBreakdownDraft[] {
  const rubric = calculateExecutiveScoreRubric(context);

  return RUBRIC_ORDER.map((key) => {
    const score = rubric[key];
    const weightPct = Math.round(EXECUTIVE_RUBRIC_WEIGHTS[key] * 100);
    const weightedContribution = Math.round(score * EXECUTIVE_RUBRIC_WEIGHTS[key]);

    return {
      phase: "rubric",
      category: key,
      score,
      maxScore: 100,
      insight: `${EXECUTIVE_RUBRIC_LABELS[key]} (${weightPct}% weight): ${buildRubricInsight(key, score, context)}`,
      metadata: {
        rubricKey: key,
        rubricLabel: EXECUTIVE_RUBRIC_LABELS[key],
        weight: EXECUTIVE_RUBRIC_WEIGHTS[key],
        weightPercent: weightPct,
        weightedContribution,
      },
    };
  });
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
  const rubricRows = buildRubricRows(context);
  const overallRaw = calculateOverallScore(context);
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
    ...rubricRows,
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
          ? `Weighted executive composite is strong (${overallScore}/100). ${report.growthLeaderTakeaway}`
          : `Weighted executive composite has headroom (${overallScore}/100). ${report.nextMove}`,
      metadata: {
        grade: calculateGrade(overallRaw),
        report,
        rubricVersion: 2,
        rubricWeights: EXECUTIVE_RUBRIC_WEIGHTS,
      },
    },
  ];
}

export function deriveSimulationRecommendations(
  context: SimulationContext,
  scoreBreakdowns: SimulationScoreBreakdownDraft[],
): SimulationRecommendationDraft[] {
  const byPhase = new Map(scoreBreakdowns.map((entry) => [entry.phase, entry]));
  const rubricByKey = new Map(
    scoreBreakdowns.filter((entry) => entry.phase === "rubric").map((entry) => [entry.category, entry]),
  );
  const recommendations: SimulationRecommendationDraft[] = [];

  const setup = byPhase.get("setup");
  const strategy = byPhase.get("strategy");
  const q1 = byPhase.get("Q1");
  const q2 = byPhase.get("Q2");
  const q3 = byPhase.get("Q3");
  const q4 = byPhase.get("Q4");
  const overall = byPhase.get("debrief");

  let priority = 1;
  for (const key of RUBRIC_ORDER) {
    const row = rubricByKey.get(key);
    if (!row || row.score >= 74) continue;

    const label = EXECUTIVE_RUBRIC_LABELS[key];
    const bodyPrefix = `Your ${label.toLowerCase()} ring (${row.score}/100) is below the bar — it's weighted at ${Math.round(EXECUTIVE_RUBRIC_WEIGHTS[key] * 100)}% of the executive composite.`;

    if (key === "growth_quality") {
      recommendations.push({
        priority: priority++,
        title: `Lift ${label}`,
        body: `${bodyPrefix} Accelerate durable revenue momentum (especially late vs early quarters) while protecting satisfaction.`,
        phase: "rubric",
        category: key,
      });
    } else if (key === "efficiency") {
      recommendations.push({
        priority: priority++,
        title: `Improve ${label}`,
        body: `${bodyPrefix} Target stronger profit per dollar deployed and calibrate budget utilization so capital isn't idle or leaking.`,
        phase: "rubric",
        category: key,
      });
    } else if (key === "strategic_coherence") {
      recommendations.push({
        priority: priority++,
        title: `Sharpen ${label}`,
        body: `${bodyPrefix} Align stated audience, positioning, and primary channels with where spend actually flows.`,
        phase: "rubric",
        category: key,
      });
    } else if (key === "resilience") {
      recommendations.push({
        priority: priority++,
        title: `Strengthen ${label}`,
        body: `${bodyPrefix} Reduce fragile quarters (profit swings), respond decisively to shocks, and widen tactical breadth.`,
        phase: "rubric",
        category: key,
      });
    } else {
      recommendations.push({
        priority: priority++,
        title: `Upgrade ${label}`,
        body: `${bodyPrefix} Engineer a stronger Q4 arc — revenue lift vs early quarters, share momentum, and closing sentiment.`,
        phase: "rubric",
        category: key,
      });
    }
  }

  if ((setup?.score ?? 0) < 75) {
    recommendations.push({
      priority: priority++,
      title: "Tighten the operating setup",
      body: "Capture the company profile, scenario choice, and budget posture more deliberately before starting the next run.",
      phase: "setup",
      category: "foundation",
    });
  }

  if ((strategy?.score ?? 0) < 75) {
    recommendations.push({
      priority: priority++,
      title: "Clarify the go-to-market stance",
      body: "Make the audience, positioning, and primary channel mix more explicit so the quarter plan has a sharper edge.",
      phase: "strategy",
      category: "clarity",
    });
  }

  if ((q1?.score ?? 0) < 70) {
    recommendations.push({
      priority: priority++,
      title: "Strengthen the opening quarter",
      body: "Front-load the first quarter with a cleaner launch hypothesis and more visible market signal.",
      phase: "Q1",
      category: "launch",
    });
  }

  if ((q2?.score ?? 0) < 70) {
    recommendations.push({
      priority: priority++,
      title: "Scale with more discipline",
      body: "Use Q2 to grow only what is working and protect the budget from overextension.",
      phase: "Q2",
      category: "scale",
    });
  }

  if ((q3?.score ?? 0) < 70) {
    recommendations.push({
      priority: priority++,
      title: "Rebalance the portfolio sooner",
      body: "Shift some spend away from crowded or weak channels before the endgame pressure rises.",
      phase: "Q3",
      category: "optimization",
    });
  }

  if ((q4?.score ?? 0) < 70) {
    recommendations.push({
      priority: priority++,
      title: "Plan for a stronger finish",
      body: "Reserve enough flexibility for the final quarter so the annual close is more defensible.",
      phase: "Q4",
      category: "finish",
    });
  }

  if ((context.remainingBudget ?? 0) > context.totalBudget * 0.2) {
    recommendations.push({
      priority: priority++,
      title: "Deploy more of the budget",
      body: "A meaningful share of budget is still unused — this usually hurts the efficiency ring of the executive rubric. Push harder on the highest-confidence bets next run.",
      phase: "debrief",
      category: "efficiency",
    });
  }

  if ((overall?.score ?? 0) >= 85) {
    recommendations.push({
      priority: priority++,
      title: "Run a tougher scenario",
      body: "Composite rubric score is strong enough to stress-test harder scenarios without losing diagnostic signal.",
      phase: "debrief",
      category: "stretch",
    });
  }

  return recommendations.slice(0, 6);
}

