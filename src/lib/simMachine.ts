import { createMachine, assign } from 'xstate';
import { TalentCandidate, BigBetOption, calculateTalentImpact, calculateBigBetOutcome } from './talentMarket';

// Types for simulation context and events
export interface SimulationContext {
  // Simulation metadata
  simulationId?: string;
  userId?: string;
  startedAt?: Date;
  
  // Strategic decisions
  strategy: {
    targetAudience?: string;
    brandPositioning?: string;
    primaryChannels?: string[];
    budgetAllocation?: Record<string, number>;
  };
  
  // Quarterly data
  quarters: {
    Q1: QuarterData;
    Q2: QuarterData;
    Q3: QuarterData;
    Q4: QuarterData;
  };
  
  // Overall simulation metrics
  totalBudget: number;
  remainingBudget: number;
  
  // KPIs tracking
  kpis: {
    revenue: number;
    profit: number;
    marketShare: number;
    customerSatisfaction: number;
    brandAwareness: number;
  };
  
  // Wildcard events
  wildcards: WildcardEvent[];
  
  // Talent and Big Bets
  hiredTalent: TalentCandidate[];
  selectedBigBet?: BigBetOption;
  bigBetOutcome?: BigBetOutcome;
  
  // Enhanced KPIs
  morale: number;
  brandEquity: number;
  
  // Simulation results
  finalResults?: SimulationResults;
}

export interface QuarterData {
  tactics: Tactic[];
  budgetSpent: number;
  timeSpent: number;
  wildcardEvents: WildcardEvent[];
  talentHired?: TalentCandidate[];
  bigBetMade?: BigBetOption;
  results: QuarterResultsBreakdown;
}

export interface QuarterResultsBreakdown {
  revenue: number;
  profit: number;
  marketShare: number;
  customerSatisfaction: number;
  brandAwareness: number;
  moraleDelta: number;
  brandEquityDelta: number;
  momentumMultiplier: number;
  channelEfficiencies: Record<string, number>;
  saturationLevels: Record<string, number>;
  fatiguePenalty: number;
  baseRevenue: number;
  baseBrandAwareness: number;
  wildcardContribution: {
    revenue: number;
    profit: number;
    marketShare: number;
    customerSatisfaction: number;
    brandAwareness: number;
    morale: number;
    brandEquity: number;
  };
}

export interface Tactic {
  id: string;
  name: string;
  category: 'digital' | 'traditional' | 'content' | 'events' | 'partnerships';
  cost: number;
  timeRequired: number;
  expectedImpact: {
    revenue: number;
    marketShare: number;
    customerSatisfaction: number;
    brandAwareness: number;
  };
}

export interface WildcardEvent {
  id: string;
  type: 'opportunity' | 'crisis' | 'market_shift' | 'competitor_action';
  title: string;
  description: string;
  choices: WildcardChoice[];
  selectedChoice?: string;
  impact?: {
    revenue: number;
    profit: number;
    marketShare?: number;
    customerSatisfaction?: number;
    brandAwareness?: number;
    morale?: number;
    brandEquity?: number;
  };
  triggeredInQuarter?: string;
  chosenResponse?: string;
}

export interface BigBetOutcome {
  success: boolean;
  actualImpact: {
    revenue: number;
    marketShare: number;
    brandAwareness: number;
    customerSatisfaction: number;
  };
}

export interface WildcardChoice {
  id: string;
  title: string;
  description: string;
  cost: number;
  timeRequired: number;
  impact: {
    revenue: number;
    profit: number;
    marketShare: number;
    customerSatisfaction: number;
    brandAwareness: number;
  };
}

export interface SimulationResults {
  finalKPIs: {
    revenue: number;
    profit: number;
    marketShare: number;
    customerSatisfaction: number;
    brandAwareness: number;
    morale: number;
    brandEquity: number;
  };
  quarterlyBreakdown: Record<string, QuarterData>;
  strategicDecisions: any[];
  wildcardEvents: WildcardEvent[];
  recommendations: string[];
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  intermediateMetrics: {
    quarterlyMomentum: Record<string, number>;
    channelEfficiencies: Record<string, Record<string, number>>;
    seoCompounding: number;
    adFatiguePenalty: number;
    moraleTrajectory: number[];
    brandEquityTrajectory: number[];
  };
}

