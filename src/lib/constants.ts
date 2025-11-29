/**
 * Application constants
 * Centralizes magic numbers and configuration values
 *
 * Benefits:
 * - Single source of truth for configuration
 * - Easy to adjust values
 * - Type-safe constants
 * - Self-documenting code
 */

// Default Values
export const DEFAULT_INDUSTRY = 'healthcare' as const;
export const DEFAULT_THEME = 'aurora-tech' as const;
export const DEFAULT_TIME_HORIZON = '1-year' as const;
export const DEFAULT_COMPANY_PROFILE = 'startup' as const;
export const DEFAULT_MARKET_LANDSCAPE = 'crowded' as const;

// Scoring Constants
export const SEO_COMPOUNDING_RATE = 0.15; // 15% per quarter
export const BRAND_EQUITY_DECAY = 0.05; // 5% per quarter if not maintained
export const MARKET_SHARE_INERTIA = 0.3; // 30% of previous share carries over
export const BRAND_MULTIPLIER_BASE = 200; // Brand equity divisor for market share

// Budget Constants
export const BUDGET_ALLOCATION_MIN = 0;
export const BUDGET_ALLOCATION_MAX = 100;
export const BUDGET_ALLOCATION_TOTAL = 100;
export const BUDGET_TOLERANCE = 0.01; // 1% tolerance for rounding

// Time Constants
export const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'] as const;
export const TIME_HORIZONS = ['1-year', '3-year', '5-year'] as const;
export const TIME_HORIZON_BUDGETS = {
  '1-year': 500000,
  '3-year': 1000000,
  '5-year': 2000000,
} as const;

// Industries
export const INDUSTRIES = ['healthcare', 'legal', 'ecommerce'] as const;
export const INDUSTRY_CUSTOMER_VALUES = {
  healthcare: 5000,
  legal: 8000,
  ecommerce: 150,
} as const;

// Company Profiles
export const COMPANY_PROFILES = ['startup', 'enterprise'] as const;
export const STARTING_BRAND_EQUITY = {
  startup: 40,
  enterprise: 60,
} as const;

// Market Landscapes
export const MARKET_LANDSCAPES = ['disruptor', 'crowded', 'frontier'] as const;

// Team Constants
export const STARTING_TEAM_MORALE = 75;
export const MAX_TEAM_MORALE = 100;
export const MIN_TEAM_MORALE = 0;
export const TEAM_CAPACITY_WARNING_THRESHOLD = 0.9; // 90% capacity triggers warning

// Market Share Constants
export const MIN_MARKET_SHARE = 0;
export const MAX_MARKET_SHARE = 100;

// Brand Equity Constants
export const MIN_BRAND_EQUITY = 0;
export const MAX_BRAND_EQUITY = 100;

// A/B Test Constants
export const AB_TEST_CPA_REDUCTION_CORRECT = 0.25; // -25% CPA for correct choice
export const AB_TEST_CONVERSION_BOOST_CORRECT = 0.35; // +35% conversions for correct choice
export const AB_TEST_CPA_INCREASE_INCORRECT = 0.15; // +15% CPA for incorrect choice
export const AB_TEST_CONVERSION_REDUCTION_INCORRECT = 0.20; // -20% conversions for incorrect choice

// Scoring Constants
export const MARKET_SHARE_SCORE_MULTIPLIER = 1000;
export const ROI_SCORE_MULTIPLIER = 100;
export const BRAND_EQUITY_SCORE_MULTIPLIER = 10;

// Grade Thresholds
export const GRADE_THRESHOLDS = {
  'A+': 8000,
  'A': 6000,
  'B': 4000,
  'C': 2000,
  'D': 1000,
  'F': 0,
} as const;

