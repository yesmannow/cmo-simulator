import { describe, it, expect } from '@jest/globals';
import { calculateAdvancedROI, getIndustryCLV, type ROIContext } from '../roi';

describe('ROI Model (CLV-based)', () => {
  const createMockContext = (overrides: Partial<ROIContext> = {}): ROIContext => ({
    immediateRevenue: 500000,
    spend: 200000,
    customerAcquisitions: 1000,
    avgCLV: 5000,
    retentionRate: 0.8,
    brandEquity: 50,
    industry: 'healthcare',
    ...overrides
  });

  it('should calculate both immediate and long-term ROI', () => {
    const context = createMockContext();
    const result = calculateAdvancedROI(context);

    // Immediate ROI = (500k - 200k) / 200k = 1.5 (150%)
    expect(result.immediateROI).toBe(150);
    // Long-term ROI should be significantly higher due to CLV
    expect(result.longTermROI).toBeGreaterThan(result.immediateROI);
    // Weighted ROI should be between them (40/60 split)
    expect(result.weightedROI).toBeGreaterThan(result.immediateROI);
    expect(result.weightedROI).toBeLessThan(result.longTermROI);
  });

  it('should reward brand equity with CLV multiplier', () => {
    const highBrand = calculateAdvancedROI(createMockContext({ brandEquity: 90 }));
    const lowBrand = calculateAdvancedROI(createMockContext({ brandEquity: 10 }));

    expect(highBrand.clvMultiplier).toBeGreaterThan(lowBrand.clvMultiplier);
    expect(highBrand.longTermROI).toBeGreaterThan(lowBrand.longTermROI);
  });

  it('should return correct industry benchmarks', () => {
    const healthcare = getIndustryCLV('healthcare');
    const ecommerce = getIndustryCLV('ecommerce');

    expect(healthcare.avgCLV).toBeGreaterThan(ecommerce.avgCLV);
    expect(healthcare.retentionRate).toBeGreaterThan(ecommerce.retentionRate);
  });

  it('should handle zero spend gracefully', () => {
    const result = calculateAdvancedROI(createMockContext({ spend: 0 }));
    expect(result.immediateROI).toBe(0);
    expect(result.weightedROI).toBe(0);
  });
});
