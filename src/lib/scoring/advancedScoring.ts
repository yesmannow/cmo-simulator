/**
 * Advanced Scoring System with Multiplicative Models
 * Replaces linear scoring with exponential curves and diminishing returns
 *
 * Priority: P0 (Week 1)
 */

import { ScoringContext } from '../scoringEngine';

export interface AdvancedScoreBreakdown {
  revenueScore: number;
  roiScore: number;
  marketShareScore: number;
  brandEquityScore: number;
  efficiencyScore: number;
  consistencyScore: number;
  strategicScore: number; // NEW: Rewards strategic thinking
  totalScore: number;
  difficultyMultiplier: number;
  industryMultiplier: number;
}

export interface ScoreComponents {
  revenue: { current: number; trend: 'up' | 'down' | 'stable'; projected: number };
  roi: { current: number; trend: 'up' | 'down' | 'stable'; projected: number };
  marketShare: { current: number; trend: 'up' | 'down' | 'stable'; projected: number };
}

/**
 * Calculate advanced score with exponential curves
 */
export function calculateAdvancedScore(
  context: ScoringContext,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  industry: string
): AdvancedScoreBreakdown {
  const totalRevenue = context.quarters.reduce((sum, q) => sum + q.results.revenue, 0);
  const totalProfit = totalRevenue - context.budgetSpent;
  const avgROI = context.budgetSpent > 0 ? (totalProfit / context.budgetSpent) * 100 : 0;
  const finalMarketShare = context.quarters[context.quarters.length - 1]?.results.marketShare || 5;

  // 1. Revenue Score (Exponential curve, cap at 5000)
  // Formula: (revenue/1M)^0.8 * 2000
  // This rewards exceptional revenue exponentially
  const revenueScore = Math.min(
    5000,
    Math.pow(Math.max(totalRevenue / 1000000, 0), 0.8) * 2000
  );

  // 2. ROI Score (Logarithmic curve, cap at 3000)
  // Formula: log10(roi+1) / log10(401) * 3000
  // Diminishing returns - harder to achieve higher ROI
  const roiScore = Math.min(
    3000,
    (Math.log10(Math.max(avgROI, 0) + 1) / Math.log10(401)) * 3000
  );

  // 3. Market Share Score (Exponential growth, cap at 4000)
  // Formula: (marketShare/100)^1.5 * 4000
  // Capturing market share is exponentially harder
  const marketShareScore = Math.min(
    4000,
    Math.pow(Math.max(finalMarketShare / 100, 0), 1.5) * 4000
  );

  // 4. Brand Equity Score (Linear with bonus threshold, cap at 2000)
  // Bonus multiplier if brand equity > 70
  const brandEquityBase = context.brandEquity * 10;
  const brandEquityBonus = context.brandEquity > 70
    ? (context.brandEquity - 70) * 5 // Extra points for strong brand
    : 0;
  const brandEquityScore = Math.min(2000, brandEquityBase + brandEquityBonus);

  // 5. Efficiency Score (Budget utilization, cap at 1500)
  // Rewards efficient budget use (not just spending)
  const budgetUtilization = context.totalBudget > 0
    ? context.budgetSpent / context.totalBudget
    : 0;
  const efficiencyRatio = context.budgetSpent > 0
    ? totalProfit / context.budgetSpent
    : 0;
  const efficiencyScore = Math.min(
    1500,
    (budgetUtilization * 500) + (Math.min(efficiencyRatio, 2) * 500)
  );

  // 6. Consistency Score (Growth streaks, cap at 1500)
  // Rewards consistent quarter-over-quarter growth
  const growthStreak = calculateGrowthStreak(context.quarters);
  const consistencyScore = Math.min(
    1500,
    growthStreak * 375 // 375 points per quarter of growth
  );

  // 7. Strategic Score (NEW - Rewards strategic thinking, cap at 2000)
  // Combines multiple strategic factors
  const strategicScore = calculateStrategicScore(context);

  // Base total (before multipliers)
  const baseTotal = revenueScore + roiScore + marketShareScore +
    brandEquityScore + efficiencyScore + consistencyScore + strategicScore;

  // Apply difficulty multiplier
  const difficultyMultipliers = {
    beginner: 0.8,    // Easier to score high
    intermediate: 1.0, // Baseline
    advanced: 1.3      // Harder to score high, but higher ceiling
  };
  const difficultyMultiplier = difficultyMultipliers[difficulty];

  // Apply industry multiplier (normalize for industry difficulty)
  const industryMultiplier = getIndustryMultiplier(industry);

  // Final score
  const totalScore = Math.round(baseTotal * difficultyMultiplier * industryMultiplier);

  return {
    revenueScore: Math.round(revenueScore),
    roiScore: Math.round(roiScore),
    marketShareScore: Math.round(marketShareScore),
    brandEquityScore: Math.round(brandEquityScore),
    efficiencyScore: Math.round(efficiencyScore),
    consistencyScore: Math.round(consistencyScore),
    strategicScore: Math.round(strategicScore),
    totalScore,
    difficultyMultiplier,
    industryMultiplier
  };
}

/**
 * Calculate growth streak (consecutive quarters with growth)
 */
function calculateGrowthStreak(quarters: ScoringContext['quarters']): number {
  if (quarters.length < 2) return 0;

  let streak = 0;
  let previousRevenue = quarters[0]?.results.revenue || 0;

  for (let i = 1; i < quarters.length; i++) {
    const currentRevenue = quarters[i]?.results.revenue || 0;
    if (currentRevenue > previousRevenue) {
      streak++;
    } else {
      break; // Streak broken
    }
    previousRevenue = currentRevenue;
  }

  return streak;
}

