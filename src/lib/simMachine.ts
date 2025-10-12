import { createMachine, assign } from 'xstate';
import { TalentCandidate, BigBetOption, calculateTalentImpact, calculateBigBetOutcome } from './talentMarket';

// Types for simulation context and events
export type MarketLandscape = 'stable' | 'emerging' | 'disrupted' | 'hyper-competitive';
export type TimeHorizon = 'short-term' | 'mid-term' | 'long-term';

export interface SimulationContext {
  // Simulation metadata
  simulationId?: string;
  userId?: string;
  startedAt?: Date;
  
  // Strategic decisions
  strategy: {
    companyName?: string;
    industry?: string;
    strategyType?: string;
    targetAudience?: string;
    brandPositioning?: string;
    primaryChannels?: string[];
    budgetAllocation?: Record<string, number>;
    marketLandscape?: MarketLandscape;
    timeHorizon?: TimeHorizon;
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
  aggregatedMetrics?: {
    quarterly: Array<{
      quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
      revenue: number;
      profit: number;
      marketShare: number;
      satisfaction: number;
      awareness: number;
      budgetSpent: number;
    }>;
    totalRevenue: number;
    totalProfit: number;
    totalBudgetSpent: number;
    roiPercentage: number;
  };
  completionTimeMinutes?: number;
}

export interface QuarterData {
  tactics: Tactic[];
  budgetSpent: number;
  timeSpent: number;
  wildcardEvents: WildcardEvent[];
  talentHired?: TalentCandidate[];
  bigBetMade?: BigBetOption;
  results: {
    revenue: number;
    profit: number;
    marketShare: number;
    customerSatisfaction: number;
    brandAwareness: number;
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
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
  moraleImpact?: {
    base: number;
    choiceModifiers: Record<string, number>;
  };
  brandEquityImpact?: {
    base: number;
    choiceModifiers: Record<string, number>;
  };
  teamMoraleDescription?: string;
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
  };
  quarterlyBreakdown: Record<string, QuarterData>;
  strategicDecisions: any[];
  wildcardEvents: WildcardEvent[];
  recommendations: string[];
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
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
  | { type: 'RESPOND_TO_WILDCARD'; quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'; wildcardId: string; choiceId: string }
  | {
      type: 'APPLY_WILDCARD_IMPACT';
      quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
      wildcardId: string;
      choiceId: string;
      impact: {
        revenue: number;
        profit: number;
        marketShare?: number;
        customerSatisfaction?: number;
        brandAwareness?: number;
        morale?: number;
        brandEquity?: number;
      };
    }
  | { type: 'COMPLETE_QUARTER'; quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4' }
  | { type: 'CALCULATE_RESULTS' }
  | { type: 'COMPLETE_DEBRIEF' }
  | { type: 'RESTART_SIMULATION' }
  | { type: 'SAVE_SIMULATION' };

// Initial context
const initialContext: SimulationContext = {
  strategy: {},
  quarters: {
    Q1: {
      tactics: [],
      budgetSpent: 0,
      timeSpent: 0,
      wildcardEvents: [],
      results: {
        revenue: 0,
        profit: 0,
        marketShare: 10,
        customerSatisfaction: 70,
        brandAwareness: 30,
      },
    },
    Q2: {
      tactics: [],
      budgetSpent: 0,
      timeSpent: 0,
      wildcardEvents: [],
      results: {
        revenue: 0,
        profit: 0,
        marketShare: 10,
        customerSatisfaction: 70,
        brandAwareness: 30,
      },
    },
    Q3: {
      tactics: [],
      budgetSpent: 0,
      timeSpent: 0,
      wildcardEvents: [],
      results: {
        revenue: 0,
        profit: 0,
        marketShare: 10,
        customerSatisfaction: 70,
        brandAwareness: 30,
      },
    },
    Q4: {
      tactics: [],
      budgetSpent: 0,
      timeSpent: 0,
      wildcardEvents: [],
      results: {
        revenue: 0,
        profit: 0,
        marketShare: 10,
        customerSatisfaction: 70,
        brandAwareness: 30,
      },
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
                wildcardEvents: [
                  ...context.quarters.Q1.wildcardEvents,
                  { ...event.wildcard, triggeredInQuarter: 'Q1' },
                ],
              },
            }),
          }),
        },
        RESPOND_TO_WILDCARD: {
          guard: ({ event }) => event.quarter === 'Q1',
          actions: assign({
            quarters: ({ context, event }) => {
              const wildcard = context.quarters.Q1.wildcardEvents.find(w => w.id === event.wildcardId);
              if (!wildcard) return context.quarters;

              const choice = wildcard.choices.find(c => c.id === event.choiceId);
              if (!choice) return context.quarters;

              return {
                ...context.quarters,
                Q1: {
                  ...context.quarters.Q1,
                  wildcardEvents: context.quarters.Q1.wildcardEvents.map(w =>
                    w.id === event.wildcardId
                      ? { ...w, selectedChoice: event.choiceId, chosenResponse: event.choiceId }
                      : w
                  ),
                },
              };
            },
            remainingBudget: ({ context, event }) => {
              const wildcard = context.quarters.Q1.wildcardEvents.find(w => w.id === event.wildcardId);
              const choice = wildcard?.choices.find(c => c.id === event.choiceId);
              return context.remainingBudget - (choice?.cost || 0);
            },
          }),
        },
        APPLY_WILDCARD_IMPACT: {
          guard: ({ event }) => event.quarter === 'Q1',
          actions: assign({
            quarters: ({ context, event }) => ({
              ...context.quarters,
              Q1: {
                ...context.quarters.Q1,
                wildcardEvents: context.quarters.Q1.wildcardEvents.map(w =>
                  w.id === event.wildcardId
                    ? { ...w, selectedChoice: event.choiceId, impact: event.impact }
                    : w
                ),
              },
            }),
            morale: ({ context, event }) =>
              Math.max(0, Math.min(100, context.morale + (event.impact.morale || 0))),
            brandEquity: ({ context, event }) =>
              Math.max(0, Math.min(100, context.brandEquity + (event.impact.brandEquity || 0))),
          }),
        },
        COMPLETE_QUARTER: {
          target: 'Q2',
          guard: ({ event }) => event.quarter === 'Q1',
          actions: assign({
            quarters: ({ context }) => {
              // Calculate Q1 results based on tactics and wildcards
              const q1Results = calculateQuarterResults(context.quarters.Q1, context.kpis);
              return {
                ...context.quarters,
                Q1: {
                  ...context.quarters.Q1,
                  results: q1Results,
                },
              };
            },
            kpis: ({ context }) => {
              const q1Results = calculateQuarterResults(context.quarters.Q1, context.kpis);
              return {
                revenue: context.kpis.revenue + q1Results.revenue,
                profit: context.kpis.profit + q1Results.profit,
                marketShare: Math.max(0, Math.min(100, context.kpis.marketShare + q1Results.marketShare)),
                customerSatisfaction: Math.max(0, Math.min(100, context.kpis.customerSatisfaction + q1Results.customerSatisfaction)),
                brandAwareness: Math.max(0, Math.min(100, context.kpis.brandAwareness + q1Results.brandAwareness)),
              };
            },
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
                wildcardEvents: [
                  ...context.quarters.Q2.wildcardEvents,
                  { ...event.wildcard, triggeredInQuarter: 'Q2' },
                ],
              },
            }),
          }),
        },
        RESPOND_TO_WILDCARD: {
          guard: ({ event }) => event.quarter === 'Q2',
          actions: assign({
            quarters: ({ context, event }) => {
              const wildcard = context.quarters.Q2.wildcardEvents.find(w => w.id === event.wildcardId);
              if (!wildcard) return context.quarters;

              const choice = wildcard.choices.find(c => c.id === event.choiceId);
              if (!choice) return context.quarters;

              return {
                ...context.quarters,
                Q2: {
                  ...context.quarters.Q2,
                  wildcardEvents: context.quarters.Q2.wildcardEvents.map(w =>
                    w.id === event.wildcardId
                      ? { ...w, selectedChoice: event.choiceId, chosenResponse: event.choiceId }
                      : w
                  ),
                },
              };
            },
            remainingBudget: ({ context, event }) => {
              const wildcard = context.quarters.Q2.wildcardEvents.find(w => w.id === event.wildcardId);
              const choice = wildcard?.choices.find(c => c.id === event.choiceId);
              return context.remainingBudget - (choice?.cost || 0);
            },
          }),
        },
        APPLY_WILDCARD_IMPACT: {
          guard: ({ event }) => event.quarter === 'Q2',
          actions: assign({
            quarters: ({ context, event }) => ({
              ...context.quarters,
              Q2: {
                ...context.quarters.Q2,
                wildcardEvents: context.quarters.Q2.wildcardEvents.map(w =>
                  w.id === event.wildcardId
                    ? { ...w, selectedChoice: event.choiceId, impact: event.impact }
                    : w
                ),
              },
            }),
            morale: ({ context, event }) =>
              Math.max(0, Math.min(100, context.morale + (event.impact.morale || 0))),
            brandEquity: ({ context, event }) =>
              Math.max(0, Math.min(100, context.brandEquity + (event.impact.brandEquity || 0))),
          }),
        },
        COMPLETE_QUARTER: {
          target: 'Q3',
          guard: ({ event }) => event.quarter === 'Q2',
          actions: assign({
            quarters: ({ context }) => {
              const q2Results = calculateQuarterResults(context.quarters.Q2, context.kpis);
              return {
                ...context.quarters,
                Q2: {
                  ...context.quarters.Q2,
                  results: q2Results,
                },
              };
            },
            kpis: ({ context }) => {
              const q2Results = calculateQuarterResults(context.quarters.Q2, context.kpis);
              return {
                revenue: context.kpis.revenue + q2Results.revenue,
                profit: context.kpis.profit + q2Results.profit,
                marketShare: Math.max(0, Math.min(100, context.kpis.marketShare + q2Results.marketShare)),
                customerSatisfaction: Math.max(0, Math.min(100, context.kpis.customerSatisfaction + q2Results.customerSatisfaction)),
                brandAwareness: Math.max(0, Math.min(100, context.kpis.brandAwareness + q2Results.brandAwareness)),
              };
            },
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
                wildcardEvents: [
                  ...context.quarters.Q3.wildcardEvents,
                  { ...event.wildcard, triggeredInQuarter: 'Q3' },
                ],
              },
            }),
          }),
        },
        RESPOND_TO_WILDCARD: {
          guard: ({ event }) => event.quarter === 'Q3',
          actions: assign({
            quarters: ({ context, event }) => {
              const wildcard = context.quarters.Q3.wildcardEvents.find(w => w.id === event.wildcardId);
              if (!wildcard) return context.quarters;

              const choice = wildcard.choices.find(c => c.id === event.choiceId);
              if (!choice) return context.quarters;

              return {
                ...context.quarters,
                Q3: {
                  ...context.quarters.Q3,
                  wildcardEvents: context.quarters.Q3.wildcardEvents.map(w =>
                    w.id === event.wildcardId
                      ? { ...w, selectedChoice: event.choiceId, chosenResponse: event.choiceId }
                      : w
                  ),
                },
              };
            },
            remainingBudget: ({ context, event }) => {
              const wildcard = context.quarters.Q3.wildcardEvents.find(w => w.id === event.wildcardId);
              const choice = wildcard?.choices.find(c => c.id === event.choiceId);
              return context.remainingBudget - (choice?.cost || 0);
            },
          }),
        },
        APPLY_WILDCARD_IMPACT: {
          guard: ({ event }) => event.quarter === 'Q3',
          actions: assign({
            quarters: ({ context, event }) => ({
              ...context.quarters,
              Q3: {
                ...context.quarters.Q3,
                wildcardEvents: context.quarters.Q3.wildcardEvents.map(w =>
                  w.id === event.wildcardId
                    ? { ...w, selectedChoice: event.choiceId, impact: event.impact }
                    : w
                ),
              },
            }),
            morale: ({ context, event }) =>
              Math.max(0, Math.min(100, context.morale + (event.impact.morale || 0))),
            brandEquity: ({ context, event }) =>
              Math.max(0, Math.min(100, context.brandEquity + (event.impact.brandEquity || 0))),
          }),
        },
        COMPLETE_QUARTER: {
          target: 'Q4',
          guard: ({ event }) => event.quarter === 'Q3',
          actions: assign({
            quarters: ({ context }) => {
              const q3Results = calculateQuarterResults(context.quarters.Q3, context.kpis);
              return {
                ...context.quarters,
                Q3: {
                  ...context.quarters.Q3,
                  results: q3Results,
                },
              };
            },
            kpis: ({ context }) => {
              const q3Results = calculateQuarterResults(context.quarters.Q3, context.kpis);
              return {
                revenue: context.kpis.revenue + q3Results.revenue,
                profit: context.kpis.profit + q3Results.profit,
                marketShare: Math.max(0, Math.min(100, context.kpis.marketShare + q3Results.marketShare)),
                customerSatisfaction: Math.max(0, Math.min(100, context.kpis.customerSatisfaction + q3Results.customerSatisfaction)),
                brandAwareness: Math.max(0, Math.min(100, context.kpis.brandAwareness + q3Results.brandAwareness)),
              };
            },
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
                wildcardEvents: [
                  ...context.quarters.Q4.wildcardEvents,
                  { ...event.wildcard, triggeredInQuarter: 'Q4' },
                ],
              },
            }),
          }),
        },
        RESPOND_TO_WILDCARD: {
          guard: ({ event }) => event.quarter === 'Q4',
          actions: assign({
            quarters: ({ context, event }) => {
              const wildcard = context.quarters.Q4.wildcardEvents.find(w => w.id === event.wildcardId);
              if (!wildcard) return context.quarters;

              const choice = wildcard.choices.find(c => c.id === event.choiceId);
              if (!choice) return context.quarters;

              return {
                ...context.quarters,
                Q4: {
                  ...context.quarters.Q4,
                  wildcardEvents: context.quarters.Q4.wildcardEvents.map(w =>
                    w.id === event.wildcardId
                      ? { ...w, selectedChoice: event.choiceId, chosenResponse: event.choiceId }
                      : w
                  ),
                },
              };
            },
            remainingBudget: ({ context, event }) => {
              const wildcard = context.quarters.Q4.wildcardEvents.find(w => w.id === event.wildcardId);
              const choice = wildcard?.choices.find(c => c.id === event.choiceId);
              return context.remainingBudget - (choice?.cost || 0);
            },
          }),
        },
        APPLY_WILDCARD_IMPACT: {
          guard: ({ event }) => event.quarter === 'Q4',
          actions: assign({
            quarters: ({ context, event }) => ({
              ...context.quarters,
              Q4: {
                ...context.quarters.Q4,
                wildcardEvents: context.quarters.Q4.wildcardEvents.map(w =>
                  w.id === event.wildcardId
                    ? { ...w, selectedChoice: event.choiceId, impact: event.impact }
                    : w
                ),
              },
            }),
            morale: ({ context, event }) =>
              Math.max(0, Math.min(100, context.morale + (event.impact.morale || 0))),
            brandEquity: ({ context, event }) =>
              Math.max(0, Math.min(100, context.brandEquity + (event.impact.brandEquity || 0))),
          }),
        },
        COMPLETE_QUARTER: {
          target: 'debrief',
          guard: ({ event }) => event.quarter === 'Q4',
          actions: assign({
            quarters: ({ context }) => {
              const q4Results = calculateQuarterResults(context.quarters.Q4, context.kpis);
              return {
                ...context.quarters,
                Q4: {
                  ...context.quarters.Q4,
                  results: q4Results,
                },
              };
            },
            kpis: ({ context }) => {
              const q4Results = calculateQuarterResults(context.quarters.Q4, context.kpis);
              return {
                revenue: context.kpis.revenue + q4Results.revenue,
                profit: context.kpis.profit + q4Results.profit,
                marketShare: Math.max(0, Math.min(100, context.kpis.marketShare + q4Results.marketShare)),
                customerSatisfaction: Math.max(0, Math.min(100, context.kpis.customerSatisfaction + q4Results.customerSatisfaction)),
                brandAwareness: Math.max(0, Math.min(100, context.kpis.brandAwareness + q4Results.brandAwareness)),
              };
            },
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
function calculateQuarterResults(quarter: QuarterData, currentKPIs: SimulationContext['kpis']) {
  let results = {
    revenue: 0,
    profit: 0,
    marketShare: 0,
    customerSatisfaction: 0,
    brandAwareness: 0,
  };
  
  // Calculate impact from tactics
  quarter.tactics.forEach(tactic => {
    results.revenue += tactic.expectedImpact.revenue;
    results.marketShare += tactic.expectedImpact.marketShare;
    results.customerSatisfaction += tactic.expectedImpact.customerSatisfaction;
    results.brandAwareness += tactic.expectedImpact.brandAwareness;
    results.profit += tactic.expectedImpact.revenue - tactic.cost; // Simple profit calculation
  });
  
  // Calculate impact from wildcard responses
  quarter.wildcardEvents.forEach(wildcard => {
    if (wildcard.impact) {
      results.revenue += wildcard.impact.revenue;
      results.profit += wildcard.impact.profit;
      currentKPIs.marketShare += wildcard.impact?.marketShare || 0;
      currentKPIs.customerSatisfaction += wildcard.impact?.customerSatisfaction || 0;
      currentKPIs.brandAwareness += wildcard.impact?.brandAwareness || 0;
      // Note: morale and brandEquity are tracked at context level, not in currentKPIs
    }
  });
  
  return results;
}

function calculateFinalResults(context: SimulationContext): SimulationResults {
  const allWildcards = [
    ...context.quarters.Q1.wildcardEvents,
    ...context.quarters.Q2.wildcardEvents,
    ...context.quarters.Q3.wildcardEvents,
    ...context.quarters.Q4.wildcardEvents,
  ];
  
  // Calculate overall score based on KPIs
  const score = Math.round(
    (context.kpis.revenue / 1000000) * 25 + // Revenue weight: 25%
    (context.kpis.marketShare) * 0.25 + // Market share weight: 25%
    (context.kpis.customerSatisfaction) * 0.25 + // Customer satisfaction weight: 25%
    (context.kpis.brandAwareness) * 0.25 // Brand awareness weight: 25%
  );
  
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
    finalKPIs: context.kpis,
    quarterlyBreakdown: context.quarters,
    strategicDecisions: [context.strategy],
    wildcardEvents: allWildcards,
    recommendations,
    score,
    grade,
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
  
  if (context.remainingBudget > context.totalBudget * 0.2) {
    recommendations.push("You left significant budget unused. Consider more aggressive marketing investments.");
  }
  
  return recommendations;
}
