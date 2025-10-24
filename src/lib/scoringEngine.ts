/**
 * Advanced Scoring Engine for CMO Simulator
 * 
 * This engine implements complex, realistic calculations with:
 * - Hidden metrics (Brand Equity, Team Morale)
 * - Compounding effects (SEO grows exponentially)
 * - Diminishing returns (paid ads saturate)
 * - Share of Voice model for market share
 * - Strategic scoring that rewards multiple paths to success
 */

export interface ScoringContext {
  // Strategic Foundation
  timeHorizon: '1-year' | '3-year' | '5-year';
  industry: 'healthcare' | 'legal' | 'ecommerce';
  companyProfile: 'startup' | 'enterprise';
  marketLandscape: 'disruptor' | 'crowded' | 'frontier';

  // Budget & Spend
  totalBudget: number;
  budgetSpent: number;
  annualAllocation: {
    brandAwareness: number; // Top of funnel % (influences adstock decay)
    leadGeneration: number; // Mid funnel %
    conversionOptimization: number; // Bottom funnel %
  };

  // Hidden Metrics (not directly visible to player)
  brandEquity: number; // 0-100, decays over time, boosts conversions
  teamMorale: number; // 0-100, affects all campaign effectiveness

  // Quarterly Performance
  quarters: QuarterPerformance[];

  // Competitive Environment
  competitorSpend: number; // Simulated competitor spending
  marketSaturation: number; // 0-1, affects ad effectiveness

  // Adstock History (NEW: for carryover effects)
  adstockHistory?: AdstockHistory;
}

export interface QuarterPerformance {
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  tacticsUsed: TacticUsage[];
  wildcardResponse?: WildcardResponse;
  talentHired?: TalentHire[];
  bigBet?: BigBetExecution;
  
  // Spend & Time
  budgetSpent: number;
  teamHoursUsed: number;
  timeSpent: number;
  
  // Results
  results: {
    revenue: number;
    profit: number;
    marketShare: number;
    customerSatisfaction: number;
    brandAwareness: number;
  };
  trafficSources: {
    organic: number;
    paid: number;
    social: number;
    referral: number;
  };
}

export interface TacticUsage {
  tacticId: string;
  category: 'seo' | 'paid-ads' | 'content' | 'social' | 'events' | 'pr';
  spend: number;
  timeInvested: number;
  isRecurring: boolean; // SEO/Content compounds over time
}

export interface WildcardResponse {
  eventType: 'competitive' | 'market-shift' | 'internal-crisis' | 'opportunity';
  responseChosen: string;
  costIncurred: number;
  moraleImpact: number;
  brandEquityImpact: number;
}

export interface TalentHire {
  role: string;
  salary: number;
  skillBonus: number; // Multiplier for certain tactics
  moraleBoost: number;
}

export interface BigBetExecution {
  type: string;
  investment: number;
  riskLevel: 'low' | 'medium' | 'high';
  actualReturn: number;
  successRate: number;
}

export interface FinalScore {
  strategyScore: number; // 0-10000, the main leaderboard metric
  breakdown: {
    marketShareScore: number; // (Final Market Share * 1000)
    roiScore: number; // (Overall ROI * 100)
    brandEquityScore: number; // (Final Brand Equity * 10)
  };
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  percentile: number;
  
  // Final KPIs
  finalKPIs: {
    revenue: number;
    profit: number;
    marketShare: number; // 0-100%
    customerSatisfaction: number;
    brandAwareness: number;
    roi: number; // Return on Investment %
  };
  