/**
 * Calculate strategic score based on multiple factors
 */
function calculateStrategicScore(context: ScoringContext): number {
  let score = 0;

  // 1. Funnel Balance (25% of strategic score)
  // Rewards balanced allocation across awareness, lead gen, conversion
  const allocation = context.annualAllocation;
  const balanceVariance = calculateVariance([
    allocation.brandAwareness,
    allocation.leadGeneration,
    allocation.conversionOptimization
  ]);
  const balanceScore = Math.max(0, 500 - (balanceVariance * 10)); // Lower variance = higher score
  score += balanceScore * 0.25;

  // 2. Long-term Thinking (25% of strategic score)
  // Rewards brand building and long-term investments
  const brandBuildingScore = context.brandEquity > 70 ? 500 : context.brandEquity * 5;
  score += brandBuildingScore * 0.25;

  // 3. Adaptability (25% of strategic score)
  // Rewards adjusting strategy based on results
  const adaptabilityScore = calculateAdaptabilityScore(context.quarters);
  score += adaptabilityScore * 0.25;

  // 4. Risk Management (25% of strategic score)
  // Rewards managing team morale and avoiding crises
  const riskScore = context.teamMorale > 60 ? 500 : context.teamMorale * 5;
  score += riskScore * 0.25;

  return score;
}

/**
 * Calculate variance of values
 */
function calculateVariance(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Calculate adaptability score based on strategy changes
 */
function calculateAdaptabilityScore(quarters: ScoringContext['quarters']): number {
  if (quarters.length < 2) return 250; // Neutral score if not enough data

  // Measure how much strategy changed quarter-over-quarter
  // More changes = more adaptability (but not too much = chaos)
  let changes = 0;
  for (let i = 1; i < quarters.length; i++) {
    const prevTactics = (quarters[i-1]?.tacticsUsed || []).map(t => t.tacticId).sort();
    const currTactics = (quarters[i]?.tacticsUsed || []).map(t => t.tacticId).sort();
    if (JSON.stringify(prevTactics) !== JSON.stringify(currTactics)) {
      changes++;
    }
  }

  // Optimal: 1-2 changes (shows adaptability without chaos)
  const optimalChanges = 1.5;
  const distanceFromOptimal = Math.abs(changes - optimalChanges);
  return Math.max(0, 500 - (distanceFromOptimal * 100));
}

/**
 * Get industry-specific multiplier for scoring normalization
 */
function getIndustryMultiplier(industry: string): number {
  // Normalize for industry difficulty
  // Healthcare: harder to grow (regulated, high CAC)
  // Legal: moderate difficulty
  // E-commerce: easier to scale (but more competitive)
  const multipliers: Record<string, number> = {
    healthcare: 1.1,  // 10% harder
    legal: 1.0,       // Baseline
    ecommerce: 0.95   // 5% easier (but more competitive)
  };
  return multipliers[industry] || 1.0;
}

/**
 * Calculate score components with trends
 */
export function calculateScoreComponents(
  context: ScoringContext
): ScoreComponents {
  const quarters = context.quarters;

  if (quarters.length < 2) {
    const lastQuarter = quarters[quarters.length - 1];
    return {
      revenue: {
        current: lastQuarter?.results.revenue || 0,
        trend: 'stable',
        projected: lastQuarter?.results.revenue || 0
      },
      roi: {
        current: 0,
        trend: 'stable',
        projected: 0
      },
      marketShare: {
        current: lastQuarter?.results.marketShare || 0,
        trend: 'stable',
        projected: lastQuarter?.results.marketShare || 0
      }
    };
  }

  // Calculate trends
  const recent = quarters.slice(-2);
  const revenueTrend = (recent[1]?.results.revenue || 0) > (recent[0]?.results.revenue || 0)
    ? 'up'
    : (recent[1]?.results.revenue || 0) < (recent[0]?.results.revenue || 0)
    ? 'down'
    : 'stable';

  const marketShareTrend = (recent[1]?.results.marketShare || 0) > (recent[0]?.results.marketShare || 0)
    ? 'up'
    : (recent[1]?.results.marketShare || 0) < (recent[0]?.results.marketShare || 0)
    ? 'down'
    : 'stable';

  // Project values
  const revenueProjected = projectValue(quarters.map(q => q.results.revenue));
  const marketShareProjected = projectValue(quarters.map(q => q.results.marketShare));

  // Calculate ROI
  const totalRevenue = quarters.reduce((sum, q) => sum + q.results.revenue, 0);
  const totalSpent = context.budgetSpent;
  const currentROI = totalSpent > 0 ? ((totalRevenue - totalSpent) / totalSpent) * 100 : 0;

  return {
    revenue: {
      current: recent[1]?.results.revenue || 0,
      trend: revenueTrend,
      projected: revenueProjected
    },
    roi: {
      current: currentROI,
      trend: 'stable', // TODO: Calculate ROI trend
      projected: currentROI
    },
    marketShare: {
      current: recent[1]?.results.marketShare || 0,
      trend: marketShareTrend,
      projected: marketShareProjected
    }
  };
}

/**
 * Project future value based on trend
 */
function projectValue(values: number[]): number {
  if (values.length < 2) return values[0] || 0;
  const trend = values[values.length - 1] - values[values.length - 2];
  return values[values.length - 1] + (trend * 2); // Project 2 quarters ahead
}

