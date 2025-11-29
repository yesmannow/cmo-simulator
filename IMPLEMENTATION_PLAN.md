# CMO Simulator: Implementation Plan for Scoring Improvements

## Phase 1: Core Scoring Enhancements (Week 1-2)

### 1.1 Multiplicative Scoring System

**File**: `src/lib/scoring/advancedScoring.ts` (NEW)

```typescript
/**
 * Advanced Scoring System with Multiplicative Models
 * Replaces linear scoring with exponential curves and diminishing returns
 */

import { ScoringContext, FinalScore } from '../scoringEngine';

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
  const avgROI = (totalProfit / context.budgetSpent) * 100;
  const finalMarketShare = context.quarters[context.quarters.length - 1]?.results.marketShare || 5;

  // 1. Revenue Score (Exponential curve, cap at 5000)
  // Formula: (revenue/1M)^0.8 * 2000
  // This rewards exceptional revenue exponentially
  const revenueScore = Math.min(
    5000,
    Math.pow(totalRevenue / 1000000, 0.8) * 2000
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
    Math.pow(finalMarketShare / 100, 1.5) * 4000
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
  const budgetUtilization = context.budgetSpent / context.totalBudget;
  const efficiencyRatio = totalProfit / context.budgetSpent;
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
function calculateGrowthStreak(quarters: any[]): number {
  let streak = 0;
  let previousRevenue = 0;

  for (const quarter of quarters) {
    if (quarter.results.revenue > previousRevenue) {
      streak++;
    } else {
      break; // Streak broken
    }
    previousRevenue = quarter.results.revenue;
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

function calculateVariance(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

function calculateAdaptabilityScore(quarters: any[]): number {
  // Measure how much strategy changed quarter-over-quarter
  // More changes = more adaptability (but not too much = chaos)
  let changes = 0;
  for (let i = 1; i < quarters.length; i++) {
    const prevTactics = quarters[i-1].tacticsUsed.map((t: any) => t.tacticId).sort();
    const currTactics = quarters[i].tacticsUsed.map((t: any) => t.tacticId).sort();
    if (JSON.stringify(prevTactics) !== JSON.stringify(currTactics)) {
      changes++;
    }
  }
  // Optimal: 1-2 changes (shows adaptability without chaos)
  const optimalChanges = 1.5;
  const distanceFromOptimal = Math.abs(changes - optimalChanges);
  return Math.max(0, 500 - (distanceFromOptimal * 100));
}

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
```

### 1.2 Enhanced Market Share Model

**File**: `src/lib/models/marketShare.ts` (NEW)

