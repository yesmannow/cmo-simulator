/**
 * Comprehensive Type System
 * Central type definitions for the entire application
 */

// ============================================================================
// CORE TYPES
// ============================================================================

export type UUID = string;
export type Timestamp = string; // ISO 8601
export type Currency = number; // USD cents
export type Percentage = number; // 0-100

// ============================================================================
// USER & AUTH TYPES
// ============================================================================

export interface User {
  id: UUID;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  subscription_tier?: SubscriptionTier;
  preferences?: UserPreferences;
}

export type SubscriptionTier = 'free' | 'pro' | 'team' | 'enterprise';

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications_enabled?: boolean;
  email_updates?: boolean;
  tutorial_completed?: boolean;
  favorite_industries?: Industry[];
}

// ============================================================================
// SIMULATION TYPES
// ============================================================================

export type Industry =
  | 'healthcare'
  | 'legal'
  | 'ecommerce'
  | 'saas'
  | 'fintech'
  | 'education'
  | 'real-estate'
  | 'food-delivery'
  | 'fitness'
  | 'automotive'
  | 'travel'
  | 'gaming'
  | 'fashion'
  | 'construction'
  | 'energy'
  | 'agritech'
  | 'manufacturing'
  | 'nonprofit'
  | 'music'
  | 'sports'
  | 'pet-care'
  | 'home-services'
  | 'cannabis'
  | 'space';

export type TimeHorizon = '1-year' | '3-year' | '5-year';

export type CompanyProfile = 'startup' | 'enterprise';

export type MarketLandscape = 'disruptor' | 'crowded' | 'frontier';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type SimulationStatus = 'setup' | 'in_progress' | 'paused' | 'completed' | 'abandoned';

export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'strategy';

export interface SimulationConfig {
  companyName: string;
  timeHorizon: TimeHorizon;
  industry: Industry;
  companyProfile: CompanyProfile;
  marketLandscape: MarketLandscape;
  totalBudget: Currency;
  budgetAllocation: BudgetAllocation;
  difficulty: DifficultyLevel;
}

export interface BudgetAllocation {
  brandAwareness: Percentage;
  leadGeneration: Percentage;
  conversionOptimization: Percentage;
}

export interface Simulation {
  id: UUID;
  user_id: UUID;
  config: SimulationConfig;
  status: SimulationStatus;
  current_quarter: Quarter;
  current_day: number;
  total_days: number;
  started_at: Timestamp;
  completed_at?: Timestamp;
  paused_at?: Timestamp;
  score?: number;
  rank?: string;
  achievements: Achievement[];
  created_at: Timestamp;
  updated_at: Timestamp;
}

// ============================================================================
// MARKETING CHANNEL TYPES
// ============================================================================

export type Channel =
  | 'tv'
  | 'radio'
  | 'print'
  | 'digital'
  | 'social'
  | 'seo'
  | 'events'
  | 'pr';

export interface ChannelSpend {
  channel: Channel;
  amount: Currency;
  allocation_percentage: Percentage;
}

export interface ChannelPerformance {
  channel: Channel;
  spend: Currency;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: Currency;
  roi: number;
  cpa: Currency; // Cost per acquisition
  ctr: Percentage; // Click-through rate
  conversion_rate: Percentage;
  traffic: number;
  leads: number;
}

export interface ChannelMetrics {
  efficiency: number; // Base efficiency multiplier
  saturation_point: Currency; // Point of diminishing returns
  adstock_decay: number; // How quickly effect decays (0-1)
  synergy_multiplier: number; // Synergy with other channels
  seasonality_impact: number; // Seasonal variation
}

// ============================================================================
// DECISION & STRATEGY TYPES
// ============================================================================

export type DecisionType =
  | 'channel_allocation'
  | 'budget_adjustment'
  | 'campaign_launch'
  | 'crisis_response'
  | 'partnership'
  | 'product_launch'
  | 'market_expansion';

export interface Decision {
  id: UUID;
  simulation_id: UUID;
  quarter: Quarter;
  day: number;
  type: DecisionType;
  description: string;
  channel_spends?: Record<Channel, Currency>;
  expected_impact?: ImpactPrediction;
  actual_impact?: ImpactResult;
  ai_recommendation?: AIRecommendation;
  user_notes?: string;
  created_at: Timestamp;
}

export interface ImpactPrediction {
  revenue_change: Currency;
  market_share_change: Percentage;
  brand_equity_change: number;
  confidence: Percentage;
  risk_level: 'low' | 'medium' | 'high';
}

export interface ImpactResult {
  revenue_change: Currency;
  market_share_change: Percentage;
  brand_equity_change: number;
  unexpected_outcomes?: string[];
}

// ============================================================================
// AI & INSIGHTS TYPES
// ============================================================================

export interface AIRecommendation {
  id: UUID;
  simulation_id: UUID;
  quarter: Quarter;
  type: 'optimization' | 'warning' | 'opportunity' | 'insight';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  suggested_action?: string;
  expected_impact?: ImpactPrediction;
  reasoning: string[];
  data_points: Record<string, any>;
  dismissed: boolean;
  created_at: Timestamp;
}

export interface MarketInsight {
  id: UUID;
  simulation_id: UUID;
  quarter: Quarter;
  category: 'trend' | 'competitor' | 'customer' | 'market' | 'technology';
  title: string;
  description: string;
  impact_level: 'low' | 'medium' | 'high';
  actionable: boolean;
  related_channels?: Channel[];
  created_at: Timestamp;
}

