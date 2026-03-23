/**
 * Real-Time Score Tracking
 * Provides live score updates and projections
 *
 * Priority: P2 (Week 4)
 */

import { SimulationState } from '../simulationEngine';
import { calculateAdvancedScore, calculateScoreComponents, ScoreComponents } from './advancedScoring';
import { ScoringContext } from '../scoringEngine';

export interface ScoreTracker {
  currentScore: number;
  projectedScore: number;
  scoreVelocity: number; // Rate of change
  scoreComponents: ScoreComponents;
  percentile: number;
  rank: string;
  milestones: Milestone[];
  trend: 'improving' | 'declining' | 'stable';
  historicalScores: number[];
}

export interface Milestone {
  id: string;
  name: string;
  target: number;
  current: number;
  progress: number; // 0-100
  reward: string;
  category: 'revenue' | 'roi' | 'market-share' | 'score' | 'brand-equity';
}

/**
 * Create score tracker from current simulation state
 */
export function createScoreTracker(
  state: SimulationState,
  historicalScores: number[] = []
): ScoreTracker {
  // Convert state to scoring context
  const context = convertToScoringContext(state);

  // Calculate current score
  const currentScore = calculateCurrentScore(context, state.config.difficulty, state.config.industry);

  // Calculate trend
  const trend = calculateTrend(historicalScores);

  // Project future score
  const remainingQuarters = 4 - state.quarterlyResults.length;
  const projectedScore = currentScore + (trend * remainingQuarters);

  // Calculate velocity
  const scoreVelocity = calculateVelocity(historicalScores);

  // Get component trends
  const componentTrends = calculateScoreComponentsForTracker(context);

  // Calculate percentile (requires leaderboard data - placeholder for now)
  const percentile = calculatePercentile(currentScore);

  // Get rank
  const rank = getRank(currentScore);

  // Check milestones
  const milestones = checkMilestones(state, currentScore);

  return {
    currentScore,
    projectedScore: Math.max(0, projectedScore),
    scoreVelocity,
    scoreComponents: componentTrends,
    percentile,
    rank,
    milestones,
    trend: trend > 100 ? 'improving' : trend < -100 ? 'declining' : 'stable',
    historicalScores
  };
}

/**
 * Calculate current score using advanced scoring
 */
function calculateCurrentScore(
  context: ScoringContext,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  industry: string
): number {
  const score = calculateAdvancedScore(context, difficulty, industry);
  return score.totalScore;
}

/**
 * Calculate trend from historical scores
 */
function calculateTrend(scores: number[]): number {
  if (scores.length < 2) return 0;

  // Linear regression to find trend
  const n = scores.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = scores.reduce((a, b) => a + b, 0);
  const sumXY = scores.reduce((sum, y, x) => sum + x * y, 0);
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  return isNaN(slope) ? 0 : slope;
}

/**
 * Calculate score velocity (rate of change)
 */
function calculateVelocity(scores: number[]): number {
  if (scores.length < 2) return 0;
  const recent = scores.slice(-2);
  return recent[1] - recent[0];
}

/**
 * Calculate component trends
 */
function calculateScoreComponentsForTracker(context: ScoringContext): ScoreComponents {
  return calculateScoreComponents(context);
}

/**
 * Calculate percentile (placeholder - would query leaderboard)
 */
function calculatePercentile(score: number): number {
  // TODO: Query leaderboard to get actual percentile
  // For now, return placeholder based on score ranges
  if (score >= 12000) return 95;
  if (score >= 9000) return 85;
  if (score >= 6000) return 70;
  if (score >= 3000) return 50;
  if (score >= 1500) return 30;
  return 15;
}

/**
 * Get rank based on score
 */
function getRank(score: number): string {
  if (score >= 12000) return 'Legendary CMO';
  if (score >= 9000) return 'Master Marketer';
  if (score >= 6000) return 'Expert Strategist';
  if (score >= 3000) return 'Senior CMO';
  if (score >= 1500) return 'Marketing Manager';
  if (score >= 800) return 'Marketing Specialist';
  return 'Marketing Intern';
}

