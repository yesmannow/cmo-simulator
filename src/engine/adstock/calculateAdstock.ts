import { Channel } from '../../types/engine';

/**
 * Calculate geometric adstock for a channel
 * Adstock_t = Spend_t + λ * Adstock_{t-1}
 * @param currentSpend Current period spend
 * @param previousAdstock Previous period adstock
 * @param decayRate λ (between 0 and 1)
 * @returns New adstock value
 */
export function calculateAdstock(
  currentSpend: number,
  previousAdstock: number,
  decayRate: number
): number {
  return currentSpend + decayRate * previousAdstock;
}

/**
 * Calculate adstock for all channels
 * @param currentSpends Current spend per channel
 * @param previousAdstock Previous adstock per channel
 * @param decayRates Decay rate per channel
 * @returns New adstock per channel
 */
export function calculateAdstockAll(
  currentSpends: Record<Channel, number>,
  previousAdstock: Record<Channel, number>,
  decayRates: Record<Channel, number>
): Record<Channel, number> {
  const newAdstock: Record<Channel, number> = {} as Record<Channel, number>;
  for (const channel in currentSpends) {
    newAdstock[channel as Channel] = calculateAdstock(
      currentSpends[channel as Channel],
      previousAdstock[channel as Channel],
      decayRates[channel as Channel]
    );
  }
  return newAdstock;
}
