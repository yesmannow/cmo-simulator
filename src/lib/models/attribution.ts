/**
 * Multi-Touch Attribution Models
 * Implements various attribution models for fair credit distribution
 *
 * Priority: P0 (Foundation for advanced analytics)
 */

export type Channel =
  | 'google-ads'
  | 'facebook-ads'
  | 'content-marketing'
  | 'seo'
  | 'email'
  | 'social'
  | 'events'
  | 'pr'
  | 'influencer'
  | 'traditional';

export type AttributionModelType =
  | 'first-touch'
  | 'last-touch'
  | 'linear'
  | 'time-decay'
  | 'position-based'
  | 'data-driven';

export interface Touchpoint {
  channel: Channel;
  timestamp: number; // Days before conversion
  spend: number;
  interaction: 'view' | 'click' | 'engagement';
  touchpointNumber: number; // Position in journey (1 = first, 2 = second, etc.)
}

export interface AttributionResult {
  channelAttribution: Record<Channel, number>; // Attribution weights (sum to 1.0)
  totalAttribution: number; // Should equal 1.0
  model: AttributionModelType;
}

/**
 * Calculate multi-touch attribution based on model type
 */
export function calculateAttribution(
  touchpoints: Touchpoint[],
  model: AttributionModelType
): AttributionResult {
  if (touchpoints.length === 0) {
    return {
      channelAttribution: {},
      totalAttribution: 0,
      model
    };
  }

  let channelAttribution: Record<Channel, number> = {};

  switch (model) {
    case 'first-touch':
      channelAttribution = calculateFirstTouch(touchpoints);
      break;
    case 'last-touch':
      channelAttribution = calculateLastTouch(touchpoints);
      break;
    case 'linear':
      channelAttribution = calculateLinear(touchpoints);
      break;
    case 'time-decay':
      channelAttribution = calculateTimeDecay(touchpoints);
      break;
    case 'position-based':
      channelAttribution = calculatePositionBased(touchpoints);
      break;
    case 'data-driven':
      channelAttribution = calculateShapleyValue(touchpoints);
      break;
  }

  // Normalize to ensure sum equals 1.0
  const total = Object.values(channelAttribution).reduce((sum, val) => sum + val, 0);
  if (total > 0) {
    Object.keys(channelAttribution).forEach(channel => {
      channelAttribution[channel as Channel] /= total;
    });
  }

  return {
    channelAttribution,
    totalAttribution: Object.values(channelAttribution).reduce((sum, val) => sum + val, 0),
    model
  };
}

/**
 * First-Touch Attribution: 100% credit to first touchpoint
 */
function calculateFirstTouch(touchpoints: Touchpoint[]): Record<Channel, number> {
  const first = touchpoints[0];
  return { [first.channel]: 1.0 };
}

/**
 * Last-Touch Attribution: 100% credit to last touchpoint
 */
function calculateLastTouch(touchpoints: Touchpoint[]): Record<Channel, number> {
  const last = touchpoints[touchpoints.length - 1];
  return { [last.channel]: 1.0 };
}

/**
 * Linear Attribution: Equal credit to all touchpoints
 */
function calculateLinear(touchpoints: Touchpoint[]): Record<Channel, number> {
  const equalWeight = 1 / touchpoints.length;
  const attribution: Record<Channel, number> = {};

  touchpoints.forEach(tp => {
    attribution[tp.channel] = (attribution[tp.channel] || 0) + equalWeight;
  });

  return attribution;
}

/**
 * Time-Decay Attribution: More credit to recent touchpoints
 * Uses exponential decay with configurable half-life
 */
function calculateTimeDecay(
  touchpoints: Touchpoint[],
  halfLifeDays: number = 7
): Record<Channel, number> {
  const attribution: Record<Channel, number> = {};

  // Calculate weights using exponential decay
  const weights = touchpoints.map(tp => {
    const daysAgo = tp.timestamp;
    return Math.exp(-daysAgo / halfLifeDays);
  });

  // Normalize weights
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  touchpoints.forEach((tp, i) => {
    const normalizedWeight = weights[i] / totalWeight;
    attribution[tp.channel] = (attribution[tp.channel] || 0) + normalizedWeight;
  });

  return attribution;
}

/**
 * Position-Based Attribution: 40% first, 40% last, 20% distributed
 * Also known as "U-shaped" attribution
 */
