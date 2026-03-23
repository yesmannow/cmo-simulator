import { simulateCompetitiveResponse, calculateCompetitiveIntensity } from '../competitive';

describe('Competitive Response Model', () => {
  const createMockContext = (overrides: any = {}) => ({
    yourMarketShare: 5,
    yourSpend: 100000,
    competitorSpend: 200000,
    marketLandscape: 'crowded' as const,
    yourGrowthRate: 0.1,
    quarter: 1,
    yourBrandEquity: 50,
    competitorBrandEquity: 50,
    ...overrides
  });

  it('should calculate competitive response based on spending and market share', () => {
    const context = createMockContext();
    const response = simulateCompetitiveResponse(context);

    // Initial competitor spend was 200k, should increase because we are spending and gain share
    expect(response).toBeGreaterThan(200000);
  });

  it('should react more aggressively if your growth rate is high (>15%)', () => {
    const highGrowth = simulateCompetitiveResponse(createMockContext({ yourGrowthRate: 0.2 }));
    const lowGrowth = simulateCompetitiveResponse(createMockContext({ yourGrowthRate: 0.05 }));

    expect(highGrowth).toBeGreaterThan(lowGrowth);
  });

  it('should react more aggressively in a disruptor landscape', () => {
    const disruptor = simulateCompetitiveResponse(createMockContext({ marketLandscape: 'disruptor' }));
    const frontier = simulateCompetitiveResponse(createMockContext({ marketLandscape: 'frontier' }));

    expect(disruptor).toBeGreaterThan(frontier);
  });

  it('should calculate competitive intensity correctly', () => {
    const highIntensity = calculateCompetitiveIntensity(10000, 50000, 30);
    const lowIntensity = calculateCompetitiveIntensity(50000, 10000, 5);

    expect(highIntensity).toBeGreaterThan(lowIntensity);
  });

  it('should reduce response if you have strong brand defense', () => {
    const strongBrand = simulateCompetitiveResponse(createMockContext({ yourBrandEquity: 90 }));
    const weakBrand = simulateCompetitiveResponse(createMockContext({ yourBrandEquity: 10 }));

    expect(strongBrand).toBeLessThan(weakBrand);
  });
});
