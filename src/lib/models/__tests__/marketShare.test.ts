import { calculateMarketShareBass, calculateMarketMaturity } from '../marketShare';

describe('Market Share Model (Bass Diffusion)', () => {
  const createMockContext = (overrides: any = {}) => ({
    currentShare: 5,
    yourSpend: 100000,
    competitorSpend: 200000,
    brandEquity: 50,
    marketMaturity: 0.3,
    quartersElapsed: 1,
    previousShares: [5],
    ...overrides
  });

  it('should calculate growth based on Bass Diffusion parameters', () => {
    const context = createMockContext();
    const newShare = calculateMarketShareBass(context);

    // Initial share was 5, should grow because we have spend and brand equity
    expect(newShare).toBeGreaterThan(5);
    expect(newShare).toBeLessThan(100);
  });

  it('should reward high brand equity with more innovation adoption', () => {
    const highEquity = calculateMarketShareBass(createMockContext({ brandEquity: 90 }));
    const lowEquity = calculateMarketShareBass(createMockContext({ brandEquity: 10 }));

    expect(highEquity).toBeGreaterThan(lowEquity);
  });

  it('should penalize growth in mature markets', () => {
    const matureMarket = calculateMarketShareBass(createMockContext({ marketMaturity: 0.9 }));
    const emergingMarket = calculateMarketShareBass(createMockContext({ marketMaturity: 0.1 }));

    // Growth amount should be less in mature market
    const growthMature = matureMarket - 5;
    const growthEmerging = emergingMarket - 5;
    expect(growthMature).toBeLessThan(growthEmerging);
  });

  it('should calculate market maturity correctly using sigmoid curve', () => {
    const lowMaturity = calculateMarketMaturity(100000, 1000000); // 10% saturation
    const highMaturity = calculateMarketMaturity(900000, 1000000); // 90% saturation

    expect(lowMaturity).toBeLessThan(0.5);
    expect(highMaturity).toBeGreaterThan(0.5);
  });

  it('should apply competitive penalty if competitors outspend significantly', () => {
    const heavyCompetition = calculateMarketShareBass(createMockContext({ 
      yourSpend: 10000, 
      competitorSpend: 50000 
    }));
    const lightCompetition = calculateMarketShareBass(createMockContext({ 
      yourSpend: 10000, 
      competitorSpend: 10000 
    }));

    expect(heavyCompetition).toBeLessThan(lightCompetition);
  });
});