function calculatePositionBased(touchpoints: Touchpoint[]): Record<Channel, number> {
  const attribution: Record<Channel, number> = {};
  const firstWeight = 0.4;
  const lastWeight = 0.4;
  const middleWeight = touchpoints.length > 2
    ? 0.2 / (touchpoints.length - 2)
    : 0;

  touchpoints.forEach((tp, i) => {
    let weight = 0;
    if (i === 0) {
      weight = firstWeight;
    } else if (i === touchpoints.length - 1) {
      weight = lastWeight;
    } else {
      weight = middleWeight;
    }

    attribution[tp.channel] = (attribution[tp.channel] || 0) + weight;
  });

  return attribution;
}

/**
 * Shapley Value Attribution (Data-Driven)
 * Game theory approach: Fair credit distribution based on marginal contributions
 *
 * This is computationally expensive but provides the most fair attribution
 */
function calculateShapleyValue(touchpoints: Touchpoint[]): Record<Channel, number> {
  const channels = [...new Set(touchpoints.map(tp => tp.channel))];
  const shapleyValues: Record<Channel, number> = {};

  // For each channel, calculate its Shapley value
  channels.forEach(channel => {
    const channelTouches = touchpoints.filter(tp => tp.channel === channel);
    let totalContribution = 0;

    // Generate all possible subsets (coalitions)
    const allSubsets = generateSubsets(touchpoints);

    allSubsets.forEach(subset => {
      const withoutChannel = subset.filter(tp => tp.channel !== channel);
      const withChannel = [...withoutChannel, ...channelTouches];

      // Calculate marginal contribution
      const valueWithout = calculateConversionValue(withoutChannel);
      const valueWith = calculateConversionValue(withChannel);
      const marginalContribution = valueWith - valueWithout;

      // Weight by coalition size (Shapley formula)
      const n = touchpoints.length;
      const s = withoutChannel.length;
      const weight = factorial(s) * factorial(n - s - 1) / factorial(n);

      totalContribution += marginalContribution * weight;
    });

    shapleyValues[channel] = totalContribution;
  });

  return shapleyValues;
}

/**
 * Calculate conversion value for a set of touchpoints
 * This is a simplified model - in production, this would use actual conversion data
 */
function calculateConversionValue(touchpoints: Touchpoint[]): number {
  if (touchpoints.length === 0) return 0;

  // Base conversion rate
  let conversionRate = 0.05; // 5% base

  // Each touchpoint increases conversion probability
  touchpoints.forEach(tp => {
    const channelMultiplier = getChannelMultiplier(tp.channel);
    const recencyMultiplier = Math.exp(-tp.timestamp / 30); // 30-day decay
    conversionRate += 0.02 * channelMultiplier * recencyMultiplier;
  });

  // Cap at 25% max conversion rate
  return Math.min(conversionRate, 0.25);
}

/**
 * Get channel-specific multiplier for conversion
 */
function getChannelMultiplier(channel: Channel): number {
  const multipliers: Record<Channel, number> = {
    'google-ads': 1.2,
    'facebook-ads': 1.1,
    'content-marketing': 0.9,
    'seo': 0.8,
    'email': 1.3,
    'social': 1.0,
    'events': 1.5,
    'pr': 0.7,
    'influencer': 1.4,
    'traditional': 0.6
  };

  return multipliers[channel] || 1.0;
}

/**
 * Generate all possible subsets of touchpoints
 * Used for Shapley value calculation
 */
function generateSubsets<T>(arr: T[]): T[][] {
  const subsets: T[][] = [[]];

  for (const item of arr) {
    const newSubsets = subsets.map(subset => [...subset, item]);
    subsets.push(...newSubsets);
  }

  return subsets;
}

/**
 * Calculate factorial (for Shapley value weights)
 */
function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Compare attribution models side-by-side
 */
export function compareAttributionModels(
  touchpoints: Touchpoint[]
): Record<AttributionModelType, AttributionResult> {
  const models: AttributionModelType[] = [
    'first-touch',
    'last-touch',
    'linear',
    'time-decay',
    'position-based',
    'data-driven'
  ];

  const results: Record<AttributionModelType, AttributionResult> = {} as any;

  models.forEach(model => {
    results[model] = calculateAttribution(touchpoints, model);
  });

  return results;
}

/**
 * Calculate revenue attribution by channel
 */
export function calculateRevenueAttribution(
  touchpoints: Touchpoint[],
  totalRevenue: number,
  model: AttributionModelType
): Record<Channel, number> {
  const attribution = calculateAttribution(touchpoints, model);
  const revenueAttribution: Record<Channel, number> = {};

  Object.entries(attribution.channelAttribution).forEach(([channel, weight]) => {
    revenueAttribution[channel as Channel] = totalRevenue * weight;
  });

  return revenueAttribution;
}