```typescript
/**
 * Advanced Market Share Model using Bass Diffusion
 * More realistic than simple share-of-voice
 */

export interface MarketShareContext {
  currentShare: number;
  yourSpend: number;
  competitorSpend: number;
  brandEquity: number;
  marketMaturity: number; // 0-1, how mature is the market
  quartersElapsed: number;
  previousShares: number[]; // Historical shares for trend
}

/**
 * Calculate market share using Bass Diffusion Model
 * Models how innovations (new products/marketing) diffuse through market
 */
export function calculateMarketShareBass(
  context: MarketShareContext
): number {
  const {
    currentShare,
    yourSpend,
    competitorSpend,
    brandEquity,
    marketMaturity,
    quartersElapsed
  } = context;

  // Innovation coefficient (p) - early adopters
  // Higher brand equity = more innovation adoption
  const innovationCoeff = 0.03 * (brandEquity / 100);

  // Imitation coefficient (q) - word of mouth
  // Higher current share = more word of mouth
  const imitationCoeff = 0.38 * (currentShare / 100);

  // Market potential (m) - total addressable market
  const marketPotential = 100 - currentShare;

  // Bass model: F(t) = (1 - e^(-(p+q)*t)) / (1 + (q/p) * e^(-(p+q)*t))
  const timeFactor = Math.min(4, quartersElapsed); // 4 quarters = 1 year
  const pPlusQ = innovationCoeff + imitationCoeff;
  const bassFactor = (1 - Math.exp(-pPlusQ * timeFactor)) /
    (1 + (imitationCoeff / Math.max(innovationCoeff, 0.001)) * Math.exp(-pPlusQ * timeFactor));

  // Share of voice influence
  const totalSpend = yourSpend + competitorSpend;
  const shareOfVoice = totalSpend > 0 ? yourSpend / totalSpend : 0.5;
  const voiceMultiplier = 0.3 + (shareOfVoice * 0.7); // 30% base + 70% from voice

  // Brand equity multiplier
  // Strong brands get more bang for buck
  const brandMultiplier = 0.7 + (brandEquity / 100) * 0.6; // 0.7x to 1.3x

  // Market maturity penalty (harder to grow in mature markets)
  const maturityPenalty = 1 - (marketMaturity * 0.3);

  // Competitive response penalty
  // If competitors are spending aggressively, growth is harder
  const competitiveRatio = competitorSpend / Math.max(yourSpend, 1);
  const competitivePenalty = competitiveRatio > 2 ? 0.8 : 1.0;

  // Calculate new share
  const growthAmount = marketPotential * bassFactor * voiceMultiplier *
    brandMultiplier * maturityPenalty * competitivePenalty * 0.1;

  const newShare = currentShare + growthAmount;

  // Apply inertia (market share doesn't change instantly)
  const inertia = 0.3; // 30% of previous share persists
  const finalShare = (currentShare * inertia) + (newShare * (1 - inertia));

  return Math.min(Math.max(finalShare, 0), 100);
}

/**
 * Calculate market maturity based on total market spend
 */
export function calculateMarketMaturity(
  totalMarketSpend: number,
  marketSize: number
): number {
  // Maturity increases as market spend approaches market capacity
  const saturationRatio = totalMarketSpend / marketSize;

  // Sigmoid curve for maturity (0 to 1)
  return 1 / (1 + Math.exp(-5 * (saturationRatio - 0.5)));
}
```

### 1.3 Advanced ROI Calculation

**File**: `src/lib/models/roi.ts` (NEW)

```typescript
/**
 * Advanced ROI Calculation with Customer Lifetime Value
 * Accounts for long-term value, not just immediate revenue
 */

export interface ROIContext {
  immediateRevenue: number;
  spend: number;
  customerAcquisitions: number;
  avgCLV: number; // Average Customer Lifetime Value
  retentionRate: number; // 0-1, customer retention rate
  brandEquity: number; // 0-100
  industry: string;
}

/**
 * Calculate ROI with Customer Lifetime Value
 */
export function calculateAdvancedROI(context: ROIContext): {
  immediateROI: number;
  longTermROI: number;
  weightedROI: number;
  clvMultiplier: number;
} {
  const {
    immediateRevenue,
    spend,
    customerAcquisitions,
    avgCLV,
    retentionRate,
    brandEquity,
    industry
  } = context;

  // Immediate ROI
  const immediateROI = spend > 0
    ? ((immediateRevenue - spend) / spend) * 100
    : 0;

  // Long-term value from acquired customers
  // CLV = avgCLV * retentionRate
  const baseCLV = avgCLV * retentionRate;

  // Brand equity adds to CLV (stronger brand = higher retention)
  const brandCLVMultiplier = 1 + (brandEquity / 100) * 0.3; // Up to 30% boost
  const adjustedCLV = baseCLV * brandCLVMultiplier;

  // Total CLV value
  const totalCLVValue = customerAcquisitions * adjustedCLV;

  // Long-term ROI
  const longTermROI = spend > 0
    ? ((totalCLVValue - spend) / spend) * 100
    : 0;

  // Weighted ROI: 40% immediate, 60% long-term
  // This rewards long-term thinking
  const weightedROI = (immediateROI * 0.4) + (longTermROI * 0.6);

  return {
    immediateROI: Math.round(immediateROI * 100) / 100,
    longTermROI: Math.round(longTermROI * 100) / 100,
    weightedROI: Math.round(weightedROI * 100) / 100,
    clvMultiplier: brandCLVMultiplier
  };
}

/**
 * Get industry-specific CLV benchmarks
 */
export function getIndustryCLV(industry: string): {
  avgCLV: number;
  retentionRate: number;
} {
  const benchmarks: Record<string, { avgCLV: number; retentionRate: number }> = {
    healthcare: { avgCLV: 15000, retentionRate: 0.85 }, // High value, high retention
    legal: { avgCLV: 25000, retentionRate: 0.80 },        // Very high value
    ecommerce: { avgCLV: 450, retentionRate: 0.60 },    // Lower value, lower retention
    saas: { avgCLV: 5000, retentionRate: 0.75 },         // Moderate value, good retention
    fintech: { avgCLV: 2000, retentionRate: 0.70 }       // Moderate value
  };

  return benchmarks[industry] || { avgCLV: 1000, retentionRate: 0.65 };
}
```

