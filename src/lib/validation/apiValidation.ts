/**
 * API Request Validation
 * Zod schemas for validating API request bodies
 */

import { z } from 'zod';

/**
 * Simulation creation schema
 */
export const createSimulationSchema = z.object({
  company_name: z.string().min(2).max(100),
  time_horizon: z.enum(['1-year', '3-year', '5-year']).optional(),
  industry: z.enum(['healthcare', 'legal', 'ecommerce']).optional(),
  company_profile: z.enum(['startup', 'enterprise']).optional(),
  market_landscape: z.enum(['disruptor', 'crowded', 'frontier']).optional(),
  budget_brand_awareness: z.number().min(0).max(100).optional(),
  budget_lead_generation: z.number().min(0).max(100).optional(),
  budget_conversion_optimization: z.number().min(0).max(100).optional(),
  total_budget: z.number().min(0).optional(),
  status: z.enum(['in_progress', 'completed', 'abandoned']).optional(),
});

/**
 * Quarter decision schema
 */
export const quarterDecisionSchema = z.object({
  quarter: z.enum(['Q1', 'Q2', 'Q3', 'Q4']),
  tactics: z.array(
    z.object({
      tacticId: z.string(),
      budgetAllocated: z.number().min(0),
      timeAllocated: z.number().min(0),
    })
  ),
  abTestResult: z
    .object({
      selectedCorrectly: z.boolean(),
      cpaImpact: z.number(),
      conversionImpact: z.number(),
    })
    .optional(),
  wildcardResponse: z
    .object({
      eventId: z.string(),
      choiceId: z.string(),
    })
    .optional(),
  talentHire: z
    .object({
      candidateId: z.string(),
      salary: z.number().min(0),
    })
    .optional(),
  bigBet: z
    .object({
      betId: z.string(),
      investment: z.number().min(0),
    })
    .optional(),
});

/**
 * Validate request body with schema
 */
export function validateRequestBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown
): { success: true; data: T } | { success: false; error: string; details?: z.ZodError } {
  try {
    const data = schema.parse(body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        details: error,
      };
    }
    return {
      success: false,
      error: 'Invalid request body',
    };
  }
}

/**
 * Validate budget allocation sums to 100%
 */
export function validateBudgetAllocation(
  brandAwareness: number,
  leadGeneration: number,
  conversionOptimization: number
): { valid: boolean; error?: string } {
  const total = brandAwareness + leadGeneration + conversionOptimization;
  const tolerance = 0.01; // 1% tolerance for floating point errors

  if (Math.abs(total - 100) > tolerance) {
    return {
      valid: false,
      error: `Budget allocation must sum to 100%. Current sum: ${total.toFixed(2)}%`,
    };
  }

  if (brandAwareness < 0 || leadGeneration < 0 || conversionOptimization < 0) {
    return {
      valid: false,
      error: 'Budget allocation values must be non-negative',
    };
  }

  return { valid: true };
}

