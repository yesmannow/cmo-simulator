import { Channel } from '../../types/engine';

/**
 * Apply Hill transform (saturation curve) to adstocked spend
 * Response = (Adstock^n) / (S^n + Adstock^n)
 * @param adstockedSpend Adstocked spend value
 * @param saturationPoint S (half-saturation point)
 * @param shape n (Hill coefficient)
 * @returns Response value (0 to 1)
 */
export function applyHillTransform(
  adstockedSpend: number,
  saturationPoint: number,
  shape: number
): number {
  const numerator = Math.pow(adstockedSpend, shape);
  const denominator = Math.pow(saturationPoint, shape) + numerator;
  return numerator / denominator;
}

/**
 * Apply Hill transform to all channels
 * @param adstockedSpends Adstocked spend per channel
 * @param saturationPoints Saturation point per channel
 * @param shapes Shape parameter per channel
 * @returns Response per channel (0 to 1)
 */
export function applyHillTransformAll(
  adstockedSpends: Record<Channel, number>,
  saturationPoints: Record<Channel, number>,
  shapes: Record<Channel, number>
): Record<Channel, number> {
  const responses: Record<Channel, number> = {} as Record<Channel, number>;
  for (const channel in adstockedSpends) {
    responses[channel as Channel] = applyHillTransform(
      adstockedSpends[channel as Channel],
      saturationPoints[channel as Channel],
      shapes[channel as Channel]
    );
  }
  return responses;
}
