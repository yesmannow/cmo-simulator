import { applyHillTransform } from '../saturation/applyHillTransform';

describe('applyHillTransform', () => {
  it('should apply Hill transform correctly', () => {
    // At saturation point, should be 0.5
    expect(applyHillTransform(100, 100, 2)).toBeCloseTo(0.5);
    // Low spend, low response
    expect(applyHillTransform(10, 100, 2)).toBeLessThan(0.5);
    // High spend, high response approaching 1
    expect(applyHillTransform(1000, 100, 2)).toBeGreaterThan(0.9);
  });
});
