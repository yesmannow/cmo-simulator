// Enhanced Wildcard System with Dynamic Events and Morale/Brand Equity Impact

import { WildcardEvent, WildcardChoice, type SimulationContext } from './simMachine';

export interface EnhancedWildcardEvent extends WildcardEvent {
  triggerConditions?: {
    minRevenue?: number;
    maxRevenue?: number;
    minMarketShare?: number;
    maxMarketShare?: number;
    quarterSpecific?: ('Q1' | 'Q2' | 'Q3' | 'Q4')[];
    hasHiredTalent?: boolean;
  };
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  moraleImpact: {
    base: number;
    choiceModifiers: Record<string, number>;
  };
  brandEquityImpact: {
    base: number;
    choiceModifiers: Record<string, number>;
  };
  teamMoraleDescription: string;
}

export const ENHANCED_WILDCARDS: EnhancedWildcardEvent[] = [
  {
    id: 'wildcard-enhanced-1',
    type: 'crisis',
    title: 'Data Privacy Scandal',
    description: 'A major data breach has exposed customer information. The media is demanding answers and customers are losing trust.',
    rarity: 'uncommon',
    moraleImpact: {
      base: -20,
      choiceModifiers: {
        'crisis-data-ignore': -30,
        'crisis-data-minimal': -10,
        'crisis-data-comprehensive': +10,
      }
    },
    brandEquityImpact: {
      base: -25,
      choiceModifiers: {
        'crisis-data-ignore': -40,
        'crisis-data-minimal': -15,
        'crisis-data-comprehensive': +5,
      }
    },
    teamMoraleDescription: 'Team is stressed about reputation damage and customer trust.',
    choices: [
      {
        id: 'crisis-data-ignore',
        title: 'Minimal Response',
        description: 'Issue a brief statement and hope it blows over quickly.',
        cost: 25000,
        timeRequired: 10,
        impact: {
          revenue: -200000,
          profit: -25000,
          marketShare: -5,
          customerSatisfaction: -25,
          brandAwareness: -10,
        },
      },
      {
        id: 'crisis-data-minimal',
        title: 'Standard Crisis Management',
        description: 'Hire a PR firm and implement basic security improvements.',
        cost: 150000,
        timeRequired: 40,
        impact: {
          revenue: -100000,
          profit: -150000,
          marketShare: -2,
          customerSatisfaction: -10,
          brandAwareness: -5,
        },
      },
      {
        id: 'crisis-data-comprehensive',
        title: 'Transparency & Innovation',
        description: 'Full transparency, customer compensation, and industry-leading security overhaul.',
        cost: 500000,
        timeRequired: 80,
        impact: {
          revenue: 100000,
          profit: -400000,
          marketShare: 3,
          customerSatisfaction: 20,
          brandAwareness: 15,
        },
      },
    ],
  },
  {
    id: 'wildcard-enhanced-2',
    type: 'opportunity',
    title: 'Viral Social Media Moment',
    description: 'Your brand has unexpectedly gone viral on social media due to a customer\'s creative content. Millions are watching.',
    rarity: 'rare',
    triggerConditions: {
      quarterSpecific: ['Q2', 'Q3'],
    },
    moraleImpact: {
      base: +15,
      choiceModifiers: {
        'viral-ignore': -10,
        'viral-capitalize': +20,
        'viral-overdo': +5,
      }
    },
    brandEquityImpact: {
      base: +10,
      choiceModifiers: {
        'viral-ignore': -5,
        'viral-capitalize': +25,
        'viral-overdo': -10,
      }
    },
    teamMoraleDescription: 'Team is excited about the unexpected positive attention.',
    choices: [
      {
        id: 'viral-ignore',
        title: 'Stay the Course',
        description: 'Don\'t change strategy, let the moment pass naturally.',
        cost: 0,
        timeRequired: 0,
        impact: {
          revenue: 50000,
          profit: 50000,
          marketShare: 1,
          customerSatisfaction: 2,
          brandAwareness: 5,
        },
      },
      {
        id: 'viral-capitalize',
        title: 'Strategic Amplification',
        description: 'Carefully amplify the moment with complementary content and engagement.',
        cost: 100000,
        timeRequired: 30,
        impact: {
          revenue: 400000,
          profit: 300000,
          marketShare: 8,
          customerSatisfaction: 15,
          brandAwareness: 30,
        },
      },
      {
        id: 'viral-overdo',
        title: 'Maximum Exploitation',
        description: 'Go all-in with massive campaigns trying to recreate the viral moment.',
        cost: 300000,
        timeRequired: 60,
        impact: {
          revenue: 200000,
          profit: -100000,
          marketShare: 3,
          customerSatisfaction: -5,
          brandAwareness: 10,
        },
      },
    ],
  },
  {
    id: 'wildcard-enhanced-3',
    type: 'market_shift',
    title: 'Economic Recession Warning',
    description: 'Economic indicators suggest a recession is imminent. Consumer spending is expected to drop significantly.',
    rarity: 'uncommon',
    triggerConditions: {
      quarterSpecific: ['Q3', 'Q4'],
    },
    moraleImpact: {
      base: -15,
      choiceModifiers: {
        'recession-cuts': -25,
        'recession-pivot': -5,
        'recession-invest': +10,
      }
    },
    brandEquityImpact: {
      base: -5,
      choiceModifiers: {
        'recession-cuts': -15,
        'recession-pivot': +5,
        'recession-invest': +15,
      }
    },
    teamMoraleDescription: 'Team is worried about job security and budget cuts.',
    choices: [
      {
        id: 'recession-cuts',
        title: 'Defensive Cost Cutting',
        description: 'Reduce marketing spend and focus on efficiency.',
        cost: -200000, // Negative cost = savings
        timeRequired: 20,
        impact: {
          revenue: -300000,
          profit: 100000,
          marketShare: -8,
          customerSatisfaction: -10,
          brandAwareness: -15,
        },
      },
      {
        id: 'recession-pivot',
        title: 'Value-Focused Messaging',
        description: 'Pivot marketing to emphasize value and affordability.',
        cost: 100000,
        timeRequired: 50,
        impact: {
          revenue: -100000,
          profit: -100000,
          marketShare: 2,
          customerSatisfaction: 10,
          brandAwareness: 5,
        },
      },
      {
        id: 'recession-invest',
        title: 'Counter-Cyclical Investment',
        description: 'Increase marketing investment while competitors retreat.',
        cost: 400000,
        timeRequired: 70,
        impact: {
          revenue: 300000,
          profit: -100000,
          marketShare: 12,
          customerSatisfaction: 5,
          brandAwareness: 20,
        },
      },
    ],
  },
  {
    id: 'wildcard-enhanced-4',
    type: 'opportunity',
    title: 'Industry Innovation Award',
    description: 'Your marketing campaign has been nominated for a prestigious industry award. Winning could boost credibility significantly.',
    rarity: 'rare',
    triggerConditions: {
      minRevenue: 200000,
      quarterSpecific: ['Q3', 'Q4'],
    },
    moraleImpact: {
      base: +20,
      choiceModifiers: {
        'award-ignore': -15,
        'award-participate': +10,
        'award-campaign': +25,
      }
    },
    brandEquityImpact: {
      base: +15,
      choiceModifiers: {
        'award-ignore': -10,
        'award-participate': +10,
        'award-campaign': +30,
      }
    },
    teamMoraleDescription: 'Team is proud of the recognition and motivated to win.',
    choices: [
      {
        id: 'award-ignore',
        title: 'Focus on Business',
        description: 'Ignore the award and focus on core business objectives.',
        cost: 0,
        timeRequired: 0,
        impact: {
          revenue: 0,
          profit: 0,
          marketShare: 0,
          customerSatisfaction: 0,
          brandAwareness: 0,
        },
      },
      {
        id: 'award-participate',
        title: 'Professional Participation',
        description: 'Participate professionally without additional investment.',
        cost: 25000,
        timeRequired: 15,
        impact: {
          revenue: 75000,
          profit: 50000,
          marketShare: 2,
          customerSatisfaction: 5,
          brandAwareness: 10,
        },
      },
      {
        id: 'award-campaign',
        title: 'Full PR Campaign',
        description: 'Launch a comprehensive PR campaign around the nomination.',
        cost: 150000,
        timeRequired: 45,
        impact: {
          revenue: 300000,
          profit: 150000,
          marketShare: 6,
          customerSatisfaction: 12,
          brandAwareness: 25,
        },
      },
    ],
  },
  {
    id: 'wildcard-enhanced-5',
    type: 'competitor_action',
    title: 'Talent Poaching Attempt',
    description: 'A major competitor is aggressively trying to poach your top marketing talent with lucrative offers.',
    rarity: 'common',
    triggerConditions: {
      hasHiredTalent: true,
    },
    moraleImpact: {
      base: -10,
      choiceModifiers: {
        'poaching-ignore': -20,
        'poaching-counter': +5,
        'poaching-invest': +15,
      }
    },
    brandEquityImpact: {
      base: 0,
      choiceModifiers: {
        'poaching-ignore': -5,
        'poaching-counter': 0,
        'poaching-invest': +5,
      }
    },
    teamMoraleDescription: 'Team is unsettled by competitor recruitment efforts.',
    choices: [
      {
        id: 'poaching-ignore',
        title: 'Trust Team Loyalty',
        description: 'Trust that your team will stay loyal without intervention.',
        cost: 0,
        timeRequired: 0,
        impact: {
          revenue: -150000, // Risk of losing talent
          profit: 0,
          marketShare: -3,
          customerSatisfaction: -5,
          brandAwareness: -5,
        },
      },
      {
        id: 'poaching-counter',
        title: 'Competitive Counter-Offers',
        description: 'Match competitor offers to retain key talent.',
        cost: 200000,
        timeRequired: 20,
        impact: {
          revenue: 50000,
          profit: -150000,
          marketShare: 1,
          customerSatisfaction: 2,
          brandAwareness: 0,
        },
      },
      {
        id: 'poaching-invest',
        title: 'Comprehensive Retention Program',
        description: 'Implement equity, development, and culture programs.',
        cost: 350000,
        timeRequired: 40,
        impact: {
          revenue: 200000,
          profit: -150000,
          marketShare: 4,
          customerSatisfaction: 8,
          brandAwareness: 5,
        },
      },
    ],
  },
  {
    id: 'wildcard-enhanced-6',
    type: 'opportunity',
    title: 'Influencer Collaboration Offer',
    description: 'A mega-influencer with 50M+ followers wants to collaborate on a campaign, but they\'re known for being unpredictable.',
    rarity: 'legendary',
    triggerConditions: {
      minRevenue: 300000,
      quarterSpecific: ['Q2', 'Q3', 'Q4'],
    },
    moraleImpact: {
      base: +10,
      choiceModifiers: {
        'influencer-decline': -5,
        'influencer-standard': +15,
        'influencer-exclusive': +25,
      }
    },
    brandEquityImpact: {
      base: +5,
      choiceModifiers: {
        'influencer-decline': 0,
        'influencer-standard': +20,
        'influencer-exclusive': +35,
      }
    },
    teamMoraleDescription: 'Team is excited about the high-profile collaboration opportunity.',
    choices: [
      {
        id: 'influencer-decline',
        title: 'Politely Decline',
        description: 'Too risky - stick with current influencer strategy.',
        cost: 0,
        timeRequired: 0,
        impact: {
          revenue: 0,
          profit: 0,
          marketShare: 0,
          customerSatisfaction: 0,
          brandAwareness: 0,
        },
      },
      {
        id: 'influencer-standard',
        title: 'Standard Collaboration',
        description: 'Partner on a controlled campaign with clear guidelines.',
        cost: 500000,
        timeRequired: 60,
        impact: {
          revenue: 1200000,
          profit: 700000,
          marketShare: 15,
          customerSatisfaction: 20,
          brandAwareness: 40,
        },
      },
      {
        id: 'influencer-exclusive',
        title: 'Exclusive Partnership',
        description: 'Go all-in with an exclusive, high-risk, high-reward partnership.',
        cost: 1200000,
        timeRequired: 90,
        impact: {
          revenue: 2500000,
          profit: 1300000,
          marketShare: 25,
          customerSatisfaction: 30,
          brandAwareness: 60,
        },
      },
    ],
  },
];