// ============================================================================
// PERFORMANCE & ANALYTICS TYPES
// ============================================================================

export interface QuarterlyResults {
  simulation_id: UUID;
  quarter: Quarter;
  year: number;
  
  // Financial Metrics
  revenue: Currency;
  profit: Currency;
  roi: Percentage;
  budget_spent: Currency;
  budget_remaining: Currency;
  
  // Marketing Metrics
  total_impressions: number;
  total_clicks: number;
  total_conversions: number;
  total_traffic: number;
  total_leads: number;
  avg_cpa: Currency;
  avg_ctr: Percentage;
  conversion_rate: Percentage;
  
  // Business Metrics
  market_share: Percentage;
  brand_equity: number; // 0-100 score
  customer_satisfaction: number; // 0-100 score
  team_morale: number; // 0-100 score
  
  // Channel Performance
  channel_performance: Record<Channel, ChannelPerformance>;
  
  // Comparative Metrics
  vs_previous_quarter?: PerformanceComparison;
  vs_industry_average?: PerformanceComparison;
  vs_competitors?: PerformanceComparison;
  
  created_at: Timestamp;
}

export interface PerformanceComparison {
  revenue_change: Percentage;
  market_share_change: Percentage;
  roi_change: Percentage;
  trend: 'improving' | 'declining' | 'stable';
}

export interface KPISnapshot {
  timestamp: Timestamp;
  revenue: Currency;
  profit: Currency;
  market_share: Percentage;
  brand_equity: number;
  customer_satisfaction: number;
  team_morale: number;
  budget_remaining: Currency;
}

// ============================================================================
// GAMIFICATION TYPES
// ============================================================================

export type AchievementCategory =
  | 'revenue'
  | 'efficiency'
  | 'strategy'
  | 'innovation'
  | 'consistency'
  | 'mastery';

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  icon: string;
  points: number;
  unlocked: boolean;
  unlocked_at?: Timestamp;
  progress?: number; // 0-100
  requirement: string;
  reward?: string;
}

export interface Leaderboard {
  period: 'daily' | 'weekly' | 'monthly' | 'all-time';
  entries: LeaderboardEntry[];
  user_rank?: number;
  updated_at: Timestamp;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: UUID;
  user_name: string;
  user_avatar?: string;
  score: number;
  simulation_id: UUID;
  company_name: string;
  industry: Industry;
  achievements_count: number;
}

// ============================================================================
// EVENT & WILDCARD TYPES
// ============================================================================

export type WildcardType =
  | 'market_shift'
  | 'competitor_action'
  | 'economic_change'
  | 'technology_disruption'
  | 'regulatory_change'
  | 'crisis'
  | 'opportunity';

export interface WildcardEvent {
  id: UUID;
  simulation_id: UUID;
  quarter: Quarter;
  day: number;
  type: WildcardType;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  title: string;
  description: string;
  impact: EventImpact;
  response_options?: ResponseOption[];
  user_response?: string;
  outcome?: string;
  created_at: Timestamp;
}

export interface EventImpact {
  revenue_modifier: number; // Multiplier (e.g., 0.9 = -10%)
  market_share_change: Percentage;
  brand_equity_change: number;
  affected_channels?: Channel[];
  duration_days: number;
}

export interface ResponseOption {
  id: string;
  label: string;
  description: string;
  cost?: Currency;
  expected_outcome: string;
  risk_level: 'low' | 'medium' | 'high';
}

// ============================================================================
// SCENARIO & PLANNING TYPES
// ============================================================================

export interface Scenario {
  id: UUID;
  name: string;
  description: string;
  base_simulation_id: UUID;
  channel_spends: Record<Channel, Currency>;
  predicted_outcomes: ScenarioOutcome;
  created_at: Timestamp;
}

export interface ScenarioOutcome {
  revenue: Currency;
  roi: Percentage;
  market_share: Percentage;
  confidence_interval: {
    low: Currency;
    high: Currency;
  };
  risks: string[];
  opportunities: string[];
}

export interface WhatIfAnalysis {
  parameter: string;
  current_value: number;
  test_values: number[];
  results: WhatIfResult[];
}

export interface WhatIfResult {
  value: number;
  revenue: Currency;
  roi: Percentage;
  market_share: Percentage;
}

// ============================================================================
// MARKET & COMPETITION TYPES
// ============================================================================

export interface MarketConditions {
  economic_index: number; // 0-2, 1 = normal
  seasonality_factor: number; // Multiplier
  competition_intensity: number; // 0-1
  market_saturation: Percentage;
  consumer_confidence: number; // 0-100
}

export interface CompetitorProfile {
  id: UUID;
  name: string;
  market_share: Percentage;
  estimated_budget: Currency;
  strategy: 'aggressive' | 'balanced' | 'conservative';
  strengths: string[];
  weaknesses: string[];
  recent_actions: CompetitorAction[];
}

export interface CompetitorAction {
  quarter: Quarter;
  action_type: string;
  description: string;
  estimated_impact: 'low' | 'medium' | 'high';
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export interface ExportData {
  simulation: Simulation;
  quarterly_results: QuarterlyResults[];
  decisions: Decision[];
  achievements: Achievement[];
  final_score: number;
  export_date: Timestamp;
  format: 'json' | 'csv' | 'pdf';
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: Timestamp;
    request_id: string;
  };
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