/**
 * Check milestones and return progress
 */
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
      progress: Math.min(100, (totalRevenue / 1000000) * 100),
      reward: '+500 points',
      category: 'revenue'
    });
  }

  if (totalRevenue >= 1000000 && totalRevenue < 10000000) {
    milestones.push({
      id: 'ten_million',
      name: 'Ten Million',
      target: 10000000,
      current: totalRevenue,
      progress: Math.min(100, (totalRevenue / 10000000) * 100),
      reward: '+1000 points',
      category: 'revenue'
    });
  }

  // Score milestones
  if (currentScore < 5000) {
    milestones.push({
      id: 'score_5k',
      name: '5K Score',
      target: 5000,
      current: currentScore,
      progress: Math.min(100, (currentScore / 5000) * 100),
      reward: 'Achievement Unlocked',
      category: 'score'
    });
  }

  if (currentScore >= 5000 && currentScore < 10000) {
    milestones.push({
      id: 'score_10k',
      name: '10K Score',
      target: 10000,
      current: currentScore,
      progress: Math.min(100, (currentScore / 10000) * 100),
      reward: 'Master Badge',
      category: 'score'
    });
  }

  // Market share milestones
  const currentMarketShare = state.currentMarketShare;
  if (currentMarketShare < 15) {
    milestones.push({
      id: 'market_share_15',
      name: '15% Market Share',
      target: 15,
      current: currentMarketShare,
      progress: Math.min(100, (currentMarketShare / 15) * 100),
      reward: '+300 points',
      category: 'market-share'
    });
  }

  // Brand equity milestones
  const brandEquity = state.brandEquity;
  if (brandEquity < 70) {
    milestones.push({
      id: 'brand_equity_70',
      name: 'Strong Brand (70+)',
      target: 70,
      current: brandEquity,
      progress: Math.min(100, (brandEquity / 70) * 100),
      reward: '+200 points',
      category: 'brand-equity'
    });
  }

  return milestones;
}

/**
 * Convert SimulationState to ScoringContext
 */
function convertToScoringContext(state: SimulationState): ScoringContext {
  return {
    timeHorizon: state.config.timeHorizon,
    industry: state.config.industry,
    companyProfile: state.config.companyProfile,
    marketLandscape: state.config.marketLandscape,
    totalBudget: state.totalBudget,
    budgetSpent: state.totalBudget - state.budgetRemaining,
    annualAllocation: state.config.budgetAllocation,
    brandEquity: state.brandEquity,
    teamMorale: state.teamMorale,
    quarters: state.quarterlyResults.map(q => ({
      quarter: q.quarter,
      tacticsUsed: q.tacticsUsed,
      budgetSpent: q.budgetSpent,
      teamHoursUsed: q.teamHoursUsed,
      timeSpent: q.timeSpent,
      wildcardResponse: undefined,
      talentHired: undefined,
      bigBet: undefined,
      results: q.results,
      trafficSources: q.trafficSources
    })),
    competitorSpend: state.competitorSpend,
    marketSaturation: state.marketSaturation
  };
}

/**
 * Update score tracker with new quarter data
 */
export function updateScoreTracker(
  tracker: ScoreTracker,
  newScore: number
): ScoreTracker {
  const updatedScores = [...tracker.historicalScores, newScore];
  const newVelocity = calculateVelocity(updatedScores.slice(-2));
  const newTrend = calculateTrend(updatedScores);

  return {
    ...tracker,
    currentScore: newScore,
    scoreVelocity: newVelocity,
    trend: newTrend > 100 ? 'improving' : newTrend < -100 ? 'declining' : 'stable',
    projectedScore: tracker.currentScore + (newTrend * 2), // Project 2 quarters ahead
    historicalScores: updatedScores
  };
}