### 1.4 Competitive Response Model

**File**: `src/lib/models/competitive.ts` (NEW)

```typescript
/**
 * Dynamic Competitive Response Model
 * Competitors react to your market share gains and spending
 */

export interface CompetitiveContext {
  yourMarketShare: number;
  yourSpend: number;
  competitorSpend: number;
  marketLandscape: 'disruptor' | 'crowded' | 'frontier';
  yourGrowthRate: number; // Quarter-over-quarter growth
  quarter: number;
  yourBrandEquity: number;
  competitorBrandEquity: number; // Estimated
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
```

---

## Phase 2: Integration & Testing (Week 3-4)

### 2.1 Update Scoring Engine Integration

**File**: `src/lib/scoringEngine.ts` (MODIFY)

Add new functions and update `calculateFinalScore`:

```typescript
// Add imports
import { calculateAdvancedScore } from './scoring/advancedScoring';
import { calculateMarketShareBass } from './models/marketShare';
import { calculateAdvancedROI } from './models/roi';
import { simulateCompetitiveResponse } from './models/competitive';

// Update calculateFinalScore to use new models
export function calculateFinalScore(
  context: ScoringContext,
  difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate',
  useAdvancedScoring: boolean = true
): FinalScore {
  if (useAdvancedScoring) {
    // Use new advanced scoring
    const advancedScore = calculateAdvancedScore(
      context,
      difficulty,
      context.industry
    );

    // Use Bass model for market share
    const finalMarketShare = calculateMarketShareBass({
      currentShare: context.quarters[context.quarters.length - 1]?.results.marketShare || 5,
      yourSpend: context.budgetSpent / 4,
      competitorSpend: context.competitorSpend / 4,
      brandEquity: context.brandEquity,
      marketMaturity: context.marketSaturation,
      quartersElapsed: context.quarters.length,
      previousShares: context.quarters.map(q => q.results.marketShare)
    });

    // Use advanced ROI
    const totalRevenue = context.quarters.reduce((sum, q) => sum + q.results.revenue, 0);
    const customerAcquisitions = context.quarters.reduce((sum, q) => sum + (q.results.revenue / 5000), 0); // Estimate
    const industryCLV = getIndustryCLV(context.industry);

    const roiResult = calculateAdvancedROI({
      immediateRevenue: totalRevenue,
      spend: context.budgetSpent,
      customerAcquisitions,
      avgCLV: industryCLV.avgCLV,
      retentionRate: industryCLV.retentionRate,
      brandEquity: context.brandEquity,
      industry: context.industry
    });

    // Determine grade
    let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
    if (advancedScore.totalScore >= 12000) grade = 'A+';
    else if (advancedScore.totalScore >= 9000) grade = 'A';
    else if (advancedScore.totalScore >= 6000) grade = 'B';
    else if (advancedScore.totalScore >= 3000) grade = 'C';
    else if (advancedScore.totalScore >= 1500) grade = 'D';
    else grade = 'F';

    return {
      strategyScore: advancedScore.totalScore,
      breakdown: {
        marketShareScore: advancedScore.marketShareScore,
        roiScore: advancedScore.roiScore,
        brandEquityScore: advancedScore.brandEquityScore
      },
      grade,
      percentile: 0, // Calculate from leaderboard
      finalKPIs: {
        revenue: totalRevenue,
        profit: totalRevenue - context.budgetSpent,
        marketShare: finalMarketShare,
        customerSatisfaction: 75, // Calculate from tactics
        brandAwareness: context.brandEquity,
        roi: roiResult.weightedROI
      },
      strengths: generateStrengths(advancedScore, roiResult),
      weaknesses: generateWeaknesses(advancedScore, roiResult),
      recommendations: generateRecommendations(advancedScore, context)
    };
  } else {
    // Fallback to original scoring
    // ... existing code ...
  }
}
```

