/**
 * Advanced ROI Calculation with Customer Lifetime Value
 * Accounts for long-term value, not just immediate revenue
 *
 * Priority: P1 (Week 2)
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

export interface ROIResult {
  immediateROI: number;
  longTermROI: number;
  weightedROI: number;
  clvMultiplier: number;
  totalCLV: number;
}

/**
 * Calculate ROI with Customer Lifetime Value
 */
export function calculateAdvancedROI(context: ROIContext): ROIResult {
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
  const totalCLV = customerAcquisitions * adjustedCLV;

  // Long-term ROI
  const longTermROI = spend > 0
    ? ((totalCLV - spend) / spend) * 100
    : 0;

  // Weighted ROI: 40% immediate, 60% long-term
  // This rewards long-term thinking
  const weightedROI = (immediateROI * 0.4) + (longTermROI * 0.6);

  return {
    immediateROI: Math.round(immediateROI * 100) / 100,
    longTermROI: Math.round(longTermROI * 100) / 100,
    weightedROI: Math.round(weightedROI * 100) / 100,
    clvMultiplier: brandCLVMultiplier,
    totalCLV: Math.round(totalCLV)
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
    fintech: { avgCLV: 2000, retentionRate: 0.70 },       // Moderate value
    'real-estate': { avgCLV: 30000, retentionRate: 0.75 },
    'food-delivery': { avgCLV: 200, retentionRate: 0.50 },
    fitness: { avgCLV: 800, retentionRate: 0.65 },
    automotive: { avgCLV: 50000, retentionRate: 0.70 },
    travel: { avgCLV: 1200, retentionRate: 0.55 },
    gaming: { avgCLV: 300, retentionRate: 0.45 },
    fashion: { avgCLV: 600, retentionRate: 0.50 },
    construction: { avgCLV: 100000, retentionRate: 0.80 },
    energy: { avgCLV: 16000, retentionRate: 0.75 },
    agritech: { avgCLV: 20000, retentionRate: 0.70 },
    manufacturing: { avgCLV: 150000, retentionRate: 0.75 },
    nonprofit: { avgCLV: 500, retentionRate: 0.60 },
    music: { avgCLV: 100, retentionRate: 0.40 },
    sports: { avgCLV: 400, retentionRate: 0.50 },
    'pet-care': { avgCLV: 700, retentionRate: 0.65 },
    'home-services': { avgCLV: 600, retentionRate: 0.60 },
    cannabis: { avgCLV: 350, retentionRate: 0.55 },
    space: { avgCLV: 1000000, retentionRate: 0.90 }
  };

  return benchmarks[industry] || { avgCLV: 1000, retentionRate: 0.65 };
}

/**
 * Calculate Customer Acquisition Cost (CAC) with market saturation
 */
export function calculateCAC(
  channel: string,
  spend: number,
  acquisitions: number,
  marketSaturation: number,
  competitorSpend: number,
  brandEquity: number
): number {
  if (acquisitions === 0) return Infinity;

  // Base CAC by channel (industry benchmarks)
  const baseCAC: Record<string, number> = {
    'google-ads': 50,
    'facebook-ads': 35,
    'linkedin-ads': 120,
    'content-marketing': 25, // Lower, but takes time
    'seo': 15, // Lowest, but slowest
    'events': 200,
    'pr': 80,
    'social': 40,
    'email': 20,
    'influencer': 150
  };

  const channelCAC = baseCAC[channel] || 50;

  // Market saturation increases CAC (harder to find customers)
  const saturationPenalty = 1 + (marketSaturation * 0.5); // Up to 50% increase

  // Competition increases CAC (bidding wars)
  const competitionPenalty = 1 + (competitorSpend / 100000) * 0.1;

  // Brand equity reduces CAC (easier to convert when brand is strong)
  const brandDiscount = 1 - (brandEquity / 100) * 0.2; // Up to 20% reduction

  const finalCAC = channelCAC * saturationPenalty * competitionPenalty * brandDiscount;

  return Math.max(finalCAC, channelCAC * 0.5); // Floor at 50% of base
}

/**
 * Calculate ROI efficiency (ROI per dollar spent)
 */
export function calculateROIEfficiency(
  roi: number,
  spend: number
): number {
  if (spend === 0) return 0;
  return (roi / 100) * spend; // Return per dollar
}

