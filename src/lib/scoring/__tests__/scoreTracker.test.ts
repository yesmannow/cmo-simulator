import { createScoreTracker, updateScoreTracker } from '../scoreTracker';
import { SimulationState } from '../../simulationEngine';

describe('Score Tracker', () => {
  const createMockState = (overrides: Partial<SimulationState> = {}): SimulationState => ({
    totalBudget: 1000000,
    budgetRemaining: 500000,
    totalRevenue: 300000,
    totalProfit: -200000,
    currentMarketShare: 6,
    brandEquity: 55,
    teamMorale: 85,
    marketSaturation: 0.25,
    competitorSpend: 1200000,
    quarterlyResults: [
      {
        quarter: 'Q1',
        tacticsUsed: [],
        budgetSpent: 250000,
        teamHoursUsed: 150,
        timeSpent: 12,
        results: {
          revenue: 150000,
          profit: -100000,
          marketShare: 5.5,
          customerSatisfaction: 75,
          brandAwareness: 52
        },
        trafficSources: { organic: 2000, paid: 5000, social: 1000, referral: 500 }
      },
      {
        quarter: 'Q2',
        tacticsUsed: [],
        budgetSpent: 250000,
        teamHoursUsed: 150,
        timeSpent: 12,
        results: {
          revenue: 200000,
          profit: -50000,
          marketShare: 6.2,
          customerSatisfaction: 80,
          brandAwareness: 58
        },
        trafficSources: { organic: 2500, paid: 6000, social: 1500, referral: 800 }
      }
    ],
    config: {
      difficulty: 'intermediate',
      industry: 'healthcare',
      companyProfile: 'startup',
      marketLandscape: 'disruptor',
      timeHorizon: '1-year',
      budgetAllocation: { brandAwareness: 30, leadGeneration: 40, conversionOptimization: 30 }
    },
    ...overrides
  } as any);

  it('should create a score tracker with correct current score and projections', () => {
    const state = createMockState();
    const historicalScores = [1000, 1500];
    const tracker = createScoreTracker(state, historicalScores);

    expect(tracker.currentScore).toBeGreaterThan(0);
    expect(tracker.projectedScore).toBeGreaterThan(0);
    expect(tracker.scoreVelocity).toBe(500); // 1500 - 1000
    expect(tracker.trend).toBe('improving');
  });

  it('should identify milestones correctly', () => {
    const state = createMockState({ totalRevenue: 950000 });
    const tracker = createScoreTracker(state);

    const firstMillion = tracker.milestones.find(m => m.id === 'first_million');
    expect(firstMillion).toBeDefined();
    expect(firstMillion?.progress).toBeGreaterThan(90);
  });

  it('should update tracker with new score', () => {
    const state = createMockState();
    const tracker = createScoreTracker(state, [1000, 1500]);
    const updated = updateScoreTracker(tracker, 2200);

    expect(updated.currentScore).toBe(2200);
    expect(updated.scoreVelocity).toBe(700); // 2200 - 1500
  });

  it('should assign correct rank based on score', () => {
    const state = createMockState();
    const tracker = createScoreTracker(state);

    // Score for our mock state is around 2000-3000
    // Rank should be 'Marketing Manager' or 'Senior CMO'
    const validRanks = ['Marketing Manager', 'Senior CMO', 'Expert Strategist', 'Master Marketer', 'Legendary CMO'];
    expect(validRanks).toContain(tracker.rank);
  });
});
