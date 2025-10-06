import { Tactic, WildcardEvent } from './simMachine';

// Sample tactics library for the simulation
export const SAMPLE_TACTICS: Tactic[] = [
  // Digital Marketing Tactics
  {
    id: 'digital-1',
    name: 'Social Media Advertising Campaign',
    category: 'digital',
    cost: 75000,
    timeRequired: 30,
    expectedImpact: {
      revenue: 150000,
      marketShare: 3,
      customerSatisfaction: 2,
      brandAwareness: 15,
    },
  },
  {
    id: 'digital-2',
    name: 'Google Ads & SEM',
    category: 'digital',
    cost: 100000,
    timeRequired: 25,
    expectedImpact: {
      revenue: 200000,
      marketShare: 4,
      customerSatisfaction: 1,
      brandAwareness: 10,
    },
  },
  {
    id: 'digital-3',
    name: 'Influencer Partnership Program',
    category: 'digital',
    cost: 50000,
    timeRequired: 40,
    expectedImpact: {
      revenue: 80000,
      marketShare: 2,
      customerSatisfaction: 5,
      brandAwareness: 20,
    },
  },
  
  // Content Marketing Tactics
  {
    id: 'content-1',
    name: 'Content Marketing Hub',
    category: 'content',
    cost: 60000,
    timeRequired: 50,
    expectedImpact: {
      revenue: 90000,
      marketShare: 2,
      customerSatisfaction: 8,
      brandAwareness: 12,
    },
  },
  {
    id: 'content-2',
    name: 'Video Marketing Series',
    category: 'content',
    cost: 80000,
    timeRequired: 60,
    expectedImpact: {
      revenue: 120000,
      marketShare: 3,
      customerSatisfaction: 6,
      brandAwareness: 18,
    },
  },
  {
    id: 'content-3',
    name: 'Podcast Sponsorship',
    category: 'content',
    cost: 30000,
    timeRequired: 20,
    expectedImpact: {
      revenue: 50000,
      marketShare: 1,
      customerSatisfaction: 3,
      brandAwareness: 8,
    },
  },
  
  // Traditional Marketing Tactics
  {
    id: 'traditional-1',
    name: 'TV Commercial Campaign',
    category: 'traditional',
    cost: 200000,
    timeRequired: 45,
    expectedImpact: {
      revenue: 300000,
      marketShare: 8,
      customerSatisfaction: 2,
      brandAwareness: 25,
    },
  },
  {
    id: 'traditional-2',
    name: 'Print Advertising',
    category: 'traditional',
    cost: 40000,
    timeRequired: 15,
    expectedImpact: {
      revenue: 60000,
      marketShare: 2,
      customerSatisfaction: 1,
      brandAwareness: 8,
    },
  },
  {
    id: 'traditional-3',
    name: 'Radio Sponsorship',
    category: 'traditional',
    cost: 25000,
    timeRequired: 10,
    expectedImpact: {
      revenue: 40000,
      marketShare: 1,
      customerSatisfaction: 1,
      brandAwareness: 6,
    },
  },
  
  // Events & Experiences
  {
    id: 'events-1',
    name: 'Trade Show Presence',
    category: 'events',
    cost: 120000,
    timeRequired: 80,
    expectedImpact: {
      revenue: 180000,
      marketShare: 5,
      customerSatisfaction: 10,
      brandAwareness: 15,
    },
  },
  {
    id: 'events-2',
    name: 'Customer Experience Events',
    category: 'events',
    cost: 90000,
    timeRequired: 70,
    expectedImpact: {
      revenue: 110000,
      marketShare: 3,
      customerSatisfaction: 15,
      brandAwareness: 12,
    },
  },
  {
    id: 'events-3',
    name: 'Product Launch Event',
    category: 'events',
    cost: 150000,
    timeRequired: 90,
    expectedImpact: {
      revenue: 250000,
      marketShare: 6,
      customerSatisfaction: 8,
      brandAwareness: 20,
    },
  },
  
  // Partnerships
  {
    id: 'partnerships-1',
    name: 'Strategic Brand Partnership',
    category: 'partnerships',
    cost: 70000,
    timeRequired: 60,
    expectedImpact: {
      revenue: 140000,
      marketShare: 4,
      customerSatisfaction: 6,
      brandAwareness: 14,
    },
  },
  {
    id: 'partnerships-2',
    name: 'Retail Partnership Program',
    category: 'partnerships',
    cost: 100000,
    timeRequired: 50,
    expectedImpact: {
      revenue: 200000,
      marketShare: 6,
      customerSatisfaction: 4,
      brandAwareness: 10,
    },
  },
  {
    id: 'partnerships-3',
    name: 'Technology Integration Partnership',
    category: 'partnerships',
    cost: 80000,
    timeRequired: 70,
    expectedImpact: {
      revenue: 160000,
      marketShare: 5,
      customerSatisfaction: 12,
      brandAwareness: 8,
    },
  },
];

