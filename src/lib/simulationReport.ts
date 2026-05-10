import type { SimulationContext, Tactic } from '@/lib/simMachine';
import type { SimulationKpiSnapshot, SimulationTeachingGrade } from '@/lib/simulationContracts';
import { buildTeachingReport, calculateGrade, calculateOverallScore, type TeachingReport } from '@/lib/simulationInsights';

export interface SimulationReportUser {
  email: string;
  name?: string;
}

export interface SimulationReportQuarterRow {
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  revenue: number;
  profit: number;
  marketShare: number;
  tactics: string[];
}

export interface SimulationReportDecision {
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  name: string;
  cost: number;
  category: Tactic['category'];
}

export interface SimulationDebriefReport {
  generatedAt: string;
  user?: SimulationReportUser;
  score: number;
  grade: SimulationTeachingGrade;
  finalKpis: SimulationKpiSnapshot;
  summary: TeachingReport;
  quarterRows: SimulationReportQuarterRow[];
  topDecisions: SimulationReportDecision[];
  topRisk: string;
  primaryTradeoff: string;
  nextMove: string;
}

export function buildSimulationDebriefReport(
  context: SimulationContext,
  user?: SimulationReportUser,
): SimulationDebriefReport {
  const score = calculateOverallScore(context);
  const grade = calculateGrade(score);
  const summary = buildTeachingReport(context);
  const quarterKeys: Array<'Q1' | 'Q2' | 'Q3' | 'Q4'> = ['Q1', 'Q2', 'Q3', 'Q4'];
  const quarterRows = quarterKeys.map((quarter) => ({
    quarter,
    revenue: context.quarters[quarter].results.revenue || 0,
    profit: context.quarters[quarter].results.profit || 0,
    marketShare: context.quarters[quarter].results.marketShare || 0,
    tactics: context.quarters[quarter].tactics.map((tactic) => tactic.name),
  }));

  const topDecisions = quarterKeys
    .flatMap((quarter) =>
      context.quarters[quarter].tactics.map((tactic) => ({
        quarter,
        name: tactic.name,
        cost: tactic.cost,
        category: tactic.category,
      })),
    )
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);

  return {
    generatedAt: new Date().toISOString(),
    user,
    score,
    grade,
    finalKpis: {
      revenue: context.kpis.revenue,
      profit: context.kpis.profit,
      marketShare: context.kpis.marketShare,
      customerSatisfaction: context.kpis.customerSatisfaction,
      brandAwareness: context.kpis.brandAwareness,
    },
    summary,
    quarterRows,
    topDecisions,
    topRisk: deriveTopRisk(context),
    primaryTradeoff: summary.tradeoff,
    nextMove: summary.nextMove,
  };
}

function deriveTopRisk(context: SimulationContext) {
  if (context.remainingBudget > context.totalBudget * 0.25) {
    return 'Budget remained under-deployed; the plan may have preserved safety at the expense of growth signal.';
  }

  if (context.kpis.customerSatisfaction < 65) {
    return 'Trust and satisfaction ended weak, which will make future paid efficiency harder to sustain.';
  }

  if (context.kpis.marketShare < 15) {
    return 'Competitive position stayed narrow; stronger share capture is needed before efficiency gains compound.';
  }

  const allTactics = ['Q1', 'Q2', 'Q3', 'Q4'].flatMap((quarter) =>
    context.quarters[quarter as 'Q1' | 'Q2' | 'Q3' | 'Q4'].tactics,
  );
  const categoryTotals = allTactics.reduce<Record<string, number>>((totals, tactic) => {
    totals[tactic.category] = (totals[tactic.category] || 0) + tactic.cost;
    return totals;
  }, {});
  const totalSpend = Object.values(categoryTotals).reduce((sum, value) => sum + value, 0);
  const largestCategory = Object.values(categoryTotals).sort((a, b) => b - a)[0] ?? 0;
  if (totalSpend > 0 && largestCategory / totalSpend > 0.55) {
    return 'Spend concentrated heavily in one tactic family, increasing saturation and execution risk.';
  }

  return 'No major structural risk dominated the run; the next replay should focus on tightening tradeoffs rather than correcting a collapse.';
}
