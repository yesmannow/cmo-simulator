import { calculateAdvancedScore } from '../advancedScoring';
import { ScoringContext } from '../../scoringEngine';

describe('Advanced Scoring', () => {
  const createMockContext = (overrides: Partial<ScoringContext> = {}): ScoringContext => ({
    timeHorizon: '1-year',
    industry: 'healthcare',
    companyProfile: 'startup',
    marketLandscape: 'disruptor',
    totalBudget: 1000000,
    budgetSpent: 500000,
    annualAllocation: {
      brandAwareness: 30,
      leadGeneration: 40,
      conversionOptimization: 30
    },
    brandEquity: 50,
    teamMorale: 80,
    quarters: [
      {
        quarter: 'Q1',
        tacticsUsed: [],
        budgetSpent: 125000,
        teamHoursUsed: 100,
        timeSpent: 10,
        results: {
          revenue: 200000,
          profit: 75000,
          marketShare: 5.5,
          customerSatisfaction: 70,
          brandAwareness: 50
        },
        trafficSources: { organic: 1000, paid: 2000, social: 500, referral: 200 }
      }
    ],
    competitorSpend: 1000000,
    marketSaturation: 0.3,
    ...overrides
  });

  it('should calculate exponential revenue score', () => {
    const context1M = createMockContext({
      quarters: [{ results: { revenue: 1000000 } } as any]
    });
    const context2M = createMockContext({
      quarters: [{ results: { revenue: 2000000 } } as any]
    });

    const score1M = calculateAdvancedScore(context1M, 'intermediate', 'healthcare');
    const score2M = calculateAdvancedScore(context2M, 'intermediate', 'healthcare');

    // Formula: (revenue/1M)^0.8 * 2000
    // 1M should be ~2000
    // 2M should be (2)^0.8 * 2000 = ~3482
    expect(score1M.revenueScore).toBeCloseTo(2000, -1);
    expect(score2M.revenueScore).toBeGreaterThan(score1M.revenueScore);
    expect(score2M.revenueScore).toBeLessThan(4000); // Not linear (4000)
  });

  it('should apply difficulty multiplier correctly', () => {
    const context = createMockContext();
    const beginner = calculateAdvancedScore(context, 'beginner', 'healthcare');
    const intermediate = calculateAdvancedScore(context, 'intermediate', 'healthcare');
    const advanced = calculateAdvancedScore(context, 'advanced', 'healthcare');

    expect(beginner.totalScore).toBeLessThan(intermediate.totalScore);
    expect(advanced.totalScore).toBeGreaterThan(intermediate.totalScore);
    
    // Multipliers are 0.8, 1.0, 1.3
    expect(beginner.difficultyMultiplier).toBe(0.8);
    expect(intermediate.difficultyMultiplier).toBe(1.0);
    expect(advanced.difficultyMultiplier).toBe(1.3);
  });

  it('should reward strategic balance in funnel allocation', () => {
    const balancedContext = createMockContext({
      annualAllocation: { brandAwareness: 33, leadGeneration: 33, conversionOptimization: 34 }
    });
    const unbalancedContext = createMockContext({
      annualAllocation: { brandAwareness: 90, leadGeneration: 5, conversionOptimization: 5 }
    });

    const balanced = calculateAdvancedScore(balancedContext, 'intermediate', 'healthcare');
    const unbalanced = calculateAdvancedScore(unbalancedContext, 'intermediate', 'healthcare');

    expect(balanced.strategicScore).toBeGreaterThan(unbalanced.strategicScore);
  });

  it('should reward consistent growth with higher consistency score', () => {
    const consistentContext = createMockContext({
      quarters: [
        { results: { revenue: 100000 } },
        { results: { revenue: 150000 } },
        { results: { revenue: 200000 } }
      ] as any
    });
    const inconsistentContext = createMockContext({
      quarters: [
        { results: { revenue: 200000 } },
        { results: { revenue: 150000 } },
        { results: { revenue: 100000 } }
      ] as any
    });

    const consistent = calculateAdvancedScore(consistentContext, 'intermediate', 'healthcare');
    const inconsistent = calculateAdvancedScore(inconsistentContext, 'intermediate', 'healthcare');

    expect(consistent.consistencyScore).toBeGreaterThan(inconsistent.consistencyScore);
  });

  it('should apply industry multipliers correctly', () => {
    const context = createMockContext();
    const healthcare = calculateAdvancedScore(context, 'intermediate', 'healthcare');
    const ecommerce = calculateAdvancedScore(context, 'intermediate', 'ecommerce');

    // Healthcare multiplier is 1.1, Ecommerce is 0.95
    expect(healthcare.industryMultiplier).toBe(1.1);
    expect(ecommerce.industryMultiplier).toBe(0.95);
    expect(healthcare.totalScore).toBeGreaterThan(ecommerce.totalScore);
  });
});