  // Strategic Insights
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface SimulationDebrief {
  simulationId: string;
  finalScore: number;
  grade: string;
  percentile: number;
  insights: string[];
}

// ============================================================================
// ADSTOCK MODELING (Advanced Marketing Mix Modeling)
// ============================================================================

export interface AdstockConfig {
  channel: 'digital' | 'content' | 'events' | 'partnerships' | 'traditional' | 'social' | 'pr';
  decayRate: number;        // How quickly effect diminishes (0.1-0.9, lower = longer carryover)
  peakDelay: number;        // Quarters until peak effect (0-4)
  saturationPoint: number;  // Point of diminishing returns ($ amount)
  baseEfficiency: number;   // Base traffic per dollar spent
}

export interface AdstockHistory {
  quarters: {
    [quarter: string]: {
      [channel: string]: {
        spend: number;
        carryoverEffect: number;
        totalEffect: number;
      };
    };
  };
}

// Adstock configurations based on marketing research
const ADSTOCK_CONFIGS: Record<string, AdstockConfig> = {
  digital: {
    channel: 'digital',
    decayRate: 0.7,      // Quick decay - ads forgettable
    peakDelay: 0,        // Immediate effect
    saturationPoint: 100000,
    baseEfficiency: 5    // $1 = 5 visitors
  },
  content: {
    channel: 'content',
    decayRate: 0.2,      // Long carryover - content evergreen
    peakDelay: 1,        // Takes time to gain traction
    saturationPoint: 200000,
    baseEfficiency: 10   // $1 = 10 visitors (SEO/content)
  },
  events: {
    channel: 'events',
    decayRate: 0.5,      // Moderate carryover
    peakDelay: 0,        // Immediate buzz
    saturationPoint: 150000,
    baseEfficiency: 8    // $1 = 8 visitors
  },
  partnerships: {
    channel: 'partnerships',
    decayRate: 0.3,      // Long carryover - relationships
    peakDelay: 1,        // Takes time to activate
    saturationPoint: 200000,
    baseEfficiency: 12   // $1 = 12 visitors (leveraged)
  },
  traditional: {
    channel: 'traditional',
    decayRate: 0.1,      // Very long carryover - TV/radio/print
    peakDelay: 2,        // Takes time to build awareness
    saturationPoint: 300000,
    baseEfficiency: 3    // $1 = 3 visitors (broad but inefficient)
  },
  social: {
    channel: 'social',
    decayRate: 0.6,      // Moderate decay
    peakDelay: 0,        // Immediate engagement
    saturationPoint: 80000,
    baseEfficiency: 6    // $1 = 6 visitors
  },
  pr: {
    channel: 'pr',
    decayRate: 0.4,      // Moderate carryover
    peakDelay: 1,        // Takes time for stories to develop
    saturationPoint: 100000,
    baseEfficiency: 4    // $1 = 4 visitors (earned media)
  }
};

/**
 * Calculate adstock effect for a channel
 * Research-based carryover modeling
 */
export function calculateAdstockEffect(
  currentSpend: number,
  historicalSpends: number[],
  config: AdstockConfig,
  marketSaturation: number
): number {
  let totalEffect = 0;

  // Current period effect (with saturation)
  const saturationMultiplier = calculateSaturationMultiplier(currentSpend, config.saturationPoint);
  const immediateEffect = currentSpend * config.baseEfficiency * saturationMultiplier;
  totalEffect += immediateEffect;

  // Carryover effects from previous periods
  historicalSpends.forEach((pastSpend, periodsAgo) => {
    const periodsSinceSpend = periodsAgo + 1;

    // Apply decay rate (geometric decay)
    const decayMultiplier = Math.pow(config.decayRate, periodsSinceSpend);

    // Apply peak delay (effect builds to peak)
    const peakMultiplier = periodsSinceSpend >= config.peakDelay
      ? 1.0
      : periodsSinceSpend / Math.max(config.peakDelay, 1);

    const carryoverEffect = pastSpend * config.baseEfficiency * decayMultiplier * peakMultiplier;

    // Historical spend also subject to saturation (past market conditions)
    const historicalSaturation = marketSaturation * 0.8; // Slightly less saturated in past
    const historicalSaturationMultiplier = calculateSaturationMultiplier(pastSpend, config.saturationPoint);

    totalEffect += carryoverEffect * historicalSaturationMultiplier;
  });

  return totalEffect;
}

/**
 * Calculate saturation multiplier using Hill function
 * Research-based diminishing returns curve
 */
function calculateSaturationMultiplier(spend: number, saturationPoint: number): number {
  // Hill function: S-shaped curve for diminishing returns
  // As spend approaches saturation point, returns diminish
  const k = saturationPoint / 2; // Half-saturation point
  const n = 2; // Hill coefficient (steepness)

  return Math.pow(spend, n) / (Math.pow(k, n) + Math.pow(spend, n));
}

/**
 * Update adstock history with new quarterly data
 */
export function updateAdstockHistory(
  history: AdstockHistory | undefined,
  quarter: string,
  channelSpends: Record<string, number>
): AdstockHistory {
  const newHistory: AdstockHistory = history ? { ...history } : { quarters: {} };

  if (!newHistory.quarters[quarter]) {
    newHistory.quarters[quarter] = {};
  }

  // Calculate effects for each channel
  Object.entries(channelSpends).forEach(([channel, currentSpend]) => {
    const config = ADSTOCK_CONFIGS[channel];
    if (!config) return;

    // Get historical spends for this channel (last 4 quarters)
    const historicalSpends: number[] = [];
    const quarters = Object.keys(newHistory.quarters).sort();

    // Look back up to 4 quarters for carryover effects
    for (let i = Math.max(0, quarters.length - 4); i < quarters.length; i++) {
      const q = quarters[i];
      if (newHistory.quarters[q][channel]) {
        historicalSpends.push(newHistory.quarters[q][channel].spend);
      }
    }

    // Calculate total effect (immediate + carryover)
    const totalEffect = calculateAdstockEffect(currentSpend, historicalSpends, config, 0.3); // Assume 30% market saturation

    newHistory.quarters[quarter][channel] = {
      spend: currentSpend,
      carryoverEffect: totalEffect - (currentSpend * config.baseEfficiency * calculateSaturationMultiplier(currentSpend, config.saturationPoint)),
      totalEffect
    };
  });

  return newHistory;
}

/**
 * Get total traffic from adstock effects
 */
export function getTotalAdstockTraffic(history: AdstockHistory | undefined, currentQuarter: string): number {
  if (!history?.quarters[currentQuarter]) return 0;

  return Object.values(history.quarters[currentQuarter])
    .reduce((sum, channel) => sum + channel.totalEffect, 0);
}

/**
 * Calculate Market Share using Share of Voice model
 * Your spend vs. total market spend determines your share
 */
export function calculateMarketShare(
  yourSpend: number,
  competitorSpend: number,
  previousMarketShare: number,
  brandEquity: number
): number {
  const totalMarketSpend = yourSpend + competitorSpend;
  const shareOfVoice = yourSpend / totalMarketSpend;
  
  // Brand equity provides a multiplier (strong brands get more bang for buck)
  const brandMultiplier = 1 + (brandEquity / 200); // 0.5 to 1.5x
  
  // Market share moves toward share of voice, but with inertia
  const targetShare = shareOfVoice * brandMultiplier * 100;
  const inertia = 0.3; // 30% of previous share persists
  
  const newShare = (previousMarketShare * inertia) + (targetShare * (1 - inertia));
  
  return Math.min(Math.max(newShare, 0), 100); // Clamp between 0-100%
}

/**
 * Calculate SEO/Content effectiveness with compounding growth
 * SEO investments grow exponentially over time
 */
export function calculateSEOImpact(
  quarterlyInvestments: number[],
  currentQuarter: number,
  industryFactor: number = 1.0
): number {
  let cumulativeTraffic = 0;
  
  quarterlyInvestments.forEach((investment, index) => {
    const quartersActive = currentQuarter - index;
    
    if (quartersActive >= 0) {
      // Base traffic from investment
      const baseTraffic = investment * 0.5; // $1 = 0.5 visitors initially
      
      // Compound growth: 15% per quarter
      const growthRate = 0.15;
      const compoundedTraffic = baseTraffic * Math.pow(1 + growthRate, quartersActive);
      
      cumulativeTraffic += compoundedTraffic;
    }
  });
  
  return cumulativeTraffic * industryFactor;
}

/**
 * Calculate Paid Ads effectiveness with diminishing returns
 * As you spend more, each dollar becomes less effective (market saturation)
 */
export function calculatePaidAdsImpact(
  spend: number,
  marketSaturation: number,
  competitorActivity: number
): { traffic: number; cost: number; effectiveness: number } {
  // Base cost per click increases with competition
  const baseCPC = 2.0 + (competitorActivity * 0.5);
  
  // Diminishing returns curve: effectiveness drops as spend increases
  // Using logarithmic decay
  const saturationPenalty = 1 - (marketSaturation * 0.4); // Up to 40% penalty
  const spendEfficiency = Math.log10(spend + 1) / Math.log10(spend + 10000);
  
  const effectiveSpend = spend * saturationPenalty * spendEfficiency;
  const traffic = effectiveSpend / baseCPC;
  const actualCPC = spend / traffic;
  const effectiveness = (baseCPC / actualCPC) * 100; // % of optimal efficiency
  
  return {
    traffic: Math.floor(traffic),
    cost: spend,
    effectiveness: Math.min(effectiveness, 100)
  };
}

/**
 * Calculate Brand Equity evolution
 * Increases with quality content, PR, customer satisfaction
 * Decays over time if not maintained
 */
export function calculateBrandEquity(
  currentEquity: number,
  quarterlyActions: {
    contentQuality: number; // 0-100
    prActivity: number; // 0-100
    customerSatisfaction: number; // 0-100
    controversies: number; // Negative events
  }
): number {
  // Natural decay: 5% per quarter if no maintenance
  const decay = currentEquity * 0.05;
  
  // Positive influences
  const contentBoost = quarterlyActions.contentQuality * 0.1;
  const prBoost = quarterlyActions.prActivity * 0.15;
  const satisfactionBoost = quarterlyActions.customerSatisfaction * 0.08;
  
  // Negative influences
  const controversyPenalty = quarterlyActions.controversies * 5;
  
  const newEquity = currentEquity - decay + contentBoost + prBoost + satisfactionBoost - controversyPenalty;
  
  return Math.min(Math.max(newEquity, 0), 100); // Clamp 0-100
}

/**
 * Calculate Team Morale
 * Affects all campaign effectiveness
 * Reduced by burnout (overwork), increased by training and wins
 */
export function calculateTeamMorale(
  currentMorale: number,
  quarterlyFactors: {
    hoursWorked: number; // Total team hours
    maxCapacity: number; // Maximum sustainable hours
    trainingInvestment: number; // $ spent on team development
    campaignSuccesses: number; // Number of successful campaigns
    crises: number; // Number of crises/failures
  }
): number {
  // Burnout penalty if overworked
  const utilizationRate = quarterlyFactors.hoursWorked / quarterlyFactors.maxCapacity;
  const burnoutPenalty = utilizationRate > 0.9 ? (utilizationRate - 0.9) * 50 : 0;
  
  // Training boost
  const trainingBoost = Math.min(quarterlyFactors.trainingInvestment / 10000, 5);
  
  // Success boost
  const successBoost = quarterlyFactors.campaignSuccesses * 3;
  
  // Crisis penalty
  const crisisPenalty = quarterlyFactors.crises * 8;
  
  const newMorale = currentMorale - burnoutPenalty + trainingBoost + successBoost - crisisPenalty;
  
  return Math.min(Math.max(newMorale, 0), 100);
}

/**
 * Apply morale multiplier to campaign results
 * Low morale significantly reduces effectiveness
 */
export function applyMoraleMultiplier(baseResult: number, morale: number): number {
  // Morale affects output on a curve
  // 100 morale = 1.0x, 50 morale = 0.75x, 0 morale = 0.3x
  const multiplier = 0.3 + (morale / 100) * 0.7;
  return baseResult * multiplier;
}

/**
 * Calculate conversion rate based on multiple factors
 */
export function calculateConversionRate(
  baseRate: number,
  brandEquity: number,
  websiteQuality: number,
  targetingAccuracy: number
): number {
  const brandBoost = brandEquity / 200; // 0 to 0.5x boost
  const websiteMultiplier = websiteQuality / 100; // 0 to 1x
  const targetingMultiplier = targetingAccuracy / 100; // 0 to 1x
  
  const finalRate = baseRate * (1 + brandBoost) * websiteMultiplier * targetingMultiplier;
  
  return Math.min(finalRate, 0.25); // Cap at 25% conversion rate
}

/**
 * Calculate final Strategy Score
 * This is the main leaderboard metric
 */
export function calculateFinalScore(context: ScoringContext): FinalScore {
  const totalRevenue = context.quarters.reduce((sum, q) => sum + q.results.revenue, 0);
  const totalProfit = totalRevenue - context.budgetSpent;
  const roi = (totalProfit / context.budgetSpent) * 100;
  
  // Calculate final market share (from last quarter)
  const finalMarketShare = context.quarters[context.quarters.length - 1]?.results.marketShare 
    ? calculateMarketShare(
        context.budgetSpent / 4, // Avg quarterly spend
        context.competitorSpend / 4,
        5, // Starting share
        context.brandEquity
      )
    : 5;
  
  // Strategy Score Components
  const marketShareScore = finalMarketShare * 1000;
  const roiScore = Math.max(roi, 0) * 100;
  const brandEquityScore = context.brandEquity * 10;
  
  const strategyScore = Math.floor(marketShareScore + roiScore + brandEquityScore);
  
  // Determine grade
  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  if (strategyScore >= 8000) grade = 'A+';
  else if (strategyScore >= 6000) grade = 'A';
  else if (strategyScore >= 4000) grade = 'B';
  else if (strategyScore >= 2000) grade = 'C';
  else if (strategyScore >= 1000) grade = 'D';
  else grade = 'F';
  
  // Generate insights
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];
  