---

## Phase 3: Real-Time Tracking (Week 4)

### 3.1 Score Tracker

**File**: `src/lib/scoring/scoreTracker.ts` (NEW)

```typescript
/**
 * Real-Time Score Tracking
 * Provides live score updates and projections
 */

import { SimulationState } from '../simulationEngine';
import { calculateAdvancedScore } from './advancedScoring';

export interface ScoreTracker {
  currentScore: number;
  projectedScore: number;
  scoreVelocity: number; // Rate of change
  scoreComponents: {
    revenue: { current: number; trend: 'up' | 'down' | 'stable'; projected: number };
    roi: { current: number; trend: 'up' | 'down' | 'stable'; projected: number };
    marketShare: { current: number; trend: 'up' | 'down' | 'stable'; projected: number };
  };
  percentile: number;
  rank: string;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  name: string;
  target: number;
  current: number;
  progress: number; // 0-100
  reward: string;
}

export function createScoreTracker(
  state: SimulationState,
  historicalScores: number[]
): ScoreTracker {
  // Calculate current score
  const currentScore = calculateCurrentScore(state);

  // Calculate trend
  const trend = calculateTrend(historicalScores);

  // Project future score
  const remainingQuarters = 4 - state.quarterlyResults.length;
  const projectedScore = currentScore + (trend * remainingQuarters);

  // Calculate velocity
  const scoreVelocity = calculateVelocity(historicalScores);

  // Get component trends
  const componentTrends = calculateComponentTrends(state);

  // Calculate percentile (requires leaderboard data)
  const percentile = calculatePercentile(currentScore);

  // Get rank
  const rank = getRank(currentScore);

  // Check milestones
  const milestones = checkMilestones(state, currentScore);

  return {
    currentScore,
    projectedScore,
    scoreVelocity,
    scoreComponents: componentTrends,
    percentile,
    rank,
    milestones
  };
}

function calculateCurrentScore(state: SimulationState): number {
  // Use advanced scoring if available
  const context = convertToScoringContext(state);
  const score = calculateAdvancedScore(
    context,
    state.config.difficulty,
    state.config.industry
  );
  return score.totalScore;
}

function calculateTrend(scores: number[]): number {
  if (scores.length < 2) return 0;

  // Linear regression to find trend
  const n = scores.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = scores.reduce((a, b) => a + b, 0);
  const sumXY = scores.reduce((sum, y, x) => sum + x * y, 0);
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  return slope;
}

function calculateVelocity(scores: number[]): number {
  if (scores.length < 2) return 0;
  const recent = scores.slice(-2);
  return recent[1] - recent[0];
}

function calculateComponentTrends(state: SimulationState) {
  // Analyze quarter-over-quarter changes
  const quarters = state.quarterlyResults;

  if (quarters.length < 2) {
    return {
      revenue: { current: 0, trend: 'stable' as const, projected: 0 },
      roi: { current: 0, trend: 'stable' as const, projected: 0 },
      marketShare: { current: 0, trend: 'stable' as const, projected: 0 }
    };
  }

  const recent = quarters.slice(-2);
  const revenueTrend = recent[1].results.revenue > recent[0].results.revenue ? 'up' :
    recent[1].results.revenue < recent[0].results.revenue ? 'down' : 'stable';

  // Similar for ROI and market share
  // ...

  return {
    revenue: {
      current: recent[1].results.revenue,
      trend: revenueTrend,
      projected: projectValue(recent.map(q => q.results.revenue))
    },
    roi: { current: 0, trend: 'stable' as const, projected: 0 },
    marketShare: { current: 0, trend: 'stable' as const, projected: 0 }
  };
}

function projectValue(values: number[]): number {
  if (values.length < 2) return values[0] || 0;
  const trend = values[values.length - 1] - values[values.length - 2];
  return values[values.length - 1] + (trend * 2); // Project 2 quarters ahead
}

function calculatePercentile(score: number): number {
  // This would query leaderboard data
  // For now, return placeholder
  return 50;
}

function getRank(score: number): string {
  if (score >= 12000) return 'Legendary CMO';
  if (score >= 9000) return 'Master Marketer';
  if (score >= 6000) return 'Expert Strategist';
  if (score >= 3000) return 'Senior CMO';
  if (score >= 1500) return 'Marketing Manager';
  return 'Marketing Specialist';
}

function checkMilestones(state: SimulationState, currentScore: number): Milestone[] {
  const milestones: Milestone[] = [];

  // Revenue milestones
  const totalRevenue = state.totalRevenue;
  if (totalRevenue < 1000000) {
    milestones.push({
      id: 'first_million',
      name: 'First Million',
      target: 1000000,
      current: totalRevenue,
      progress: (totalRevenue / 1000000) * 100,
      reward: '+500 points'
    });
  }

  // Score milestones
  if (currentScore < 5000) {
    milestones.push({
      id: 'score_5k',
      name: '5K Score',
      target: 5000,
      current: currentScore,
      progress: (currentScore / 5000) * 100,
      reward: 'Achievement Unlocked'
    });
  }

  return milestones;
}

function convertToScoringContext(state: SimulationState): any {
  // Convert SimulationState to ScoringContext
  // Implementation depends on exact structure
  return {
    // ... conversion logic
  };
}
```

