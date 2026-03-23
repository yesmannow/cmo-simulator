import { SimulationContext, Tactic, WildcardEvent, SimulationResults } from '@/lib/simMachine';
import { initializeSimulationState } from '@/engine';

// Mock simulation contexts for testing
export const generateMockSimulationContext = (overrides: Partial<SimulationContext> = {}): SimulationContext => {
  const baseContext: SimulationContext = {
    engineState: initializeSimulationState(),
    remainingBudget: 1000000,
    totalBudget: 1000000,
    kpis: {
      revenue: 0,
      profit: 0,
      marketShare: 10,
      customerSatisfaction: 70,
      brandAwareness: 50,
    },
    hiredTalent: [],
    morale: 80,
    brandEquity: 60,
    strategy: {
      targetAudience: 'Young Professionals',
      brandPositioning: 'Premium Quality',
      primaryChannels: ['Digital Marketing', 'Social Media', 'Content Marketing'],
      marketLandscape: 'stable',
      timeHorizon: 'short-term',
    },
    quarters: {
      Q1: generateMockQuarter('Q1'),
      Q2: generateMockQuarter('Q2'),
      Q3: generateMockQuarter('Q3'),
      Q4: generateMockQuarter('Q4'),
    },
    wildcards: [],
    ...overrides,
  };

  return baseContext;
};

function generateMockQuarter(id: string) {
  return {
    tactics: [],
    budgetSpent: 0,
    timeSpent: 0,
    wildcardEvents: [],
    results: {
      revenue: 0,
      profit: 0,
      marketShare: 10,
      customerSatisfaction: 70,
      brandAwareness: 50,
    },
  };
}

export const generateMockSimulationRuns = (count: number = 5): SimulationContext[] => {
  return Array.from({ length: count }, (_, i) => {
    return generateMockSimulationContext({
       simulationId: `sim-${i}`
    });
  });
};
