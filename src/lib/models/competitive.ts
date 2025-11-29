/**
 * Dynamic Competitive Response Model
 * Competitors react to your market share gains and spending
 *
 * Priority: P1 (Week 3)
 */

export interface CompetitiveContext {
  yourMarketShare: number;
  yourSpend: number;
  competitorSpend: number;
  marketLandscape: 'disruptor' | 'crowded' | 'frontier';
  yourGrowthRate: number; // Quarter-over-quarter growth
  quarter: number;
  yourBrandEquity: number;
  competitorBrandEquity?: number; // Estimated
}

/**
 * Simulate competitive response based on your actions
 */
export function simulateCompetitiveResponse(
  context: CompetitiveContext
): number {
  const {
    yourMarketShare,
    yourSpend,
    competitorSpend,
    marketLandscape,
    yourGrowthRate,
    quarter,
    yourBrandEquity
  } = context;

  let responseMultiplier = 1.0;

  // 1. Market Share Response
  // Competitors react more aggressively if you're gaining share
  if (yourMarketShare > 10) {
    const shareAboveThreshold = yourMarketShare - 10;
    responseMultiplier += shareAboveThreshold * 0.05; // +5% per % above 10%
  }

  // 2. Spending Response
  // Competitors match your spend increases
  const spendRatio = competitorSpend > 0 ? yourSpend / competitorSpend : 1;
  if (spendRatio > 1.2) {
    // You're outspending by 20%+, competitors respond
    responseMultiplier += (spendRatio - 1.2) * 0.3;
  }

  // 3. Growth Rate Response
  // High growth triggers competitive response
  if (yourGrowthRate > 0.15) { // 15%+ growth
    responseMultiplier += 0.3; // Competitors notice and respond
  }

  // 4. Landscape-Specific Behavior
  switch (marketLandscape) {
    case 'disruptor':
      // Large incumbent aggressively defends
      responseMultiplier *= 1.5;
      break;
    case 'crowded':
      // Multiple competitors, each responds moderately
      responseMultiplier *= 1.2;
      break;
    case 'frontier':
      // New market, less competitive response
      responseMultiplier *= 0.8;
      break;
  }

  // 5. Brand Equity Impact
  // Strong brand makes competitors respond less (harder to compete)
  const brandDefense = 1 - (yourBrandEquity / 100) * 0.2; // Up to 20% reduction
  responseMultiplier *= brandDefense;

  // 6. Learning Curve
  // Competitors learn over time (get smarter)
  const learningCurve = 1 + (quarter * 0.05); // 5% smarter each quarter
  responseMultiplier *= learningCurve;

  // Calculate new competitor spend
  const newCompetitorSpend = competitorSpend * responseMultiplier;

  // Cap at reasonable maximum (competitors have budgets too)
  const maxCompetitorSpend = yourSpend * 10; // Max 10x your spend
  return Math.min(newCompetitorSpend, maxCompetitorSpend);
}

/**
 * Calculate competitive intensity score
 */
export function calculateCompetitiveIntensity(
  yourSpend: number,
  competitorSpend: number,
  marketShare: number
): number {
  // Intensity increases with:
  // 1. High competitor spend relative to yours
  // 2. High market share (more to defend)

  const spendRatio = competitorSpend / Math.max(yourSpend, 1);
  const shareFactor = marketShare / 100;

  // Intensity: 0-100
  const intensity = Math.min(100, (spendRatio * 30) + (shareFactor * 70));

  return intensity;
}

/**
 * Predict competitor actions based on your strategy
 */
export function predictCompetitorActions(
  context: CompetitiveContext
): {
  expectedSpend: number;
  intensity: 'low' | 'medium' | 'high';
  responseTime: number; // Quarters until response
} {
  const expectedSpend = simulateCompetitiveResponse(context);
  const intensity = calculateCompetitiveIntensity(
    context.yourSpend,
    expectedSpend,
    context.yourMarketShare
  );

  let intensityLevel: 'low' | 'medium' | 'high';
  if (intensity < 40) intensityLevel = 'low';
  else if (intensity < 70) intensityLevel = 'medium';
  else intensityLevel = 'high';

  // Response time depends on market landscape
  const responseTime = context.marketLandscape === 'disruptor' ? 0.5 :
    context.marketLandscape === 'crowded' ? 1 : 1.5;

  return {
    expectedSpend,
    intensity: intensityLevel,
    responseTime
  };
}