---

## Testing Strategy

### Unit Tests

```typescript
// src/lib/scoring/__tests__/advancedScoring.test.ts

import { calculateAdvancedScore } from '../advancedScoring';

describe('Advanced Scoring', () => {
  it('should calculate exponential revenue score', () => {
    const context = createMockContext({ totalRevenue: 2000000 });
    const score = calculateAdvancedScore(context, 'intermediate', 'healthcare');

    // $2M revenue should score higher than linear (which would be 200)
    expect(score.revenueScore).toBeGreaterThan(200);
  });

  it('should apply difficulty multiplier', () => {
    const context = createMockContext();
    const beginner = calculateAdvancedScore(context, 'beginner', 'healthcare');
    const advanced = calculateAdvancedScore(context, 'advanced', 'healthcare');

    // Advanced should be harder (lower score for same performance)
    expect(advanced.totalScore).toBeLessThan(beginner.totalScore * 1.3);
  });

  it('should reward strategic thinking', () => {
    const balancedContext = createMockContext({
      allocation: { brandAwareness: 33, leadGeneration: 33, conversionOptimization: 34 }
    });
    const unbalancedContext = createMockContext({
      allocation: { brandAwareness: 80, leadGeneration: 10, conversionOptimization: 10 }
    });

    const balanced = calculateAdvancedScore(balancedContext, 'intermediate', 'healthcare');
    const unbalanced = calculateAdvancedScore(unbalancedContext, 'intermediate', 'healthcare');

    // Balanced should score higher
    expect(balanced.strategicScore).toBeGreaterThan(unbalanced.strategicScore);
  });
});
```

---

## Migration Plan

1. **Week 1**: Implement new scoring files alongside existing ones
2. **Week 2**: Add feature flag to toggle between old/new scoring
3. **Week 3**: Test with beta users, gather feedback
4. **Week 4**: Gradual rollout (10% → 50% → 100%)
5. **Week 5**: Deprecate old scoring system

---

*This implementation plan should be executed incrementally, with thorough testing at each phase.*

