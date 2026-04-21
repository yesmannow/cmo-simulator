import type { SimulationContext } from "@/lib/simMachine";

export interface TeachingReport {
  outcome: string;
  why: string;
  tradeoff: string;
  nextMove: string;
  growthLeaderTakeaway: string;
}

export function calculateOverallScore(context: SimulationContext): number {
  const quarters = [context.quarters.Q1, context.quarters.Q2, context.quarters.Q3, context.quarters.Q4];
  const totalRevenue = quarters.reduce((sum, quarter) => sum + (quarter.results.revenue || 0), 0);
  const finalMarketShare = context.quarters.Q4.results.marketShare || 0;

  return Math.round((totalRevenue / 2000000) * 50 + finalMarketShare * 2);
}

export function calculateGrade(score: number): "A+" | "A" | "B" | "C" | "D" | "F" {
  if (score >= 95) return "A+";
  if (score >= 85) return "A";
  if (score >= 75) return "B";
  if (score >= 65) return "C";
  if (score >= 50) return "D";
  return "F";
}

export function buildTeachingReport(context: SimulationContext): TeachingReport {
  const quarters = [context.quarters.Q1, context.quarters.Q2, context.quarters.Q3, context.quarters.Q4];
  const totalRevenue = quarters.reduce((sum, quarter) => sum + (quarter.results.revenue || 0), 0);
  const totalProfit = quarters.reduce((sum, quarter) => sum + (quarter.results.profit || 0), 0);
  const finalShare = context.quarters.Q4.results.marketShare || 0;

  const strongestQuarter = quarters
    .map((quarter, index) => ({ quarter: `Q${index + 1}`, revenue: quarter.results.revenue || 0 }))
    .sort((a, b) => b.revenue - a.revenue)[0];

  const mostTacticsQuarter = quarters
    .map((quarter, index) => ({ quarter: `Q${index + 1}`, tactics: quarter.tactics.length }))
    .sort((a, b) => b.tactics - a.tactics)[0];

  const outcome = `Finished with ${finalShare.toFixed(1)}% market share, $${Math.round(totalRevenue).toLocaleString()} revenue, and $${Math.round(totalProfit).toLocaleString()} profit.`;
  const why = `The strongest revenue contribution came in ${strongestQuarter.quarter}, with tactical volume peaking in ${mostTacticsQuarter.quarter}. Momentum was driven by sustained channel deployment rather than a single quarter spike.`;
  const tradeoff = `Resource concentration improved execution depth but increased exposure to saturation and wildcard volatility. Board pressure balance (CEO/CFO/CMO) became the limiting factor in late quarters.`;
  const nextMove = `Run a replay with one deliberate portfolio shift: preserve your top-performing channel, reallocate 15-20% of spend to under-used channels, and compare market-share delta vs. ROI stability.`;
  const growthLeaderTakeaway = `Use this simulation like a planning lab: tie budget decisions to explicit hypotheses, then evaluate whether growth came from durable system improvements or short-term efficiency bursts.`;

  return { outcome, why, tradeoff, nextMove, growthLeaderTakeaway };
}

