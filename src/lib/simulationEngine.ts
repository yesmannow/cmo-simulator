/**
 * Simulation Engine - Orchestrates the entire simulation
 * Integrates scoring, wildcards, tactics, and state management
 */

import {
  calculateMarketShare,
  calculateSEOImpact,
  calculatePaidAdsImpact,
  calculateBrandEquity,
  calculateTeamMorale,
  applyMoraleMultiplier,
  calculateFinalScore,
  simulateCompetitorSpend,
  calculateMarketSaturation,
  ScoringContext,
  QuarterPerformance as ScoringQuarterPerformance,
  TacticUsage,
  // NEW: Adstock functions
  updateAdstockHistory,
  getTotalAdstockTraffic,
  type AdstockHistory
} from './scoringEngine';

import { Industry, TimeHorizon, CompanyProfile, MarketLandscape } from '@/types';
import { getAvgCustomerValue, getIndustryFactor } from './industryData';
import { calculateMarketShareBass, calculateMarketMaturity } from './models/marketShare';
import { calculateAdvancedROI, getIndustryCLV } from './models/roi';
import { simulateCompetitiveResponse } from './models/competitive';
import { createScoreTracker, updateScoreTracker, type ScoreTracker } from './scoring/scoreTracker';

import { generateWildcardEvent, WildcardEvent } from './advancedWildcards';
import { SAMPLE_TACTICS } from './tactics';
import { DifficultyLevel } from './difficultySystem';
function mapTacticCategory(category: string): 'seo' | 'paid-ads' | 'content' | 'social' | 'events' | 'pr' {
  const categoryMap: Record<string, 'seo' | 'paid-ads' | 'content' | 'social' | 'events' | 'pr'> = {
    'digital': 'paid-ads',
    'traditional': 'paid-ads',
    'content': 'content',
    'events': 'events',
    'partnerships': 'pr',
    'seo': 'seo',
    'social': 'social',
    'pr': 'pr'
  };

  return categoryMap[category] || 'content';
}

export interface SimulationConfig {
  // Phase 0 Setup
  companyName: string;
  timeHorizon: TimeHorizon;
  industry: Industry;
  companyProfile: CompanyProfile;
  marketLandscape: MarketLandscape;
  difficulty: DifficultyLevel;

  // Budget Allocation
  budgetAllocation: {
    brandAwareness: number;
    leadGeneration: number;
    conversionOptimization: number;
  };

  // Total budget (calculated from time horizon)
  totalBudget: number;
}

export interface QuarterlyDecisions {
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';

  // Tactics selected
  tactics: {
    tacticId: string;
    budgetAllocated: number;
    timeAllocated: number;
  }[];

  // A/B Test result (Q1)
  abTestResult?: {
    selectedCorrectly: boolean;
    cpaImpact: number;
    conversionImpact: number;
  };

  // Wildcard response
  wildcardResponse?: {
    eventId: string;
    choiceId: string;
  };

  // Talent hire (Q2)
  talentHire?: {
    candidateId: string;
    salary: number;
  };

  // Strategic initiative
  strategicInitiative?: {
    type: 'double-down' | 'diversify' | 'training' | 'research';
    investment: number;
  };

  // Big bet (Q4)
  bigBet?: {
    betId: string;
    investment: number;
  };
}

export interface SimulationState {
  config: SimulationConfig;

  // Current state
  currentQuarter: 'setup' | 'strategy' | 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'completed';

  // Simulation metadata
  status: 'not_started' | 'in_progress' | 'completed' | 'abandoned';
  simulationId: string;

  // Financial
  totalBudget: number;
  budgetRemaining: number;
  totalRevenue: number;
  totalProfit: number;

  // Hidden metrics
  brandEquity: number;
  teamMorale: number;

  // Market
  currentMarketShare: number;
  competitorSpend: number;
  marketSaturation: number;

  // Historical data
  quarterlyResults: QuarterPerformance[];
  seoInvestments: number[]; // Track for compounding

  // Events
  wildcardEvents: WildcardEvent[];

  // Decisions
  decisions: QuarterlyDecisions[];

  // NEW: Adstock history for advanced MMM modeling
  adstockHistory?: AdstockHistory;

  // NEW: Real-time score tracking
  scoreTracker?: ScoreTracker;
}

/**
 * Initialize a new simulation
 */
