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
  TacticUsage
} from './scoringEngine';

import { generateWildcardEvent, WildcardEvent } from './advancedWildcards';
import { SAMPLE_TACTICS } from './tactics';
import { DifficultyLevel } from './difficultySystem';

// Helper function to map tactic categories to scoringEngine categories
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
  timeHorizon: '1-year' | '3-year' | '5-year';
  industry: 'healthcare' | 'legal' | 'ecommerce';
  companyProfile: 'startup' | 'enterprise';
  marketLandscape: 'disruptor' | 'crowded' | 'frontier';
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
    decisions: []
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
  
  // Calculate traffic from various sources
  const seoTraffic = calculateSEOImpact(
    newSeoInvestments,
    quarterIndex,
    getIndustryFactor(state.config.industry)
  );
  
  const paidAdsSpend = decisions.tactics
    .filter(t => {
      const tactic = SAMPLE_TACTICS.find(st => st.id === t.tacticId);
      return tactic?.category === 'digital';
    })
    .reduce((sum, t) => sum + t.budgetAllocated, 0);
  
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
  
  // Calculate base revenue from tactics
  let baseRevenue = 0;
  const leads = Math.floor((seoTraffic + paidAdsResult.traffic) * 0.05); // 5% lead rate
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
  
  // Calculate market share
  const quarterlyCompetitorSpend = simulateCompetitorSpend(
    state.config.marketLandscape,
    budgetSpent,
    quarterIndex
  );
  
  const newMarketShare = calculateMarketShare(
    budgetSpent,
    quarterlyCompetitorSpend,
    state.currentMarketShare,
    brandEquityWithWildcard
  );
  
  // Update market saturation
  const totalMarketSpend = budgetSpent + quarterlyCompetitorSpend;
  const marketSize = 10000000; // $10M market
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
    decisions: [...state.decisions, decisions]
  };
  
  return newState;
}

/**
 * Calculate final score and generate results
 */
export function finalizeSimulation(state: SimulationState) {
  return calculateFinalScore({
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
  } as ScoringContext);
}

// Helper functions

function getNextQuarter(current: 'Q1' | 'Q2' | 'Q3' | 'Q4'): 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'completed' {
  const map = { Q1: 'Q2', Q2: 'Q3', Q3: 'Q4', Q4: 'completed' } as const;
  return map[current];
}

function getIndustryFactor(industry: 'healthcare' | 'legal' | 'ecommerce'): number {
  const factors = {
    healthcare: 1.2, // Healthcare content performs well
    legal: 1.0,
    ecommerce: 0.8 // E-commerce is more competitive
  };
  return factors[industry];
}

function getAvgCustomerValue(industry: 'healthcare' | 'legal' | 'ecommerce'): number {
  const values = {
    healthcare: 5000,
    legal: 8000,
    ecommerce: 150
  };
  return values[industry];
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
    industry: state.config.industry,
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