  if (roi > 150) strengths.push('Exceptional ROI - highly efficient budget use');
  if (finalMarketShare > 15) strengths.push('Strong market presence achieved');
  if (context.brandEquity > 70) strengths.push('Built powerful brand equity');
  
  if (roi < 50) weaknesses.push('Low ROI - budget efficiency needs improvement');
  if (finalMarketShare < 8) weaknesses.push('Limited market penetration');
  if (context.teamMorale < 50) weaknesses.push('Team burnout affected performance');
  
  if (context.annualAllocation.brandAwareness < 20) {
    recommendations.push('Invest more in brand awareness for long-term growth');
  }
  if (context.brandEquity < 50) {
    recommendations.push('Focus on content quality and PR to build brand equity');
  }
  
  return {
    strategyScore,
    breakdown: {
      marketShareScore,
      roiScore,
      brandEquityScore
    },
    grade,
    percentile: 0, // Calculate based on leaderboard position
    finalKPIs: {
      revenue: totalRevenue,
      profit: totalProfit,
      marketShare: finalMarketShare,
      customerSatisfaction: 75, // Calculate from tactics
      brandAwareness: context.brandEquity,
      roi
    },
    strengths,
    weaknesses,
    recommendations
  };
}

/**
 * Simulate competitor behavior based on market landscape
 */
export function simulateCompetitorSpend(
  landscape: 'disruptor' | 'crowded' | 'frontier',
  yourSpend: number,
  quarter: number
): number {
  let baseCompetitorSpend: number;
  
  switch (landscape) {
    case 'disruptor':
      // One large incumbent with 5x your budget
      baseCompetitorSpend = yourSpend * 5;
      break;
    case 'crowded':
      // Multiple competitors, total 3x your spend
      baseCompetitorSpend = yourSpend * 3;
      break;
    case 'frontier':
      // New market, competitors spend similar to you
      baseCompetitorSpend = yourSpend * 1.2;
      break;
  }
  
  // Competitors increase spend over time
  const growthFactor = 1 + (quarter * 0.1);
  
  return baseCompetitorSpend * growthFactor;
}

/**
 * Calculate market saturation based on total spending
 */
export function calculateMarketSaturation(
  totalMarketSpend: number,
  marketSize: number
): number {
  // Saturation increases as spend approaches market capacity
  const saturationRatio = totalMarketSpend / marketSize;
  
  // Sigmoid curve for saturation (0 to 1)
  return 1 / (1 + Math.exp(-5 * (saturationRatio - 0.5)));
}
