import { Channel } from '../../types/engine';

/**
 * Synergy matrix: multipliers for channel interactions
 * Values > 1 indicate synergy, < 1 indicate cannibalization
 */
const SYNERGY_MATRIX: Record<Channel, Record<Channel, number>> = {
  tv: { tv: 1, radio: 1.1, print: 1.05, digital: 1.2, social: 1.15, seo: 1.1, events: 1.05, pr: 1.2 },
  radio: { tv: 1.1, radio: 1, print: 1.1, digital: 1.05, social: 1.1, seo: 1.05, events: 1.05, pr: 1.1 },
  print: { tv: 1.05, radio: 1.1, print: 1, digital: 1.05, social: 1.05, seo: 1.05, events: 1.05, pr: 1.1 },
  digital: { tv: 1.2, radio: 1.05, print: 1.05, digital: 1, social: 1.1, seo: 1.2, events: 1.1, pr: 1.15 },
  social: { tv: 1.15, radio: 1.1, print: 1.05, digital: 1.1, social: 1, seo: 1.1, events: 1.2, pr: 1.1 },
  seo: { tv: 1.1, radio: 1.05, print: 1.05, digital: 1.2, social: 1.1, seo: 1, events: 1.05, pr: 1.1 },
  events: { tv: 1.05, radio: 1.05, print: 1.05, digital: 1.1, social: 1.2, seo: 1.05, events: 1, pr: 1.15 },
  pr: { tv: 1.2, radio: 1.1, print: 1.1, digital: 1.15, social: 1.1, seo: 1.1, events: 1.15, pr: 1 }
};

/**
 * Calculate synergy multiplier for a channel based on active channels
 * @param channel The channel to calculate for
 * @param activeChannels List of active channels (with spend > 0)
 * @returns Synergy multiplier
 */
export function calculateSynergyMultiplier(
  channel: Channel,
  activeChannels: Channel[]
): number {
  let multiplier = 1;
  for (const activeChannel of activeChannels) {
    if (activeChannel !== channel) {
      multiplier *= SYNERGY_MATRIX[channel][activeChannel];
    }
  }
  return multiplier;
}

/**
 * Apply synergy multipliers to channel responses
 * @param responses Base responses per channel
 * @param activeChannels Channels with spend > 0
 * @returns Adjusted responses with synergy
 */
export function applySynergy(
  responses: Record<Channel, number>,
  activeChannels: Channel[]
): Record<Channel, number> {
  const adjusted: Record<Channel, number> = {} as Record<Channel, number>;
  for (const channel in responses) {
    const synergyMultiplier = calculateSynergyMultiplier(channel as Channel, activeChannels);
    adjusted[channel as Channel] = responses[channel as Channel] * synergyMultiplier;
  }
  return adjusted;
}
