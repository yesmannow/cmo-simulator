/**
 * Calculation Helpers and Validators
 * Provides validation, error handling, and utility functions for calculations
 */

import { logger } from '@/lib/logger';

/**
 * Validate a number is finite and not NaN
 */
export function isValidNumber(value: number): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Safely divide two numbers, returning 0 if denominator is 0
 */
export function safeDivide(numerator: number, denominator: number, defaultValue: number = 0): number {
  if (!isValidNumber(numerator) || !isValidNumber(denominator)) {
    return defaultValue;
  }
  if (denominator === 0) {
    return defaultValue;
  }
  return numerator / denominator;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  if (!isValidNumber(value)) return min;
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculate percentage safely
 */
export function safePercentage(part: number, total: number, defaultValue: number = 0): number {
  return safeDivide(part, total, defaultValue) * 100;
}

/**
 * Calculate ROI safely
 */
export function safeROI(revenue: number, cost: number): number {
  if (!isValidNumber(revenue) || !isValidNumber(cost)) return 0;
  if (cost === 0) return revenue > 0 ? Infinity : 0;
  return ((revenue - cost) / cost) * 100;
}

/**
 * Round to specified decimal places
 */
export function roundTo(value: number, decimals: number = 2): number {
  if (!isValidNumber(value)) return 0;
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Calculate weighted average
 */
export function weightedAverage(values: number[], weights: number[]): number {
  if (values.length !== weights.length || values.length === 0) return 0;

  let totalWeight = 0;
  let weightedSum = 0;

  for (let i = 0; i < values.length; i++) {
    if (isValidNumber(values[i]) && isValidNumber(weights[i]) && weights[i] >= 0) {
      weightedSum += values[i] * weights[i];
      totalWeight += weights[i];
    }
  }

  return safeDivide(weightedSum, totalWeight, 0);
}

/**
 * Calculate compound growth rate
 */
export function compoundGrowthRate(
  startValue: number,
  endValue: number,
  periods: number
): number {
  if (!isValidNumber(startValue) || !isValidNumber(endValue) || !isValidNumber(periods) || periods <= 0) {
    return 0;
  }
  if (startValue <= 0) return 0;

  const growthRate = Math.pow(endValue / startValue, 1 / periods) - 1;
  return roundTo(growthRate * 100, 2);
}

/**
 * Calculate conversion rate safely
 */
export function calculateConversionRate(conversions: number, visitors: number): number {
  return safePercentage(conversions, visitors, 0);
}

/**
 * Calculate customer acquisition cost (CAC)
 */
export function calculateCAC(spend: number, acquisitions: number): number {
  if (acquisitions === 0) return spend > 0 ? Infinity : 0;
  return safeDivide(spend, acquisitions, 0);
}

/**
 * Calculate customer lifetime value (CLV)
 */
export function calculateCLV(
  avgOrderValue: number,
  purchaseFrequency: number,
  customerLifespan: number
): number {
  if (!isValidNumber(avgOrderValue) || !isValidNumber(purchaseFrequency) || !isValidNumber(customerLifespan)) {
    return 0;
  }
  return avgOrderValue * purchaseFrequency * customerLifespan;
}

/**
 * Calculate LTV:CAC ratio
 */
export function calculateLTVCACRatio(ltv: number, cac: number): number {
  if (cac === 0) return ltv > 0 ? Infinity : 0;
  return safeDivide(ltv, cac, 0);
}

/**
 * Validate calculation result and log warnings
 */
export function validateCalculationResult(
  value: number,
  name: string,
  min?: number,
  max?: number
): number {
  if (!isValidNumber(value)) {
    logger.warn(`[Calculation] ${name} is not a valid number:`, { value });
    return 0;
  }

  if (min !== undefined && value < min) {
    logger.warn(`[Calculation] ${name} is below minimum ${min}:`, { value, min });
    return clamp(value, min, max || Infinity);
  }

  if (max !== undefined && value > max) {
    logger.warn(`[Calculation] ${name} is above maximum ${max}:`, { value, max });
    return clamp(value, min || -Infinity, max);
  }

  return value;
}

/**
 * Calculate efficiency score (0-100)
 */
export function calculateEfficiencyScore(
  actual: number,
  target: number,
  maxScore: number = 100
): number {
  if (!isValidNumber(actual) || !isValidNumber(target) || target === 0) {
    return 0;
  }
  const ratio = actual / target;
  return clamp(ratio * maxScore, 0, maxScore);
}