export function initializeSimulation(config: SimulationConfig): SimulationState {
  // Determine budget based on time horizon
  const budgetMap = {
    '1-year': 500000,
    '3-year': 1000000,
    '5-year': 2000000
  };

  const totalBudget = budgetMap[config.timeHorizon];

  // Initial competitor spend based on landscape
  const initialCompetitorSpend = simulateCompetitorSpend(
    config.marketLandscape,
    totalBudget / 4, // Quarterly budget
    0 // Q0
  );

  return {
    config,
    currentQuarter: 'Q1',
    status: 'in_progress',
    simulationId: '', // Will be set when saved to database
    totalBudget,
    budgetRemaining: totalBudget,
    totalRevenue: 0,
    totalProfit: 0,
    brandEquity: config.companyProfile === 'enterprise' ? 60 : 40,
    teamMorale: 75,
    currentMarketShare: 5,
    competitorSpend: initialCompetitorSpend * 4, // Annual
    marketSaturation: 0.3,
    quarterlyResults: [],
    seoInvestments: [],
    wildcardEvents: [],
    decisions: [],
    scoreTracker: undefined // Will be initialized on first quarter or during setup if needed
  };
}

/**
 * Process a quarter's decisions and calculate results
 */
export function processQuarter(
  state: SimulationState,
  decisions: QuarterlyDecisions
): SimulationState {
  const quarterIndex = ['Q1', 'Q2', 'Q3', 'Q4'].indexOf(decisions.quarter);

  // Calculate budget spent this quarter
  const budgetSpent = decisions.tactics.reduce((sum, t) => sum + t.budgetAllocated, 0) +
    (decisions.wildcardResponse ? getWildcardCost(state, decisions.wildcardResponse) : 0) +
    (decisions.talentHire?.salary || 0) +
    (decisions.strategicInitiative?.investment || 0) +
    (decisions.bigBet?.investment || 0);

  // Calculate team hours used
  const teamHoursUsed = decisions.tactics.reduce((sum, t) => sum + t.timeAllocated, 0);
  const maxTeamHours = state.config.companyProfile === 'startup' ? 400 : 800;

  // Track SEO investments for compounding
  const seoSpend = decisions.tactics
    .filter(t => {
      const tactic = SAMPLE_TACTICS.find(st => st.id === t.tacticId);
      return tactic?.category === 'content' || tactic?.id.includes('seo');
    })
    .reduce((sum, t) => sum + t.budgetAllocated, 0);

  const newSeoInvestments = [...state.seoInvestments, seoSpend];

  // Calculate channel spends for adstock modeling
  const channelSpends = {
    digital: decisions.tactics
      .filter(t => SAMPLE_TACTICS.find(st => st.id === t.tacticId)?.category === 'digital')
      .reduce((sum, t) => sum + t.budgetAllocated, 0),
    content: seoSpend,
    events: decisions.tactics
      .filter(t => SAMPLE_TACTICS.find(st => st.id === t.tacticId)?.category === 'events')
      .reduce((sum, t) => sum + t.budgetAllocated, 0),
    partnerships: decisions.tactics
      .filter(t => SAMPLE_TACTICS.find(st => st.id === t.tacticId)?.category === 'partnerships')
      .reduce((sum, t) => sum + t.budgetAllocated, 0),
    traditional: decisions.tactics
      .filter(t => SAMPLE_TACTICS.find(st => st.id === t.tacticId)?.category === 'traditional')
      .reduce((sum, t) => sum + t.budgetAllocated, 0),
    social: 0, // No direct social category in sample tactics, covered by digital/content
    pr: 0 // No direct pr category in sample tactics, covered by partnerships
  };

  // Update adstock history with current quarter spends
  const updatedAdstockHistory = updateAdstockHistory(
    state.adstockHistory,
    decisions.quarter,
    channelSpends
  );

  // Calculate total traffic using adstock effects
  const totalTraffic = getTotalAdstockTraffic(updatedAdstockHistory, decisions.quarter);

  // Calculate traffic from various sources
  const seoTraffic = calculateSEOImpact(
    newSeoInvestments,
    quarterIndex,
    getIndustryFactor(state.config.industry)
  );

  const paidAdsSpend = channelSpends.digital;
  const paidAdsResult = calculatePaidAdsImpact(
    paidAdsSpend,
    state.marketSaturation,
    state.competitorSpend / (4 * 100000) // Normalize competitor activity
  );

  // Apply A/B test impact (Q1 only)
  let conversionRateMultiplier = 1.0;
  let cpaMultiplier = 1.0;

  if (decisions.abTestResult) {
    if (decisions.abTestResult.selectedCorrectly) {
      conversionRateMultiplier = 1 + (decisions.abTestResult.conversionImpact / 100);
      cpaMultiplier = 1 - (Math.abs(decisions.abTestResult.cpaImpact) / 100);
    } else {
      conversionRateMultiplier = 1 - (Math.abs(decisions.abTestResult.conversionImpact) / 100);
      cpaMultiplier = 1 + (decisions.abTestResult.cpaImpact / 100);
    }
  }

  // Calculate base revenue from adstock traffic
  let baseRevenue = 0;
  const leads = Math.floor(totalTraffic * 0.05); // 5% lead rate from adstock traffic
  const conversions = Math.floor(leads * 0.15 * conversionRateMultiplier); // 15% conversion rate

  const avgCustomerValue = getAvgCustomerValue(state.config.industry);
  baseRevenue = conversions * avgCustomerValue;

  // Apply morale multiplier
  const moraleAdjustedRevenue = applyMoraleMultiplier(baseRevenue, state.teamMorale);

  // Apply wildcard impact
  let wildcardRevenueImpact = 0;
  let wildcardBrandEquityImpact = 0;
  let wildcardMoraleImpact = 0;

  if (decisions.wildcardResponse) {
    const impact = getWildcardImpact(state, decisions.wildcardResponse);
    wildcardRevenueImpact = impact.revenue;
    wildcardBrandEquityImpact = impact.brandEquity || 0;
    wildcardMoraleImpact = impact.morale || 0;
  }

  const finalRevenue = moraleAdjustedRevenue + wildcardRevenueImpact;

  // Update brand equity
  const contentQuality = (seoSpend / budgetSpent) * 100;
  const newBrandEquity = calculateBrandEquity(state.brandEquity, {
    contentQuality,
    prActivity: 0,
    customerSatisfaction: 75,
    controversies: 0
  });

  const brandEquityWithWildcard = Math.max(0, Math.min(100,
    newBrandEquity + wildcardBrandEquityImpact
  ));

  // Update team morale
  const newTeamMorale = calculateTeamMorale(state.teamMorale, {
    hoursWorked: teamHoursUsed,
    maxCapacity: maxTeamHours,
    trainingInvestment: decisions.strategicInitiative?.type === 'training'
      ? decisions.strategicInitiative.investment
      : 0,
    campaignSuccesses: conversions > 50 ? 1 : 0,
    crises: wildcardRevenueImpact < 0 ? 1 : 0
  });

  const moraleWithWildcard = Math.max(0, Math.min(100,
    newTeamMorale + wildcardMoraleImpact
  ));

  // Calculate market share using enhanced Bass Diffusion Model
  const quarterlyCompetitorSpend = simulateCompetitorSpend(
    state.config.marketLandscape,
    budgetSpent,
    quarterIndex
  );

  // Use competitive response model to get dynamic competitor spend
  const previousShares = state.quarterlyResults.map(q => q.results.marketShare);
  const growthRate = previousShares.length >= 2
    ? (previousShares[previousShares.length - 1] - previousShares[previousShares.length - 2]) /
      Math.max(previousShares[previousShares.length - 2], 1)
    : 0;

  const dynamicCompetitorSpend = simulateCompetitiveResponse({
    yourMarketShare: state.currentMarketShare,
    yourSpend: budgetSpent,
    competitorSpend: quarterlyCompetitorSpend,
    marketLandscape: state.config.marketLandscape,
    yourGrowthRate: growthRate,
    quarter: quarterIndex + 1,
    yourBrandEquity: brandEquityWithWildcard
  });

  // Calculate market maturity
  const totalMarketSpend = budgetSpent + dynamicCompetitorSpend;
  const marketSize = 10000000; // $10M market
  const marketMaturity = calculateMarketMaturity(totalMarketSpend, marketSize);

  // Use Bass Diffusion Model for market share
  const newMarketShare = calculateMarketShareBass({
    currentShare: state.currentMarketShare,
    yourSpend: budgetSpent,
    competitorSpend: dynamicCompetitorSpend,
    brandEquity: brandEquityWithWildcard,
    marketMaturity,
    quartersElapsed: quarterIndex + 1,
    previousShares
  });

  // Update market saturation
  const newMarketSaturation = calculateMarketSaturation(totalMarketSpend, marketSize);

  // Create quarter result
  const quarterResult: QuarterPerformance = {
    quarter: decisions.quarter,
    tacticsUsed: decisions.tactics.map(t => {
      const tactic = SAMPLE_TACTICS.find(st => st.id === t.tacticId);
      return {
        tacticId: t.tacticId,
        category: mapTacticCategory(tactic?.category || 'digital'), // Map to scoringEngine categories
        spend: t.budgetAllocated,
        timeInvested: t.timeAllocated,
        isRecurring: tactic?.category === 'content'
      };
    }),
    budgetSpent,
    teamHoursUsed, // Match scoringEngine expectation
    timeSpent: teamHoursUsed, // Keep for compatibility
    wildcardEvents: [],
    results: {
      revenue: finalRevenue,
      profit: finalRevenue - budgetSpent,
      marketShare: newMarketShare,
      customerSatisfaction: 75,
      brandAwareness: brandEquityWithWildcard
    },
    revenue: finalRevenue,
    leads,
    conversions,
    trafficSources: {
      organic: Math.floor(seoTraffic),
      paid: paidAdsResult.traffic,
      social: 0,
      referral: 0
    }
  };
  // Update state
  const newState: SimulationState = {
    ...state,
    currentQuarter: getNextQuarter(decisions.quarter),
    budgetRemaining: state.budgetRemaining - budgetSpent,
    totalRevenue: state.totalRevenue + finalRevenue,
    totalProfit: state.totalProfit + (finalRevenue - budgetSpent),
    brandEquity: brandEquityWithWildcard,
    teamMorale: moraleWithWildcard,
    currentMarketShare: newMarketShare,
    marketSaturation: newMarketSaturation,
    quarterlyResults: [...state.quarterlyResults, quarterResult],
    seoInvestments: newSeoInvestments,
    decisions: [...state.decisions, decisions],
    adstockHistory: updatedAdstockHistory
  };

  // Update score tracker with new state
  newState.scoreTracker = state.scoreTracker 
    ? updateScoreTracker(state.scoreTracker, finalizeSimulation(newState).strategyScore)
    : createScoreTracker(newState, [finalizeSimulation(newState).strategyScore]);

  return newState;
}