// Sample wildcard events for the simulation
export const SAMPLE_WILDCARDS: WildcardEvent[] = [
  {
    id: 'wildcard-1',
    type: 'crisis',
    title: 'Negative Social Media Viral Post',
    description: 'A customer complaint has gone viral on social media, potentially damaging your brand reputation.',
    choices: [
      {
        id: 'crisis-1-ignore',
        title: 'Ignore and Wait',
        description: 'Let the situation blow over naturally without direct response.',
        cost: 0,
        timeRequired: 0,
        impact: {
          revenue: -50000,
          profit: 0,
          marketShare: -2,
          customerSatisfaction: -10,
          brandAwareness: -5,
        },
      },
      {
        id: 'crisis-1-respond',
        title: 'Public Response Campaign',
        description: 'Launch a comprehensive response campaign addressing the concerns.',
        cost: 30000,
        timeRequired: 20,
        impact: {
          revenue: -10000,
          profit: -30000,
          marketShare: 0,
          customerSatisfaction: 5,
          brandAwareness: 3,
        },
      },
      {
        id: 'crisis-1-overhaul',
        title: 'Complete Brand Overhaul',
        description: 'Use this as an opportunity for major brand improvements.',
        cost: 100000,
        timeRequired: 60,
        impact: {
          revenue: 50000,
          profit: -50000,
          marketShare: 3,
          customerSatisfaction: 15,
          brandAwareness: 10,
        },
      },
    ],
  },
  {
    id: 'wildcard-2',
    type: 'opportunity',
    title: 'Celebrity Endorsement Opportunity',
    description: 'A popular celebrity has expressed interest in endorsing your brand.',
    choices: [
      {
        id: 'opportunity-2-decline',
        title: 'Decline the Offer',
        description: 'Pass on the opportunity to maintain current strategy.',
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
        id: 'opportunity-2-basic',
        title: 'Basic Endorsement Deal',
        description: 'Sign a standard endorsement contract.',
        cost: 150000,
        timeRequired: 30,
        impact: {
          revenue: 300000,
          profit: 150000,
          marketShare: 8,
          customerSatisfaction: 5,
          brandAwareness: 25,
        },
      },
      {
        id: 'opportunity-2-premium',
        title: 'Premium Partnership',
        description: 'Create a comprehensive partnership with co-created content.',
        cost: 300000,
        timeRequired: 60,
        impact: {
          revenue: 500000,
          profit: 200000,
          marketShare: 12,
          customerSatisfaction: 8,
          brandAwareness: 35,
        },
      },
    ],
  },
  {
    id: 'wildcard-3',
    type: 'market_shift',
    title: 'Economic Downturn',
    description: 'A sudden economic downturn has affected consumer spending patterns.',
    choices: [
      {
        id: 'downturn-3-maintain',
        title: 'Maintain Current Strategy',
        description: 'Continue with planned marketing activities.',
        cost: 0,
        timeRequired: 0,
        impact: {
          revenue: -100000,
          profit: -100000,
          marketShare: -3,
          customerSatisfaction: -2,
          brandAwareness: -5,
        },
      },
      {
        id: 'downturn-3-pivot',
        title: 'Pivot to Value Messaging',
        description: 'Shift marketing focus to value and affordability.',
        cost: 50000,
        timeRequired: 40,
        impact: {
          revenue: -30000,
          profit: -80000,
          marketShare: 2,
          customerSatisfaction: 5,
          brandAwareness: 0,
        },
      },
      {
        id: 'downturn-3-aggressive',
        title: 'Aggressive Market Capture',
        description: 'Increase marketing spend to capture market share from competitors.',
        cost: 200000,
        timeRequired: 50,
        impact: {
          revenue: 100000,
          profit: -100000,
          marketShare: 8,
          customerSatisfaction: 3,
          brandAwareness: 15,
        },
      },
    ],
  },
  {
    id: 'wildcard-4',
    type: 'competitor_action',
    title: 'Major Competitor Product Launch',
    description: 'Your main competitor has launched a revolutionary product that threatens your market position.',
    choices: [
      {
        id: 'competitor-4-ignore',
        title: 'Focus on Strengths',
        description: 'Double down on your existing product advantages.',
        cost: 25000,
        timeRequired: 20,
        impact: {
          revenue: -50000,
          profit: -25000,
          marketShare: -5,
          customerSatisfaction: 2,
          brandAwareness: 0,
        },
      },
      {
        id: 'competitor-4-counter',
        title: 'Counter-Launch Campaign',
        description: 'Launch an aggressive campaign highlighting your competitive advantages.',
        cost: 100000,
        timeRequired: 45,
        impact: {
          revenue: 50000,
          profit: -50000,
          marketShare: 0,
          customerSatisfaction: 0,
          brandAwareness: 12,
        },
      },
      {
        id: 'competitor-4-innovate',
        title: 'Accelerate Innovation',
        description: 'Fast-track your own product development and launch.',
        cost: 250000,
        timeRequired: 80,
        impact: {
          revenue: 200000,
          profit: -50000,
          marketShare: 6,
          customerSatisfaction: 10,
          brandAwareness: 18,
        },
      },
    ],
  },
];

// Helper functions to get tactics and wildcards
export function getTacticsByCategory(category: Tactic['category']): Tactic[] {
  return SAMPLE_TACTICS.filter(tactic => tactic.category === category);
}

export function getRandomWildcard(): WildcardEvent {
  const randomIndex = Math.floor(Math.random() * SAMPLE_WILDCARDS.length);
  return SAMPLE_WILDCARDS[randomIndex];
}

export function getTacticById(id: string): Tactic | undefined {
  return SAMPLE_TACTICS.find(tactic => tactic.id === id);
}

export function getWildcardById(id: string): WildcardEvent | undefined {
  return SAMPLE_WILDCARDS.find(wildcard => wildcard.id === id);
}
