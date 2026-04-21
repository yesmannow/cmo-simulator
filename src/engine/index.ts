import { SimulationState, PlayerInput, MarketConditions, Channel } from '../types/engine';
import type { Industry } from '@/types';
import { calculateAdstockAll } from './adstock';
import { applyHillTransformAll } from './saturation';
import { applySynergy } from './synergy';
import { safeDivide, clamp, validateCalculationResult } from '@/lib/utils/calculationHelpers';

// Channel-specific parameters
const DECAY_RATES: Record<Channel, number> = {
  tv: 0.8,
  radio: 0.6,
  print: 0.7,
  digital: 0.5,
  social: 0.4,
  seo: 0.9,
  events: 0.7,
  pr: 0.8
};

const SATURATION_POINTS: Record<Channel, number> = {
  tv: 200000,
  radio: 100000,
  print: 80000,
  digital: 150000,
  social: 120000,
  seo: 100000,
  events: 50000,
  pr: 60000
};

const SHAPES: Record<Channel, number> = {
  tv: 2,
  radio: 1.5,
  print: 2.5,
  digital: 1.8,
  social: 1.6,
  seo: 3,
  events: 2,
  pr: 2.2
};

// Traffic generation efficiency (visitors per dollar spent after saturation)
const TRAFFIC_EFFICIENCY: Record<Channel, number> = {
  tv: 0.02,      // 2% of audience reached becomes website visitors
  radio: 0.015,
  print: 0.01,
  digital: 0.05,  // Paid ads are more direct
  social: 0.03,
  seo: 0.08,     // SEO is highly efficient for organic traffic
  events: 0.04,
  pr: 0.025
};

// Industry-specific data
const INDUSTRY_DATA: Record<string, {
  baseMarketSize: number;
  avgCustomerValue: number;
  baseTrafficMultiplier: number;
  seasonalityFactor: number;
}> = {
  healthcare: { baseMarketSize: 5000000, avgCustomerValue: 5000, baseTrafficMultiplier: 1.2, seasonalityFactor: 0.9 },
  legal: { baseMarketSize: 3000000, avgCustomerValue: 8000, baseTrafficMultiplier: 1.0, seasonalityFactor: 1.0 },
  ecommerce: { baseMarketSize: 10000000, avgCustomerValue: 150, baseTrafficMultiplier: 0.8, seasonalityFactor: 1.3 },
  saas: { baseMarketSize: 8000000, avgCustomerValue: 2500, baseTrafficMultiplier: 1.1, seasonalityFactor: 0.95 },
  fintech: { baseMarketSize: 6000000, avgCustomerValue: 1200, baseTrafficMultiplier: 1.0, seasonalityFactor: 1.0 },
  education: { baseMarketSize: 4000000, avgCustomerValue: 800, baseTrafficMultiplier: 1.3, seasonalityFactor: 1.4 },
  'real-estate': { baseMarketSize: 7000000, avgCustomerValue: 15000, baseTrafficMultiplier: 0.9, seasonalityFactor: 1.2 },
  'food-delivery': { baseMarketSize: 12000000, avgCustomerValue: 35, baseTrafficMultiplier: 0.7, seasonalityFactor: 1.0 },
  fitness: { baseMarketSize: 8000000, avgCustomerValue: 200, baseTrafficMultiplier: 1.1, seasonalityFactor: 1.1 },
  automotive: { baseMarketSize: 9000000, avgCustomerValue: 25000, baseTrafficMultiplier: 0.8, seasonalityFactor: 0.9 },
  travel: { baseMarketSize: 6000000, avgCustomerValue: 300, baseTrafficMultiplier: 0.9, seasonalityFactor: 2.0 },
  gaming: { baseMarketSize: 15000000, avgCustomerValue: 60, baseTrafficMultiplier: 0.6, seasonalityFactor: 1.2 },
  fashion: { baseMarketSize: 11000000, avgCustomerValue: 120, baseTrafficMultiplier: 0.8, seasonalityFactor: 1.5 },
  construction: { baseMarketSize: 5000000, avgCustomerValue: 50000, baseTrafficMultiplier: 0.7, seasonalityFactor: 0.8 },
  energy: { baseMarketSize: 3000000, avgCustomerValue: 8000, baseTrafficMultiplier: 1.1, seasonalityFactor: 0.9 },
  agritech: { baseMarketSize: 2000000, avgCustomerValue: 10000, baseTrafficMultiplier: 1.2, seasonalityFactor: 1.3 },
  manufacturing: { baseMarketSize: 4000000, avgCustomerValue: 75000, baseTrafficMultiplier: 0.8, seasonalityFactor: 0.85 },
  nonprofit: { baseMarketSize: 1000000, avgCustomerValue: 250, baseTrafficMultiplier: 1.4, seasonalityFactor: 1.0 },
  music: { baseMarketSize: 8000000, avgCustomerValue: 15, baseTrafficMultiplier: 0.5, seasonalityFactor: 1.1 },
  sports: { baseMarketSize: 9000000, avgCustomerValue: 80, baseTrafficMultiplier: 0.9, seasonalityFactor: 1.8 },
  'pet-care': { baseMarketSize: 6000000, avgCustomerValue: 180, baseTrafficMultiplier: 1.0, seasonalityFactor: 0.9 },
  'home-services': { baseMarketSize: 8000000, avgCustomerValue: 150, baseTrafficMultiplier: 0.9, seasonalityFactor: 0.95 },
  cannabis: { baseMarketSize: 3000000, avgCustomerValue: 90, baseTrafficMultiplier: 0.8, seasonalityFactor: 1.0 },
  space: { baseMarketSize: 500000, avgCustomerValue: 500000, baseTrafficMultiplier: 1.5, seasonalityFactor: 0.8 }
};