// Event types
export type SimulationEvent =
  | { type: 'START_SIMULATION'; userId: string }
  | { type: 'SET_STRATEGY'; strategy: Partial<SimulationContext['strategy']> }
  | { type: 'COMPLETE_STRATEGY_SESSION' }
  | { type: 'START_QUARTER'; quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4' }
  | { type: 'ADD_TACTIC'; quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'; tactic: Tactic }
  | { type: 'REMOVE_TACTIC'; quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'; tacticId: string }
  | { type: 'ALLOCATE_BUDGET'; quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'; amount: number }
  | { type: 'ALLOCATE_TIME'; quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'; hours: number }
  | { type: 'TRIGGER_WILDCARD'; quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'; wildcard: WildcardEvent }
  | { type: 'RESPOND_TO_WILDCARD'; wildcardId: string; choiceId: string }
  | { type: 'COMPLETE_QUARTER'; quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4' }
  | { type: 'CALCULATE_RESULTS' }
  | { type: 'COMPLETE_DEBRIEF' }
  | { type: 'RESTART_SIMULATION' }
  | { type: 'SAVE_SIMULATION' };

const createEmptyQuarterResults = (): QuarterResultsBreakdown => ({
  revenue: 0,
  profit: 0,
  marketShare: 0,
  customerSatisfaction: 0,
  brandAwareness: 0,
  moraleDelta: 0,
  brandEquityDelta: 0,
  momentumMultiplier: 1,
  channelEfficiencies: {},
  saturationLevels: {},
  fatiguePenalty: 0,
  baseRevenue: 0,
  baseBrandAwareness: 0,
  wildcardContribution: {
    revenue: 0,
    profit: 0,
    marketShare: 0,
    customerSatisfaction: 0,
    brandAwareness: 0,
    morale: 0,
    brandEquity: 0,
  },
});

// Initial context
const initialContext: SimulationContext = {
  strategy: {},
  quarters: {
    Q1: {
      tactics: [],
      budgetSpent: 0,
      timeSpent: 0,
      wildcardEvents: [],
      results: createEmptyQuarterResults(),
    },
    Q2: {
      tactics: [],
      budgetSpent: 0,
      timeSpent: 0,
      wildcardEvents: [],
      results: createEmptyQuarterResults(),
    },
    Q3: {
      tactics: [],
      budgetSpent: 0,
      timeSpent: 0,
      wildcardEvents: [],
      results: createEmptyQuarterResults(),
    },
    Q4: {
      tactics: [],
      budgetSpent: 0,
      timeSpent: 0,
      wildcardEvents: [],
      results: createEmptyQuarterResults(),
    },
  },
  totalBudget: 2000000,
  remainingBudget: 2000000,
  kpis: {
    revenue: 0,
    profit: 0,
    marketShare: 10,
    customerSatisfaction: 70,
    brandAwareness: 30,
  },
  wildcards: [],
  hiredTalent: [],
  morale: 75,
  brandEquity: 50,
};

// Simulation state machine
export const simulationMachine = createMachine({
  id: 'cmoSimulation',
  initial: 'idle',
  context: initialContext,
  states: {
    idle: {
      on: {
        START_SIMULATION: {
          target: 'strategySession',
          actions: assign({
            userId: ({ event }) => event.userId,
            startedAt: () => new Date(),
          }),
        },
      },
    },
    
    strategySession: {
      on: {
        SET_STRATEGY: {
          actions: assign({
            strategy: ({ context, event }) => ({
              ...context.strategy,
              ...event.strategy,
            }),
          }),
        },
        COMPLETE_STRATEGY_SESSION: {
          target: 'Q1',
          guard: ({ context }) => {
            // Ensure minimum strategy requirements are met
            return !!(
              context.strategy.targetAudience &&
              context.strategy.brandPositioning &&
              context.strategy.primaryChannels?.length
            );
          },
        },
      },
    },
    
    Q1: {
      on: {
        ADD_TACTIC: {
          guard: ({ event }) => event.quarter === 'Q1',
          actions: assign({
            quarters: ({ context, event }) => ({
              ...context.quarters,
              Q1: {
                ...context.quarters.Q1,
                tactics: [...context.quarters.Q1.tactics, event.tactic],
              },
            }),
            remainingBudget: ({ context, event }) => 
              context.remainingBudget - event.tactic.cost,
          }),
        },
        REMOVE_TACTIC: {
          guard: ({ event }) => event.quarter === 'Q1',
          actions: assign({
            quarters: ({ context, event }) => {
              const tactic = context.quarters.Q1.tactics.find(t => t.id === event.tacticId);
              return {
                ...context.quarters,
                Q1: {
                  ...context.quarters.Q1,
                  tactics: context.quarters.Q1.tactics.filter(t => t.id !== event.tacticId),
                },
              };
            },
            remainingBudget: ({ context, event }) => {
              const tactic = context.quarters.Q1.tactics.find(t => t.id === event.tacticId);
              return context.remainingBudget + (tactic?.cost || 0);
            },
          }),
        },
        TRIGGER_WILDCARD: {
          guard: ({ event }) => event.quarter === 'Q1',
          actions: assign({
            quarters: ({ context, event }) => ({
              ...context.quarters,
              Q1: {
                ...context.quarters.Q1,
                wildcardEvents: [...context.quarters.Q1.wildcardEvents, event.wildcard],
              },
            }),
          }),
        },
        RESPOND_TO_WILDCARD: {
          actions: assign((context, event) => {
            if (event.type !== 'RESPOND_TO_WILDCARD') return {};

            const wildcard = context.quarters.Q1.wildcardEvents.find(w => w.id === event.wildcardId);
            if (!wildcard) return {};

            const choice = wildcard.choices.find(c => c.id === event.choiceId);
            if (!choice) return {};

            const resolvedImpact = resolveWildcardImpact(wildcard, choice, context);

            return {
              quarters: {
                ...context.quarters,
                Q1: {
                  ...context.quarters.Q1,
                  wildcardEvents: context.quarters.Q1.wildcardEvents.map(w =>
                    w.id === event.wildcardId
                      ? {
                          ...w,
                          selectedChoice: event.choiceId,
                          impact: resolvedImpact,
                        }
                      : w
                  ),
                },
              },
              remainingBudget: context.remainingBudget - (choice.cost || 0),
              morale: clamp((context.morale ?? 0) + (resolvedImpact.morale ?? 0), 0, 100),
              brandEquity: clamp((context.brandEquity ?? 0) + (resolvedImpact.brandEquity ?? 0), 0, 100),
            };
          }),
        },
        COMPLETE_QUARTER: {
          target: 'Q2',
          guard: ({ event }) => event.quarter === 'Q1',
          actions: assign((context, event) => {
            if (event.type !== 'COMPLETE_QUARTER') return {};

            const q1Results = calculateQuarterResults(context.quarters.Q1, context);

            return {
              quarters: {
                ...context.quarters,
                Q1: {
                  ...context.quarters.Q1,
                  results: q1Results,
                },
              },
              kpis: {
                revenue: context.kpis.revenue + q1Results.revenue,
                profit: context.kpis.profit + q1Results.profit,
                marketShare: clamp(context.kpis.marketShare + q1Results.marketShare, 0, 100),
                customerSatisfaction: clamp(
                  context.kpis.customerSatisfaction + q1Results.customerSatisfaction,
                  0,
                  100
                ),
                brandAwareness: clamp(context.kpis.brandAwareness + q1Results.brandAwareness, 0, 100),
              },
              morale: clamp(context.morale + q1Results.moraleDelta, 0, 100),
              brandEquity: clamp(context.brandEquity + q1Results.brandEquityDelta, 0, 100),
            };
          }),
        },
      },
    },
    
    Q2: {
      on: {
        ADD_TACTIC: {
          guard: ({ event }) => event.quarter === 'Q2',
          actions: assign({
            quarters: ({ context, event }) => ({
              ...context.quarters,
              Q2: {
                ...context.quarters.Q2,
                tactics: [...context.quarters.Q2.tactics, event.tactic],
              },
            }),
            remainingBudget: ({ context, event }) => 
              context.remainingBudget - event.tactic.cost,
          }),
        },
        REMOVE_TACTIC: {
          guard: ({ event }) => event.quarter === 'Q2',
          actions: assign({
            quarters: ({ context, event }) => {
              const tactic = context.quarters.Q2.tactics.find(t => t.id === event.tacticId);
              return {
                ...context.quarters,
                Q2: {
                  ...context.quarters.Q2,
                  tactics: context.quarters.Q2.tactics.filter(t => t.id !== event.tacticId),
                },
              };
            },
            remainingBudget: ({ context, event }) => {
              const tactic = context.quarters.Q2.tactics.find(t => t.id === event.tacticId);
              return context.remainingBudget + (tactic?.cost || 0);
            },
          }),
        },
        TRIGGER_WILDCARD: {
          guard: ({ event }) => event.quarter === 'Q2',
          actions: assign({
            quarters: ({ context, event }) => ({
              ...context.quarters,
              Q2: {
                ...context.quarters.Q2,
                wildcardEvents: [...context.quarters.Q2.wildcardEvents, event.wildcard],
              },
            }),
          }),
        },
        RESPOND_TO_WILDCARD: {
          actions: assign((context, event) => {
            if (event.type !== 'RESPOND_TO_WILDCARD') return {};

            const wildcard = context.quarters.Q2.wildcardEvents.find(w => w.id === event.wildcardId);
            if (!wildcard) return {};

            const choice = wildcard.choices.find(c => c.id === event.choiceId);
            if (!choice) return {};

            const resolvedImpact = resolveWildcardImpact(wildcard, choice, context);

            return {
              quarters: {
                ...context.quarters,
                Q2: {
                  ...context.quarters.Q2,
                  wildcardEvents: context.quarters.Q2.wildcardEvents.map(w =>
                    w.id === event.wildcardId
                      ? {
                          ...w,
                          selectedChoice: event.choiceId,
                          impact: resolvedImpact,
                        }
                      : w
                  ),
                },
              },
              remainingBudget: context.remainingBudget - (choice.cost || 0),
              morale: clamp((context.morale ?? 0) + (resolvedImpact.morale ?? 0), 0, 100),
              brandEquity: clamp((context.brandEquity ?? 0) + (resolvedImpact.brandEquity ?? 0), 0, 100),
            };
          }),
        },
        COMPLETE_QUARTER: {
          target: 'Q3',
          guard: ({ event }) => event.quarter === 'Q2',
          actions: assign((context, event) => {
            if (event.type !== 'COMPLETE_QUARTER') return {};

            const q2Results = calculateQuarterResults(context.quarters.Q2, context);

            return {
              quarters: {
                ...context.quarters,
                Q2: {
                  ...context.quarters.Q2,
                  results: q2Results,
                },
              },
              kpis: {
                revenue: context.kpis.revenue + q2Results.revenue,
                profit: context.kpis.profit + q2Results.profit,
                marketShare: clamp(context.kpis.marketShare + q2Results.marketShare, 0, 100),
                customerSatisfaction: clamp(
                  context.kpis.customerSatisfaction + q2Results.customerSatisfaction,
                  0,
                  100
                ),
                brandAwareness: clamp(context.kpis.brandAwareness + q2Results.brandAwareness, 0, 100),
              },
              morale: clamp(context.morale + q2Results.moraleDelta, 0, 100),
              brandEquity: clamp(context.brandEquity + q2Results.brandEquityDelta, 0, 100),
            };
          }),
        },
      },
    },
    
    Q3: {
      on: {
        ADD_TACTIC: {
          guard: ({ event }) => event.quarter === 'Q3',
          actions: assign({
            quarters: ({ context, event }) => ({
              ...context.quarters,
              Q3: {
                ...context.quarters.Q3,
                tactics: [...context.quarters.Q3.tactics, event.tactic],
              },
            }),
            remainingBudget: ({ context, event }) => 
              context.remainingBudget - event.tactic.cost,
          }),
        },
        REMOVE_TACTIC: {
          guard: ({ event }) => event.quarter === 'Q3',
          actions: assign({
            quarters: ({ context, event }) => {
              const tactic = context.quarters.Q3.tactics.find(t => t.id === event.tacticId);
              return {
                ...context.quarters,
                Q3: {
                  ...context.quarters.Q3,
                  tactics: context.quarters.Q3.tactics.filter(t => t.id !== event.tacticId),
                },
              };
            },
            remainingBudget: ({ context, event }) => {
              const tactic = context.quarters.Q3.tactics.find(t => t.id === event.tacticId);
              return context.remainingBudget + (tactic?.cost || 0);
            },
          }),
        },
        TRIGGER_WILDCARD: {
          guard: ({ event }) => event.quarter === 'Q3',
          actions: assign({
            quarters: ({ context, event }) => ({
              ...context.quarters,
              Q3: {
                ...context.quarters.Q3,
                wildcardEvents: [...context.quarters.Q3.wildcardEvents, event.wildcard],
              },
            }),
          }),
        },
        RESPOND_TO_WILDCARD: {
          actions: assign((context, event) => {
            if (event.type !== 'RESPOND_TO_WILDCARD') return {};

            const wildcard = context.quarters.Q3.wildcardEvents.find(w => w.id === event.wildcardId);
            if (!wildcard) return {};

            const choice = wildcard.choices.find(c => c.id === event.choiceId);
            if (!choice) return {};

            const resolvedImpact = resolveWildcardImpact(wildcard, choice, context);

            return {
              quarters: {
                ...context.quarters,
                Q3: {
                  ...context.quarters.Q3,
                  wildcardEvents: context.quarters.Q3.wildcardEvents.map(w =>
                    w.id === event.wildcardId
                      ? {
                          ...w,
                          selectedChoice: event.choiceId,
                          impact: resolvedImpact,
                        }
                      : w
                  ),
                },
              },
              remainingBudget: context.remainingBudget - (choice.cost || 0),
              morale: clamp((context.morale ?? 0) + (resolvedImpact.morale ?? 0), 0, 100),
              brandEquity: clamp((context.brandEquity ?? 0) + (resolvedImpact.brandEquity ?? 0), 0, 100),
            };
          }),
        },
        COMPLETE_QUARTER: {
          target: 'Q4',
          guard: ({ event }) => event.quarter === 'Q3',
          actions: assign((context, event) => {
            if (event.type !== 'COMPLETE_QUARTER') return {};

            const q3Results = calculateQuarterResults(context.quarters.Q3, context);

            return {
              quarters: {
                ...context.quarters,
                Q3: {
                  ...context.quarters.Q3,
                  results: q3Results,
                },
              },
              kpis: {
                revenue: context.kpis.revenue + q3Results.revenue,
                profit: context.kpis.profit + q3Results.profit,
                marketShare: clamp(context.kpis.marketShare + q3Results.marketShare, 0, 100),
                customerSatisfaction: clamp(
                  context.kpis.customerSatisfaction + q3Results.customerSatisfaction,
                  0,
                  100
                ),
                brandAwareness: clamp(context.kpis.brandAwareness + q3Results.brandAwareness, 0, 100),
              },
              morale: clamp(context.morale + q3Results.moraleDelta, 0, 100),
              brandEquity: clamp(context.brandEquity + q3Results.brandEquityDelta, 0, 100),
            };
          }),
        },
      },
    },
    
    Q4: {
      on: {
        ADD_TACTIC: {
          guard: ({ event }) => event.quarter === 'Q4',
          actions: assign({
            quarters: ({ context, event }) => ({
              ...context.quarters,
              Q4: {
                ...context.quarters.Q4,
                tactics: [...context.quarters.Q4.tactics, event.tactic],
              },
            }),
            remainingBudget: ({ context, event }) => 
              context.remainingBudget - event.tactic.cost,
          }),
        },
        REMOVE_TACTIC: {
          guard: ({ event }) => event.quarter === 'Q4',
          actions: assign({
            quarters: ({ context, event }) => {
              const tactic = context.quarters.Q4.tactics.find(t => t.id === event.tacticId);
              return {
                ...context.quarters,
                Q4: {
                  ...context.quarters.Q4,
                  tactics: context.quarters.Q4.tactics.filter(t => t.id !== event.tacticId),
                },
              };
            },
            remainingBudget: ({ context, event }) => {
              const tactic = context.quarters.Q4.tactics.find(t => t.id === event.tacticId);
              return context.remainingBudget + (tactic?.cost || 0);
            },
          }),
        },
        TRIGGER_WILDCARD: {
          guard: ({ event }) => event.quarter === 'Q4',
          actions: assign({
            quarters: ({ context, event }) => ({
              ...context.quarters,
              Q4: {
                ...context.quarters.Q4,
                wildcardEvents: [...context.quarters.Q4.wildcardEvents, event.wildcard],
              },
            }),
          }),
        },
        RESPOND_TO_WILDCARD: {
          actions: assign((context, event) => {
            if (event.type !== 'RESPOND_TO_WILDCARD') return {};

            const wildcard = context.quarters.Q4.wildcardEvents.find(w => w.id === event.wildcardId);
            if (!wildcard) return {};

            const choice = wildcard.choices.find(c => c.id === event.choiceId);
            if (!choice) return {};

            const resolvedImpact = resolveWildcardImpact(wildcard, choice, context);

            return {
              quarters: {
                ...context.quarters,
                Q4: {
                  ...context.quarters.Q4,
                  wildcardEvents: context.quarters.Q4.wildcardEvents.map(w =>
                    w.id === event.wildcardId
                      ? {
                          ...w,
                          selectedChoice: event.choiceId,
                          impact: resolvedImpact,
                        }
                      : w
                  ),
                },
              },
              remainingBudget: context.remainingBudget - (choice.cost || 0),
              morale: clamp((context.morale ?? 0) + (resolvedImpact.morale ?? 0), 0, 100),
              brandEquity: clamp((context.brandEquity ?? 0) + (resolvedImpact.brandEquity ?? 0), 0, 100),
            };
          }),
        },
        COMPLETE_QUARTER: {
          target: 'debrief',
          guard: ({ event }) => event.quarter === 'Q4',
          actions: assign((context, event) => {
            if (event.type !== 'COMPLETE_QUARTER') return {};

            const q4Results = calculateQuarterResults(context.quarters.Q4, context);

            return {
              quarters: {
                ...context.quarters,
                Q4: {
                  ...context.quarters.Q4,
                  results: q4Results,
                },
              },
              kpis: {
                revenue: context.kpis.revenue + q4Results.revenue,
                profit: context.kpis.profit + q4Results.profit,
                marketShare: clamp(context.kpis.marketShare + q4Results.marketShare, 0, 100),
                customerSatisfaction: clamp(
                  context.kpis.customerSatisfaction + q4Results.customerSatisfaction,
                  0,
                  100
                ),
                brandAwareness: clamp(context.kpis.brandAwareness + q4Results.brandAwareness, 0, 100),
              },
              morale: clamp(context.morale + q4Results.moraleDelta, 0, 100),
              brandEquity: clamp(context.brandEquity + q4Results.brandEquityDelta, 0, 100),
            };
          }),
        },
      },
    },
    
    debrief: {
      entry: assign({
        finalResults: ({ context }) => calculateFinalResults(context),
      }),
      on: {
        COMPLETE_DEBRIEF: {
          target: 'completed',
        },
        SAVE_SIMULATION: {
          // This would trigger a side effect to save to database
          actions: () => {
            // Side effect: save simulation to database
          },
        },
      },
    },
    
    completed: {
      on: {
        RESTART_SIMULATION: {
          target: 'idle',
          actions: assign(() => initialContext),
        },
      },
    },
  },
});

// Helper functions for calculations
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function roundTo(value: number, precision = 2) {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

function resolveWildcardImpact(
  wildcard: WildcardEvent,
  choice: WildcardChoice,
  context: SimulationContext
) {
  const baseImpact = choice.impact;
  const typeModifier =
    wildcard.type === 'crisis' ? 0.85 : wildcard.type === 'opportunity' ? 1.15 : 1;
  const resilience = 0.8 + (context.morale / 100) * 0.2;
  const brandMomentum = 0.85 + (context.brandEquity / 100) * 0.25;
  const awarenessBias = wildcard.type === 'market_shift' ? 1.05 : 1;

  const revenueDelta = baseImpact.revenue * typeModifier * brandMomentum;
  const profitDelta = baseImpact.profit * (0.9 * typeModifier + 0.1 * brandMomentum);
  const marketShareDelta = (baseImpact.marketShare ?? 0) * (0.85 * typeModifier + 0.15 * resilience);
  const satisfactionDelta = (baseImpact.customerSatisfaction ?? 0) * resilience;
  const awarenessDelta = (baseImpact.brandAwareness ?? 0) * awarenessBias * brandMomentum;

  const moraleShift =
    (wildcard.type === 'crisis' ? -2.5 : wildcard.type === 'opportunity' ? 2.5 : 0) +
    satisfactionDelta / 12 +
    profitDelta / 150000 -
    (choice.cost > 0 ? choice.cost / 250000 : 0);

  const brandShift =
    awarenessDelta / 14 +
    (wildcard.type === 'competitor_action' ? -1.5 : 0) +
    (wildcard.type === 'opportunity' ? 1 : 0);

  return {
    revenue: roundTo(revenueDelta),
    profit: roundTo(profitDelta),
    marketShare: roundTo(marketShareDelta),
    customerSatisfaction: roundTo(satisfactionDelta),
    brandAwareness: roundTo(awarenessDelta),
    morale: roundTo(clamp(moraleShift, -8, 8)),
    brandEquity: roundTo(clamp(brandShift, -6, 6)),
  };
}

function calculateQuarterResults(quarter: QuarterData, context: SimulationContext): QuarterResultsBreakdown {
  const channelConfigs: Record<string, { baseline: number; scale: number; fatigueStart: number; fatigueWeight: number; min: number; max: number }> = {
    digital: { baseline: 0.55, scale: 1 / 250000, fatigueStart: 0.7, fatigueWeight: 0.22, min: 0.45, max: 1.25 },
    traditional: { baseline: 0.5, scale: 1 / 320000, fatigueStart: 0.65, fatigueWeight: 0.18, min: 0.4, max: 1.15 },
    content: { baseline: 0.6, scale: 1 / 180000, fatigueStart: 0.85, fatigueWeight: 0.12, min: 0.5, max: 1.3 },
    events: { baseline: 0.65, scale: 1 / 120000, fatigueStart: 0.9, fatigueWeight: 0.08, min: 0.5, max: 1.2 },
    partnerships: { baseline: 0.58, scale: 1 / 200000, fatigueStart: 0.8, fatigueWeight: 0.14, min: 0.5, max: 1.25 },
    default: { baseline: 0.55, scale: 1 / 220000, fatigueStart: 0.8, fatigueWeight: 0.12, min: 0.45, max: 1.2 },
  };

  const spendByCategory: Record<string, number> = {};
  quarter.tactics.forEach(tactic => {
    spendByCategory[tactic.category] = (spendByCategory[tactic.category] ?? 0) + tactic.cost;
  });

  const channelEfficiencies: Record<string, number> = {};
  const saturationLevels: Record<string, number> = {};
  let fatigueFactor = 0;

  Object.entries(spendByCategory).forEach(([category, spend]) => {
    const config = channelConfigs[category] ?? channelConfigs.default;
    const saturation = spend <= 0 ? 0 : 1 - Math.exp(-spend * config.scale);
    const efficiency = config.baseline + (1 - config.baseline) * saturation;
    const normalizedEfficiency = clamp(efficiency, config.min, config.max);

    channelEfficiencies[category] = roundTo(normalizedEfficiency, 3);
    saturationLevels[category] = roundTo(saturation, 3);

    if (saturation > config.fatigueStart) {
      fatigueFactor += (saturation - config.fatigueStart) * config.fatigueWeight;
    }
  });

  const aggregated = {
    revenue: 0,
    profit: 0,
    marketShare: 0,
    customerSatisfaction: 0,
    brandAwareness: 0,
  };

  quarter.tactics.forEach(tactic => {
    const config = channelConfigs[tactic.category] ?? channelConfigs.default;
    const efficiency = channelEfficiencies[tactic.category] ?? config.baseline;

    const revenueImpact = tactic.expectedImpact.revenue * efficiency;
    const marketShareImpact = tactic.expectedImpact.marketShare * (0.7 + 0.3 * efficiency);
    const satisfactionImpact = tactic.expectedImpact.customerSatisfaction * (0.85 + 0.15 * efficiency);
    const awarenessImpact = tactic.expectedImpact.brandAwareness * efficiency;

    aggregated.revenue += revenueImpact;
    aggregated.marketShare += marketShareImpact;
    aggregated.customerSatisfaction += satisfactionImpact;
    aggregated.brandAwareness += awarenessImpact;
    aggregated.profit += revenueImpact - tactic.cost;
  });

  const baseRevenue = aggregated.revenue;
  const baseBrandAwareness = aggregated.brandAwareness;

  const wildcardContribution = {
    revenue: 0,
    profit: 0,
    marketShare: 0,
    customerSatisfaction: 0,
    brandAwareness: 0,
    morale: 0,
    brandEquity: 0,
  };

  quarter.wildcardEvents.forEach(wildcard => {
    if (!wildcard.impact) return;

    wildcardContribution.revenue += wildcard.impact.revenue;
    wildcardContribution.profit += wildcard.impact.profit;
    wildcardContribution.marketShare += wildcard.impact.marketShare ?? 0;
    wildcardContribution.customerSatisfaction += wildcard.impact.customerSatisfaction ?? 0;
    wildcardContribution.brandAwareness += wildcard.impact.brandAwareness ?? 0;
    wildcardContribution.morale += wildcard.impact.morale ?? 0;
    wildcardContribution.brandEquity += wildcard.impact.brandEquity ?? 0;

    aggregated.revenue += wildcard.impact.revenue;
    aggregated.profit += wildcard.impact.profit;
    aggregated.marketShare += wildcard.impact.marketShare ?? 0;
    aggregated.customerSatisfaction += wildcard.impact.customerSatisfaction ?? 0;
    aggregated.brandAwareness += wildcard.impact.brandAwareness ?? 0;
  });

  const revenueFatigue = baseRevenue * Math.min(0.25, fatigueFactor);
  aggregated.revenue = Math.max(0, aggregated.revenue - revenueFatigue);
  aggregated.profit -= revenueFatigue * 0.55;
  const awarenessFatigue = Math.min(0.12, fatigueFactor * 0.5);
  aggregated.brandAwareness *= 1 - awarenessFatigue;

  const moraleMomentum = 0.85 + (context.morale / 100) * 0.35;
  const brandMomentum = 0.8 + (context.brandEquity / 100) * 0.3;
  const satisfactionMomentum = 0.9 + (context.kpis.customerSatisfaction / 100) * 0.1;
  const momentumMultiplier = clamp(
    moraleMomentum * 0.5 + brandMomentum * 0.35 + satisfactionMomentum * 0.15,
    0.7,
    1.35
  );

  aggregated.revenue *= momentumMultiplier;
  aggregated.profit *= 0.9 + 0.1 * momentumMultiplier;
  aggregated.marketShare *= 0.92 + 0.08 * momentumMultiplier;
  aggregated.customerSatisfaction *= 0.95 + 0.05 * moraleMomentum;
  aggregated.brandAwareness *= 0.9 + 0.1 * brandMomentum;

  const moraleDelta = clamp(
    aggregated.profit / 250000 + (aggregated.customerSatisfaction - 70) / 45,
    -5,
    5
  );

  const brandEquityDelta = clamp(
    (aggregated.brandAwareness - baseBrandAwareness) / 8 + (momentumMultiplier - 1) * 10,
    -4,
    6
  );

  return {
    revenue: roundTo(aggregated.revenue),
    profit: roundTo(aggregated.profit),
    marketShare: roundTo(aggregated.marketShare),
    customerSatisfaction: roundTo(aggregated.customerSatisfaction),
    brandAwareness: roundTo(aggregated.brandAwareness),
    moraleDelta: roundTo(moraleDelta),
    brandEquityDelta: roundTo(brandEquityDelta),
    momentumMultiplier: roundTo(momentumMultiplier, 3),
    channelEfficiencies,
    saturationLevels,
    fatiguePenalty: roundTo(revenueFatigue),
    baseRevenue: roundTo(baseRevenue),
    baseBrandAwareness: roundTo(baseBrandAwareness),
    wildcardContribution: {
      revenue: roundTo(wildcardContribution.revenue),
      profit: roundTo(wildcardContribution.profit),
      marketShare: roundTo(wildcardContribution.marketShare),
      customerSatisfaction: roundTo(wildcardContribution.customerSatisfaction),
      brandAwareness: roundTo(wildcardContribution.brandAwareness),
      morale: roundTo(wildcardContribution.morale),
      brandEquity: roundTo(wildcardContribution.brandEquity),
    },
  };
}

function calculateFinalResults(context: SimulationContext): SimulationResults {
  const allWildcards = [
    ...context.quarters.Q1.wildcardEvents,
    ...context.quarters.Q2.wildcardEvents,
    ...context.quarters.Q3.wildcardEvents,
    ...context.quarters.Q4.wildcardEvents,
  ];

  const quarterKeys: Array<keyof SimulationContext['quarters']> = ['Q1', 'Q2', 'Q3', 'Q4'];
  const quarterlyMomentum: Record<string, number> = {};
  const channelEfficiencies: Record<string, Record<string, number>> = {};
  const moraleTrajectory: number[] = [];
  const brandEquityTrajectory: number[] = [];

  let totalMomentum = 0;
  let momentumCount = 0;
  let aggregatedContentEfficiency = 0;
  let contentCount = 0;
  let aggregatedFatigue = 0;

  let moraleTracker = initialContext.morale;
  let brandEquityTracker = initialContext.brandEquity;

  quarterKeys.forEach(key => {
    const quarter = context.quarters[key];
    const results = quarter?.results;
    if (!results) return;

    quarterlyMomentum[key] = results.momentumMultiplier;
    channelEfficiencies[key] = { ...results.channelEfficiencies };

    totalMomentum += results.momentumMultiplier;
    momentumCount += 1;
    aggregatedFatigue += results.fatiguePenalty;

    const contentEfficiency = results.channelEfficiencies.content;
    if (typeof contentEfficiency === 'number') {
      aggregatedContentEfficiency += contentEfficiency;
      contentCount += 1;
    }

    const wildcardMorale = quarter.wildcardEvents.reduce((sum, wildcard) => sum + (wildcard.impact?.morale ?? 0), 0);
    const wildcardBrand = quarter.wildcardEvents.reduce((sum, wildcard) => sum + (wildcard.impact?.brandEquity ?? 0), 0);

    moraleTracker = clamp(moraleTracker + wildcardMorale + results.moraleDelta, 0, 100);
    brandEquityTracker = clamp(brandEquityTracker + wildcardBrand + results.brandEquityDelta, 0, 100);

    moraleTrajectory.push(roundTo(moraleTracker));
    brandEquityTrajectory.push(roundTo(brandEquityTracker));
  });

  const averageMomentum = momentumCount > 0 ? totalMomentum / momentumCount : 1;
  const averageContentEfficiency = contentCount > 0 ? aggregatedContentEfficiency / contentCount : 0.6;
  const contentLift = Math.max(0, averageContentEfficiency - 0.6);
  const seoCompounding = 1 + Math.min(0.25, contentLift * 0.5 + (context.brandEquity / 100) * 0.15);
  const revenueBase = Math.max(context.kpis.revenue, 1);
  const adFatiguePenalty = Math.min(18, (aggregatedFatigue / revenueBase) * 100);

  const revenueScore = clamp(Math.log10(context.kpis.revenue + 1) * 20, 0, 100);
  const profitScore = clamp(Math.log10(Math.max(context.kpis.profit, 0) + 1) * 18, 0, 100);
  const marketShareScore = clamp(context.kpis.marketShare, 0, 100);
  const satisfactionScore = clamp(context.kpis.customerSatisfaction, 0, 100);
  const awarenessScore = clamp(context.kpis.brandAwareness * seoCompounding, 0, 110);
  const moraleScore = clamp(context.morale, 0, 100);
  const brandEquityScore = clamp(context.brandEquity * (0.9 + contentLift * 0.2), 0, 110);

  const weightedScore =
    revenueScore * 0.22 +
    profitScore * 0.12 +
    marketShareScore * 0.18 +
    satisfactionScore * 0.16 +
    awarenessScore * 0.12 +
    moraleScore * 0.1 +
    brandEquityScore * 0.1;

  const compoundedScore = weightedScore * averageMomentum;
  const adjustedScore = clamp(compoundedScore - adFatiguePenalty, 0, 100);
  const score = Math.round(adjustedScore);

  // Determine grade
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';
  else grade = 'F';
  
  // Generate recommendations based on performance
  const recommendations = generateRecommendations(context);

  return {
    finalKPIs: {
      revenue: context.kpis.revenue,
      profit: context.kpis.profit,
      marketShare: context.kpis.marketShare,
      customerSatisfaction: context.kpis.customerSatisfaction,
      brandAwareness: context.kpis.brandAwareness,
      morale: context.morale,
      brandEquity: context.brandEquity,
    },
    quarterlyBreakdown: context.quarters,
    strategicDecisions: [context.strategy],
    wildcardEvents: allWildcards,
    recommendations,
    score,
    grade,
    intermediateMetrics: {
      quarterlyMomentum,
      channelEfficiencies,
      seoCompounding: roundTo(seoCompounding, 3),
      adFatiguePenalty: roundTo(adFatiguePenalty),
      moraleTrajectory,
      brandEquityTrajectory,
    },
  };
}

function generateRecommendations(context: SimulationContext): string[] {
  const recommendations: string[] = [];

  if (context.kpis.revenue < 500000) {
    recommendations.push("Focus on revenue-generating tactics like digital advertising and partnerships.");
  }

  if (context.kpis.marketShare < 15) {
    recommendations.push("Increase market share through competitive pricing and brand differentiation.");
  }

  if (context.kpis.customerSatisfaction < 70) {
    recommendations.push("Invest in customer experience improvements and support initiatives.");
  }

  if (context.kpis.brandAwareness < 40) {
    recommendations.push("Boost brand awareness through content marketing and social media campaigns.");
  }

  if (context.morale < 60) {
    recommendations.push("Team morale dipped. Reinforce internal communication and recognize wins to restore momentum.");
  }

  if (context.brandEquity < 45) {
    recommendations.push("Brand equity is lagging. Reinforce storytelling and consistency across key touchpoints.");
  }

  const quarterValues = Object.values(context.quarters);
  const fatigueIssue = quarterValues.some(q => q.results.baseRevenue > 0 && q.results.fatiguePenalty > q.results.baseRevenue * 0.15);
  if (fatigueIssue) {
    recommendations.push("Ad fatigue is eroding returns. Rotate creative or rebalance toward higher-efficiency channels.");
  }

  const momentumValues = quarterValues
    .map(q => q.results.momentumMultiplier)
    .filter(multiplier => typeof multiplier === 'number');
  if (momentumValues.length > 0) {
    const averageMomentum = momentumValues.reduce((sum, multiplier) => sum + multiplier, 0) / momentumValues.length;
    if (averageMomentum < 0.95) {
      recommendations.push("Overall momentum is soft. Align talent and incentives to re-energize execution.");
    }
  }

  if (context.remainingBudget > context.totalBudget * 0.2) {
    recommendations.push("You left significant budget unused. Consider more aggressive marketing investments.");
  }

  return recommendations;
}