/**
 * Calculate final score and generate results
 * Now uses advanced scoring with difficulty adjustment
 */
export function finalizeSimulation(state: SimulationState) {
  return calculateFinalScore(
    {
      timeHorizon: state.config.timeHorizon,
      industry: state.config.industry,
      companyProfile: state.config.companyProfile,
      marketLandscape: state.config.marketLandscape,
      totalBudget: state.totalBudget,
      budgetSpent: state.totalBudget - state.budgetRemaining,
      annualAllocation: state.config.budgetAllocation,
      brandEquity: state.brandEquity,
      teamMorale: state.teamMorale,
      quarters: state.quarterlyResults as unknown as ScoringQuarterPerformance[],
      competitorSpend: state.competitorSpend,
      marketSaturation: state.marketSaturation
    } as ScoringContext,
    state.config.difficulty,
    true // Use advanced scoring
  );
}

// Helper functions

function getNextQuarter(current: 'Q1' | 'Q2' | 'Q3' | 'Q4'): 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'completed' {
  const map = { Q1: 'Q2', Q2: 'Q3', Q3: 'Q4', Q4: 'completed' } as const;
  return map[current];
}

function getWildcardCost(state: SimulationState, response: { eventId: string; choiceId: string }): number {
  // In production, look up the actual wildcard event and choice
  // For now, return a placeholder
  return 0;
}