/**
 * Run one simulation tick
 * Pure function that takes previous state and inputs, returns new state
 */
export function runSimulationTick(
  previousState: SimulationState,
  playerInputs: PlayerInput,
  marketConditions: MarketConditions
): SimulationState {
  // Update adstock
  const newAdstock = calculateAdstockAll(
    playerInputs.channelBudgets,
    previousState.adstock,
    DECAY_RATES
  );

  // Apply saturation (Hill transform)
  const saturatedResponses = applyHillTransformAll(
    newAdstock,
    SATURATION_POINTS,
    SHAPES
  );

  // Determine active channels (spend > 0)
  const activeChannels = Object.keys(playerInputs.channelBudgets).filter(
    channel => playerInputs.channelBudgets[channel as Channel] > 0
  ) as Channel[];

  // Apply synergy
  const synergisticResponses = applySynergy(saturatedResponses, activeChannels);

  // Calculate traffic from each channel
  const trafficSources: Record<Channel, number> = {} as Record<Channel, number>;
  let totalTraffic = 0;

  for (const channel of Object.keys(synergisticResponses) as Channel[]) {
    const response = synergisticResponses[channel] || 0;
    const spend = playerInputs.channelBudgets[channel] || 0;
    const efficiency = TRAFFIC_EFFICIENCY[channel] || 0.01;
    const economicIndex = clamp(marketConditions.economicIndex, 0.1, 2.0); // Clamp economic index

    // Response is 0-1 from Hill transform, multiply by spend and efficiency
    const traffic = validateCalculationResult(
      response * spend * efficiency * economicIndex,
      `Traffic for ${channel}`,
      0
    );
    trafficSources[channel] = traffic;
    totalTraffic += traffic;
  }

  // Ensure totalTraffic is valid
  totalTraffic = validateCalculationResult(totalTraffic, 'Total traffic', 0);

  // Calculate leads and conversions (like old engine)
  const leadRate = 0.05; // 5% of traffic becomes leads
  const baseConversionRate = 0.15; // 15% of leads convert

  const leads = Math.floor(totalTraffic * leadRate);
  const conversions = Math.floor(leads * baseConversionRate);

  // Get industry data for realistic revenue calculation.
  // Persisted runs may predate the `industry` field, so keep a safe fallback.
  const configuredIndustry = previousState.industry ?? ("healthcare" as Industry);
  const industryData =
    INDUSTRY_DATA[configuredIndustry] ?? INDUSTRY_DATA["healthcare"];
  const customerValue = industryData.avgCustomerValue;

  // Calculate base revenue
  const baseRevenue = validateCalculationResult(
    conversions * customerValue,
    'Base revenue',
    0
  );

  // Apply market conditions
  const seasonalMultiplier = clamp(
    marketConditions.seasonalityIndex * industryData.seasonalityFactor,
    0.1, // Minimum 10% of normal
    3.0  // Maximum 300% of normal
  );
  const finalRevenue = validateCalculationResult(
    baseRevenue * seasonalMultiplier,
    'Final revenue',
    0
  );

  // Calculate channel contributions proportionally
  const channelContributions: Record<Channel, number> = {} as Record<Channel, number>;

  for (const channel of Object.keys(trafficSources) as Channel[]) {
    const channelTraffic = trafficSources[channel];
    // Safe division to prevent division by zero
    const trafficShare = safeDivide(channelTraffic, totalTraffic, 0);
    const channelContribution = trafficShare * finalRevenue;
    channelContributions[channel] = validateCalculationResult(channelContribution, `Channel contribution for ${channel}`, 0);
  }

  // Calculate ROI per channel
  const channelRoi: Record<Channel, number> = {} as Record<Channel, number>;
  for (const channel of Object.keys(channelContributions) as Channel[]) {
    const spend = playerInputs.channelBudgets[channel] || 0;
    const contribution = channelContributions[channel] || 0;
    // Use safe ROI calculation
    const roi = spend > 0 ? safeDivide(contribution, spend, 0) * 100 : 0;
    channelRoi[channel] = validateCalculationResult(roi, `ROI for ${channel}`, -Infinity, Infinity);
  }

  // Base sales modified by perceptual utility and trust multiplier
  const idealPoint = { x: clamp(50 + (previousState.tick * 2), 0, 100), y: clamp(50 + (previousState.tick * 2), 0, 100) }; // Simplistic drift
  const currentBrandPos = previousState.brandPosition || { x: 50, y: 50 };
  const distance = Math.sqrt(Math.pow(currentBrandPos.x - idealPoint.x, 2) + Math.pow(currentBrandPos.y - idealPoint.y, 2));
  const maxDistance = Math.sqrt(100**2 + 100**2);
  const perceptualUtility = clamp(1 - (distance / maxDistance), 0, 1);
  
  const trustMultiplier = previousState.trustMultiplier ?? 1.0;
  const baseSales = industryData.baseMarketSize * 0.01 * marketConditions.seasonalityIndex * perceptualUtility * trustMultiplier;

  // Total sales
  const totalSales = baseSales + finalRevenue;

  // Calculate Executive Stress Meters (0 = Game Over/Fired, 100 = Perfect)
  const previousStress = previousState.stressMeters || { ceo: 75, cfo: 75, cmo: 75 };
  
  // CEO cares about total sales growth
  const salesGrowth = safeDivide(totalSales, Math.max(previousState.results.totalSales, 1), 1);
  let newCeoStress = previousStress.ceo;
  if (salesGrowth > 1.05) newCeoStress += 5;
  else if (salesGrowth < 1.0) newCeoStress -= 5;

  // CFO cares about overall ROI and Profitability
  const totalSpend = Object.values(playerInputs.channelBudgets).reduce((a, b) => a + b, 0);
  const overallRoi = totalSpend > 0 ? safeDivide(finalRevenue, totalSpend, 0) : 0;
  let newCfoStress = previousStress.cfo;
  if (overallRoi > 1.2) newCfoStress += 5;
  else if (overallRoi < 0.8) newCfoStress -= 5;

  // CMO cares about team flow state / burnout (Proxy using spend volatility currently)
  let newCmoStress = previousStress.cmo;
  if (totalSpend > 500000) newCmoStress -= 5;
  else newCmoStress += 2;

  const stressMeters = {
    ceo: clamp(newCeoStress, 0, 100),
    cfo: clamp(newCfoStress, 0, 100),
    cmo: clamp(newCmoStress, 0, 100),
  };

  // Flow State
  const newFlowState = clamp((previousState.flowState || 50) + (totalSpend > 500000 ? -5 : 2), 0, 100);

  // New results
  const results = {
    totalSales,
    baseSales,
    incrementalSales: finalRevenue,
    traffic: Math.floor(totalTraffic),
    leads,
    conversions,
    channelContributions,
    channelRoi
  };

  // Return new state
  return {
    tick: previousState.tick + 1,
    industry: previousState.industry ?? configuredIndustry,
    marketConditions,
    adstock: newAdstock,
    results,
    stressMeters,
    brandPosition: currentBrandPos,
    trustMultiplier,
    flowState: newFlowState
  };
}

/**
 * Initialize simulation state
 */
export function initializeSimulationState(options?: { industry?: Industry }): SimulationState {
  const initialAdstock: Record<Channel, number> = {
    tv: 0, radio: 0, print: 0, digital: 0, social: 0, seo: 0, events: 0, pr: 0
  };

  const initialMarketConditions: MarketConditions = {
    seasonalityIndex: 1.0,
    competitorSpend: { tv: 50000, radio: 30000, print: 20000, digital: 80000, social: 40000, seo: 20000, events: 10000, pr: 15000 },
    economicIndex: 1.0
  };

  return {
    tick: 0,
    industry: options?.industry ?? ("healthcare" as Industry),
    marketConditions: initialMarketConditions,
    adstock: initialAdstock,
    stressMeters: {
      ceo: 75,
      cfo: 75,
      cmo: 75
    },
    brandPosition: {
      x: 50,
      y: 50
    },
    trustMultiplier: 1.0,
    flowState: 50,
    results: {
      totalSales: 100000,
      baseSales: 100000,
      incrementalSales: 0,
      traffic: 0,
      leads: 0,
      conversions: 0,
      channelContributions: initialAdstock,
      channelRoi: initialAdstock
    }
  };
}
