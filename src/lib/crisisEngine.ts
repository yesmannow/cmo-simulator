import { SimulationState } from '../types/engine';
// Leveraging the types from advancedWildcards but we build the stochastic trigger logic here

export const BLACK_SWAN_EVENTS = [
  {
    id: 'black-swan-customer-data',
    type: 'internal-crisis' as const,
    severity: 'critical' as const,
    title: 'Critical: Customer data incident',
    description:
      'A third-party vendor compromise exposed a large share of customer records. Press and regulators are asking for scope, timelines, and concrete remediation.',
    context:
      'Customer data incidents compress trust. The trust multiplier stays depressed until the response looks coordinated and funded.',
    triggeredInQuarter: 'Q2' as const,
    choices: [
      {
        id: 'transparent-response',
        title: 'Launch Radical Transparency Campaign',
        description: 'Spend heavily on proactive communication, credit monitoring, and infrastructure fixes.',
        budgetCost: 250000,
        timeCost: 150,
        impact: { revenue: -50000, marketShare: -2, brandEquity: 10, teamMorale: -15, customerSatisfaction: 5 },
        riskLevel: 'low' as const,
        reasoning: 'High upfront cost but preserves long-term trust multiplier.'
      },
      {
        id: 'quiet-fix',
        title: 'Quiet Patch & Minimum Compliance',
        description: 'Only notify those legally required and quietly fix the exploit.',
        budgetCost: 50000,
        timeCost: 40,
        impact: { revenue: -150000, marketShare: -5, brandEquity: -30, teamMorale: -5, customerSatisfaction: -20 },
        riskLevel: 'high' as const,
        reasoning: 'Saves budget but absolutely destroys consumer trust and increases churn probability.'
      }
    ]
  },
  {
    id: 'black-swan-product-recall',
    type: 'internal-crisis' as const,
    severity: 'critical' as const,
    title: '💥 PRODUCT FATAL FLAW: Major Recall',
    description: 'The aggressive speed-to-market strategy bypassed QA. A critical product defect is causing physical harm or massive data loss to users.',
    context: 'Moving too fast breaks things. When trust drops, your marketing dollars become highly inefficient.',
    triggeredInQuarter: 'Q3' as const,
    choices: [
      {
        id: 'full-recall',
        title: 'Full Product Recall & Media Apology',
        description: 'Pull all defective inventory and pause all marketing until fixed.',
        budgetCost: 150000,
        timeCost: 100,
        impact: { revenue: -200000, marketShare: -4, brandEquity: 5, teamMorale: -20, customerSatisfaction: 10 },
        riskLevel: 'low' as const,
        reasoning: 'Taking the financial hit upfront is the only way to retain long-term trust.'
      }
    ]
  }
];

export type CrisisEvent = (typeof BLACK_SWAN_EVENTS)[number];

/**
 * Probabilistic engine for determining if a Black Swan event occurs this quarter.
 * Risk increases geometrically with aggressive spending and low trust.
 */
export function evaluateCrisisRisk(state: SimulationState): CrisisEvent | null {
  const currentTrust = state.trustMultiplier ?? 1.0;
  
  // Calculate total marketing mass (adstock) as a proxy for aggression
  const totalAdstock = Object.values(state.adstock || {}).reduce((a, b) => a + b, 0);
  
  // Base probability of a Black Swan event is 2%
  let baseProbability = 0.02;

  // Aggression multiplier: Over $1M adstock increases risk by 2.5x
  if (totalAdstock > 1000000) {
    baseProbability *= 2.5; 
  }

  // Resilience/Trust multiplier: If trust is low (< 0.8), probabilty doubles
  if (currentTrust < 0.8) {
    baseProbability *= 2.0;
  }

  // Roll the dice
  if (Math.random() < baseProbability) {
    // Select a random Black Swan event
    const eventIndex = Math.floor(Math.random() * BLACK_SWAN_EVENTS.length);
    return BLACK_SWAN_EVENTS[eventIndex];
  }

  return null;
}