function getWildcardImpact(state: SimulationState, response: { eventId: string; choiceId: string }) {
  // In production, look up the actual wildcard event and choice
  // For now, return placeholder
  return {
    revenue: 0,
    brandEquity: 0,
    morale: 0
  };
}

/**
 * Generate a wildcard event for the current quarter
 */
export function generateQuarterlyWildcard(state: SimulationState, quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'): WildcardEvent {
  return generateWildcardEvent(quarter, {
    industry: state.config.industry as any, // Wildcard engine expects restricted list currently, but we'll cast to bypass for now or update it too
    landscape: state.config.marketLandscape,
    currentMarketShare: state.currentMarketShare,
    currentMorale: state.teamMorale,
    budgetRemaining: state.budgetRemaining
  });
}

/**
 * Validate quarterly decisions
 */
export function validateDecisions(state: SimulationState, decisions: QuarterlyDecisions): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check budget
  const totalSpend = decisions.tactics.reduce((sum, t) => sum + t.budgetAllocated, 0);
  if (totalSpend > state.budgetRemaining) {
    errors.push(`Total spend ($${totalSpend}) exceeds remaining budget ($${state.budgetRemaining})`);
  }

  // Check team hours
  const totalHours = decisions.tactics.reduce((sum, t) => sum + t.timeAllocated, 0);
  const maxHours = state.config.companyProfile === 'startup' ? 400 : 800;
  if (totalHours > maxHours) {
    errors.push(`Total hours (${totalHours}) exceeds team capacity (${maxHours})`);
  }

  // Check at least one tactic selected
  if (decisions.tactics.length === 0) {
    errors.push('Must select at least one tactic');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Define SimulationDebrief interface
export interface SimulationDebrief {
  simulationId: string;
  finalScore: number;
  grade: string;
  percentile: number;
  insights: string[];
}

// Define QuarterPerformance interface to match usage
export interface QuarterPerformance {
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  tacticsUsed: TacticUsage[];
  budgetSpent: number;
  teamHoursUsed: number; // Match scoringEngine expectation
  timeSpent: number; // Keep for compatibility
  wildcardEvents: WildcardEvent[];
  results: {
    revenue: number;
    profit: number;
    marketShare: number;
    customerSatisfaction: number;
    brandAwareness: number;
  };
  revenue: number;
  leads: number;
  conversions: number;
  trafficSources: {
    organic: number;
    paid: number;
    social: number;
    referral: number;
  };
}
