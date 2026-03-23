import { Tactic, WildcardEvent } from './simMachine';

export interface EnrichedTactic extends Tactic {
  strategicRationale?: string;
  marketingPrinciple?: string;
  synergyTags?: string[];
}

// Sample tactics library for the simulation
export const SAMPLE_TACTICS: EnrichedTactic[] = [
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
    strategicRationale: "Social advertising allows for precise demographic targeting and rapid feedback loops, making it ideal for quick market entry.",
    marketingPrinciple: "The Law of Focused Targeting: Advertising is most effective when it speaks directly to a specific audience segment rather than the mass market.",
    synergyTags: ['paid', 'broad-reach', 'digital-footprint']
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
    strategicRationale: "SEM captures high-intent users who are actively searching for solutions, leading to higher short-term conversion rates.",
    marketingPrinciple: "Intent-Based Marketing: Capturing a customer at the moment of search is significantly more efficient than trying to create interest from scratch.",
    synergyTags: ['paid', 'high-intent', 'conversion-focus']
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
    strategicRationale: "Influencers provide social proof and access to niche communities that traditional ads often struggle to penetrate authentically.",
    marketingPrinciple: "Social Proof Theory: Consumers are more likely to trust a recommendation from a peer or perceived authority than an direct brand message.",
    synergyTags: ['social-proof', 'community', 'trust-builder']
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
    strategicRationale: "Building a hub of valuable information establishes your brand as a thought leader and builds long-term organic authority.",
    marketingPrinciple: "Inbound Methodology: By providing value before asking for a sale, you build a sustainable pipeline of pre-educated leads.",
    synergyTags: ['organic', 'educational', 'long-term-growth']
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
    strategicRationale: "Video is the most engaging medium for storytelling, helping to build an emotional connection with your audience.",
    marketingPrinciple: "Multimedia Encoding: Information presented through both visual and auditory channels is retained longer and creates stronger brand recall.",
    synergyTags: ['engagement', 'storytelling', 'emotional-connection']
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
    strategicRationale: "Sponsoring podcasts allows you to reach a captive audience in a high-trust, long-form environment.",
    marketingPrinciple: "The Halo Effect: Aligning with a trusted voice allows your brand to inherit the credibility and loyalty associated with that influencer.",
    synergyTags: ['voice', 'trust-builder', 'niche-reach']
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
    strategicRationale: "Television remains the gold standard for massive reach and building immediate brand legitimacy in the eyes of the general public.",
    marketingPrinciple: "Signaling Theory: Massive investment in TV advertising signals to the market that a company is stable, successful, and reliable.",
    synergyTags: ['mass-market', 'legitimacy', 'high-investment']
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
    strategicRationale: "Print allows for high-quality visual representation and targeted reach in specific industry or lifestyle publications.",
    marketingPrinciple: "The Tangibility Effect: Physical media is often perceived as more permanent and trustworthy than ephemeral digital advertisements.",
    synergyTags: ['tangible', 'niche-traditional', 'authoritative']
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
    strategicRationale: "Trade shows facilitate face-to-face networking and immediate lead qualification in a highly concentrated market environment.",
    marketingPrinciple: "The Propinquity Effect: Physical proximity and direct interaction lead to stronger relationship building and faster trust acquisition.",
    synergyTags: ['b2b-focus', 'networking', 'direct-sales']
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
    strategicRationale: "Exclusive events for existing customers drive retention and turn satisfied users into vocal brand advocates.",
    marketingPrinciple: "Experiential Marketing: Creating a positive physical experience with a brand builds a deeper neurological connection than passive observation.",
    synergyTags: ['retention', 'advocacy', 'experience-focus']
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
    strategicRationale: "Partnering with a non-competitive brand allows you to access a pre-vetted audience with high credibility.",
    marketingPrinciple: "The Co-Branding Effect: Two brands working together create a '1+1=3' effect by combining their unique strengths and audience trust.",
    synergyTags: ['audience-sharing', 'credibility', 'co-marketing']
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
    strategicRationale: "Placing your product in physical or digital retail environments provides immediate distribution and 'at-the-shelf' visibility.",
    marketingPrinciple: "Availability Heuristic: Customers are more likely to buy the brands that are most easily accessible at the moment of need.",
    synergyTags: ['distribution', 'visibility', 'sales-enablement']
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
];

// Helper functions to get tactics and wildcards
export function getTacticsByCategory(category: Tactic['category']): EnrichedTactic[] {
  return SAMPLE_TACTICS.filter(tactic => tactic.category === category);
}

export function getRandomWildcard(): WildcardEvent {
  const randomIndex = Math.floor(Math.random() * SAMPLE_WILDCARDS.length);
  return SAMPLE_WILDCARDS[randomIndex];
}

export function getTacticById(id: string): EnrichedTactic | undefined {
  return SAMPLE_TACTICS.find(tactic => tactic.id === id);
}

export function getWildcardById(id: string): WildcardEvent | undefined {
  return SAMPLE_WILDCARDS.find(wildcard => wildcard.id === id);
}