// Wildcard selection logic
export function selectRandomWildcard(
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4',
  currentKPIs: SimulationContext['kpis'],
  hasHiredTalent: boolean = false
): EnhancedWildcardEvent | null {
  // Filter wildcards based on trigger conditions
  const eligibleWildcards = ENHANCED_WILDCARDS.filter(wildcard => {
    const conditions = wildcard.triggerConditions;
    if (!conditions) return true;

    // Check quarter-specific conditions
    if (conditions.quarterSpecific && !conditions.quarterSpecific.includes(quarter)) {
      return false;
    }

    // Check revenue conditions
    if (conditions.minRevenue && currentKPIs.revenue < conditions.minRevenue) {
      return false;
    }
    if (conditions.maxRevenue && currentKPIs.revenue > conditions.maxRevenue) {
      return false;
    }

    // Check market share conditions
    if (conditions.minMarketShare && currentKPIs.marketShare < conditions.minMarketShare) {
      return false;
    }
    if (conditions.maxMarketShare && currentKPIs.marketShare > conditions.maxMarketShare) {
      return false;
    }

    // Check talent conditions
    if (conditions.hasHiredTalent !== undefined && conditions.hasHiredTalent !== hasHiredTalent) {
      return false;
    }

    return true;
  });

  if (eligibleWildcards.length === 0) return null;

  // Weight selection by rarity (common events more likely)
  const weightedWildcards: EnhancedWildcardEvent[] = [];
  
  eligibleWildcards.forEach(wildcard => {
    let weight = 1;
    switch (wildcard.rarity) {
      case 'common': weight = 10; break;
      case 'uncommon': weight = 5; break;
      case 'rare': weight = 2; break;
      case 'legendary': weight = 1; break;
    }
    
    for (let i = 0; i < weight; i++) {
      weightedWildcards.push(wildcard);
    }
  });

  // Select random wildcard from weighted pool
  const randomIndex = Math.floor(Math.random() * weightedWildcards.length);
  return weightedWildcards[randomIndex];
}

// Calculate enhanced wildcard impact including morale and brand equity
export function calculateEnhancedWildcardImpact(
  wildcard: EnhancedWildcardEvent,
  choiceId: string
): {
  kpiImpact: WildcardChoice['impact'];
  moraleImpact: number;
  brandEquityImpact: number;
} {
  const choice = wildcard.choices.find(c => c.id === choiceId);
  const defaultImpact: WildcardChoice['impact'] = {
    revenue: 0,
    profit: 0,
    marketShare: 0,
    customerSatisfaction: 0,
    brandAwareness: 0,
  };
  if (!choice) {
    return {
      kpiImpact: defaultImpact,
      moraleImpact: wildcard.moraleImpact.base,
      brandEquityImpact: wildcard.brandEquityImpact.base,
    };
  }

  const moraleImpact = wildcard.moraleImpact.base + 
    (wildcard.moraleImpact.choiceModifiers[choiceId] || 0);
  
  const brandEquityImpact = wildcard.brandEquityImpact.base +
    (wildcard.brandEquityImpact.choiceModifiers[choiceId] || 0);

  return {
    kpiImpact: choice.impact,
    moraleImpact,
    brandEquityImpact,
  };
}
