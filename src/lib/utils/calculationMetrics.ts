/**
 * Additional Calculation Metrics
 * Provides additional useful metrics for analysis and display
 */

import { safeDivide, roundTo, calculateCAC, calculateCLV, calculateLTVCACRatio } from './calculationHelpers';

export interface CalculationMetrics {
  // Basic metrics
  conversionRate: number; // Traffic to conversions
  leadConversionRate: number; // Leads to conversions
  averageOrderValue: number;
  customerAcquisitionCost: number;
  customerLifetimeValue: number;
  ltvCacRatio: number;

  // Efficiency metrics
  revenuePerDollar: number;
  trafficPerDollar: number;
  leadsPerDollar: number;

  // Growth metrics
  revenueGrowth: number;
  trafficGrowth: number;

  // Channel efficiency
  channelEfficiency: Record<string, {
    cac: number;
    roi: number;
    revenuePerDollar: number;
    conversionRate: number;
  }>;
}

/**
 * Calculate comprehensive metrics from simulation results
 */
export function calculateMetrics(params: {
  traffic: number;
  leads: number;
  conversions: number;
  revenue: number;
  spend: number;
  channelData: Array<{
    channel: string;
    spend: number;
    traffic: number;
    conversions: number;
    revenue: number;
  }>;
  previousTraffic?: number;
  previousRevenue?: number;
  avgOrderValue?: number;
  purchaseFrequency?: number;
  customerLifespan?: number;
}): CalculationMetrics {
  const {
    traffic,
    leads,
    conversions,
    revenue,
    spend,
    channelData,
    previousTraffic = 0,
    previousRevenue = 0,
    avgOrderValue = 0,
    purchaseFrequency = 1,
    customerLifespan = 1
  } = params;

  // Basic conversion rates
  const conversionRate = safeDivide(conversions, traffic, 0);
  const leadConversionRate = safeDivide(conversions, leads, 0);

  // Calculate AOV if not provided
  const averageOrderValue = avgOrderValue > 0
    ? avgOrderValue
    : safeDivide(revenue, conversions, 0);

  // Customer metrics
  const customerAcquisitionCost = calculateCAC(spend, conversions);
  const customerLifetimeValue = calculateCLV(averageOrderValue, purchaseFrequency, customerLifespan);
  const ltvCacRatio = calculateLTVCACRatio(customerLifetimeValue, customerAcquisitionCost);

  // Efficiency metrics
  const revenuePerDollar = safeDivide(revenue, spend, 0);
  const trafficPerDollar = safeDivide(traffic, spend, 0);
  const leadsPerDollar = safeDivide(leads, spend, 0);

  // Growth metrics
  const revenueGrowth = previousRevenue > 0
    ? safeDivide(revenue - previousRevenue, previousRevenue, 0) * 100
    : 0;
  const trafficGrowth = previousTraffic > 0
    ? safeDivide(traffic - previousTraffic, previousTraffic, 0) * 100
    : 0;

  // Channel efficiency
  const channelEfficiency: Record<string, any> = {};
  channelData.forEach(({ channel, spend: channelSpend, traffic: channelTraffic, conversions: channelConversions, revenue: channelRevenue }) => {
    channelEfficiency[channel] = {
      cac: calculateCAC(channelSpend, channelConversions),
      roi: safeDivide(channelRevenue - channelSpend, channelSpend, 0) * 100,
      revenuePerDollar: safeDivide(channelRevenue, channelSpend, 0),
      conversionRate: safeDivide(channelConversions, channelTraffic, 0) * 100
    };
  });

  return {
    conversionRate: roundTo(conversionRate * 100, 2),
    leadConversionRate: roundTo(leadConversionRate * 100, 2),
    averageOrderValue: roundTo(averageOrderValue, 2),
    customerAcquisitionCost: roundTo(customerAcquisitionCost, 2),
    customerLifetimeValue: roundTo(customerLifetimeValue, 2),
    ltvCacRatio: roundTo(ltvCacRatio, 2),
    revenuePerDollar: roundTo(revenuePerDollar, 2),
    trafficPerDollar: roundTo(trafficPerDollar, 2),
    leadsPerDollar: roundTo(leadsPerDollar, 2),
    revenueGrowth: roundTo(revenueGrowth, 2),
    trafficGrowth: roundTo(trafficGrowth, 2),
    channelEfficiency
  };
}

/**
 * Calculate profit margin
 */
export function calculateProfitMargin(revenue: number, costs: number): number {
  if (revenue === 0) return 0;
  return roundTo(safeDivide(revenue - costs, revenue, 0) * 100, 2);
}

/**
 * Calculate break-even point
 */
export function calculateBreakEven(fixedCosts: number, variableCostPerUnit: number, pricePerUnit: number): number {
  const contributionMargin = pricePerUnit - variableCostPerUnit;
  if (contributionMargin <= 0) return Infinity;
  return Math.ceil(safeDivide(fixedCosts, contributionMargin, 0));
}

/**
 * Calculate payback period (in periods)
 */
export function calculatePaybackPeriod(initialInvestment: number, periodicCashFlow: number): number {
  if (periodicCashFlow <= 0) return Infinity;
  return Math.ceil(safeDivide(initialInvestment, periodicCashFlow, 0));
}

