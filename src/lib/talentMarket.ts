// Talent Market System for Q2 Hiring

export interface TalentCandidate {
  id: string;
  name: string;
  role: string;
  experience: 'junior' | 'mid' | 'senior' | 'executive';
  skills: string[];
  cost: number; // Annual salary
  hiringCost: number; // One-time hiring cost
  specialties: string[];
  personality: string;
  avatar: string;
  impact: {
    revenue: number;
    efficiency: number; // Reduces time requirements
    morale: number; // Team morale boost
    brandEquity: number;
    innovation: number; // Unlocks new tactics
  };
  backstory: string;
  strengths: string[];
  weaknesses: string[];
}

export interface BigBetOption {
  id: string;
  name: string;
  description: string;
  category: 'product_launch' | 'market_expansion' | 'technology_pivot' | 'acquisition' | 'partnership';
  cost: number;
  risk: number; // 0-1
  strategy: string;
  potentialImpact: {
    revenue: number;
    marketShare: number;
    brandAwareness: number;
    customerSatisfaction: number;
  };
}

// Sample talent pool
export const TALENT_POOL: TalentCandidate[] = [
  {
    id: 'talent-1',
    name: 'Sarah Chen',
    role: 'Digital Marketing Director',
    experience: 'senior',
    skills: ['SEO', 'SEM', 'Social Media', 'Analytics', 'Growth Hacking'],
    cost: 120000,
    hiringCost: 15000,
    specialties: ['Performance Marketing', 'Data-Driven Growth'],
    personality: 'Analytical and results-driven',
    avatar: '👩‍💼',
    impact: {
      revenue: 150000,
      efficiency: 20, // 20% time reduction on digital tactics
      morale: 10,
      brandEquity: 5,
      innovation: 15,
    },
    backstory: 'Former growth lead at a unicorn startup, scaled user acquisition from 10K to 1M users.',
    strengths: ['Data analysis', 'A/B testing', 'Conversion optimization'],
    weaknesses: ['Traditional media', 'Offline events'],
  },
  {
    id: 'talent-2',
    name: 'Marcus Rodriguez',
    role: 'Creative Director',
    experience: 'senior',
    skills: ['Brand Strategy', 'Creative Direction', 'Content Creation', 'Video Production'],
    cost: 110000,
    hiringCost: 12000,
    specialties: ['Brand Storytelling', 'Visual Identity'],
    personality: 'Creative visionary with strategic thinking',
    avatar: '🎨',
    impact: {
      revenue: 100000,
      efficiency: 15,
      morale: 20,
      brandEquity: 25,
      innovation: 20,
    },
    backstory: 'Award-winning creative director who led rebrands for Fortune 500 companies.',
    strengths: ['Brand positioning', 'Creative campaigns', 'Team inspiration'],
    weaknesses: ['Technical implementation', 'Data analysis'],
  },
  {
    id: 'talent-3',
    name: 'Dr. Priya Patel',
    role: 'Customer Experience Strategist',
    experience: 'executive',
    skills: ['Customer Research', 'UX Strategy', 'Service Design', 'Analytics'],
    cost: 140000,
    hiringCost: 20000,
    specialties: ['Customer Journey Mapping', 'Retention Strategy'],
    personality: 'Empathetic researcher with business acumen',
    avatar: '🔬',
    impact: {
      revenue: 120000,
      efficiency: 10,
      morale: 15,
      brandEquity: 20,
      innovation: 10,
    },
    backstory: 'PhD in Consumer Psychology, transformed customer satisfaction at 3 major brands.',
    strengths: ['Customer insights', 'Retention strategies', 'Research methodology'],
    weaknesses: ['Technical marketing', 'Paid advertising'],
  },
  {
    id: 'talent-4',
    name: 'Alex Kim',
    role: 'Growth Hacker',
    experience: 'mid',
    skills: ['Growth Hacking', 'Product Marketing', 'Viral Marketing', 'Community Building'],
    cost: 85000,
    hiringCost: 8000,
    specialties: ['Viral Growth', 'Community Engagement'],
    personality: 'Scrappy innovator with unconventional thinking',
    avatar: '🚀',
    impact: {
      revenue: 80000,
      efficiency: 25,
      morale: 25,
      brandEquity: 15,
      innovation: 30,
    },
    backstory: 'Self-taught marketer who created viral campaigns reaching 50M+ people on zero budget.',
    strengths: ['Viral marketing', 'Cost efficiency', 'Innovation'],
    weaknesses: ['Traditional channels', 'Corporate processes'],
  },
  {
    id: 'talent-5',
    name: 'Jennifer Walsh',
    role: 'Partnership Director',
    experience: 'senior',
    skills: ['Business Development', 'Strategic Partnerships', 'Negotiation', 'Relationship Management'],
    cost: 130000,
    hiringCost: 18000,
    specialties: ['Strategic Alliances', 'Channel Partnerships'],
    personality: 'Relationship builder with strategic vision',
    avatar: '🤝',
    impact: {
      revenue: 200000,
      efficiency: 5,
      morale: 10,
      brandEquity: 10,
      innovation: 5,
    },
    backstory: 'Built partnership networks generating $50M+ in revenue across multiple industries.',
    strengths: ['Relationship building', 'Deal negotiation', 'Strategic thinking'],
    weaknesses: ['Creative execution', 'Digital marketing'],
  },
  {
    id: 'talent-6',
    name: 'David Thompson',
    role: 'Marketing Operations Manager',
    experience: 'mid',
    skills: ['Marketing Automation', 'CRM Management', 'Process Optimization', 'Analytics'],
    cost: 75000,
    hiringCost: 7000,
    specialties: ['Marketing Technology', 'Process Efficiency'],
    personality: 'Detail-oriented optimizer with technical expertise',
    avatar: '⚙️',
    impact: {
      revenue: 60000,
      efficiency: 30,
      morale: 5,
      brandEquity: 0,
      innovation: 10,
    },
    backstory: 'Streamlined marketing operations for high-growth companies, reducing costs by 40%.',
    strengths: ['Process optimization', 'Marketing technology', 'Efficiency'],
    weaknesses: ['Creative strategy', 'Public speaking'],
  },
];

// Big Bet options for Q4
export const BIG_BETS: BigBetOption[] = [
  {
    id: 'bigbet-1',
    name: 'Super Bowl Commercial',
    description: 'Launch a high-impact Super Bowl commercial to achieve massive brand awareness and cultural relevance.',
    category: 'product_launch',
    cost: 8000000,
    risk: 0.35,
    strategy: 'Mass market brand awareness through premium advertising placement',
    potentialImpact: {
      revenue: 15000000,
      marketShare: 12,
      brandAwareness: 35,
      customerSatisfaction: 20,
    },
  },
  {
    id: 'bigbet-2',
    name: 'AI-Powered Personalization Platform',
    description: 'Invest in cutting-edge AI technology to deliver hyper-personalized customer experiences.',
    category: 'technology_pivot',
    cost: 3000000,
    risk: 0.25,
    strategy: 'Technology-driven customer experience enhancement and data monetization',
    potentialImpact: {
      revenue: 8500000,
      marketShare: 7,
      brandAwareness: 18,
      customerSatisfaction: 30,
    },
  },
  {
    id: 'bigbet-3',
    name: 'Global Market Expansion',
    description: 'Enter 3 new international markets with localized marketing campaigns and partnerships.',
    category: 'market_expansion',
    cost: 5000000,
    risk: 0.4,
    strategy: 'Geographic diversification through strategic market entry and localization',
    potentialImpact: {
      revenue: 11500000,
      marketShare: 16,
      brandAwareness: 28,
      customerSatisfaction: 18,
    },
  },
  {
    id: 'bigbet-4',
    name: 'Strategic Acquisition',
    description: 'Acquire a complementary company to expand product portfolio and customer base.',
    category: 'acquisition',
    cost: 12000000,
    risk: 0.5,
    strategy: 'Inorganic growth through strategic acquisition and market consolidation',
    potentialImpact: {
      revenue: 24000000,
      marketShare: 25,
      brandAwareness: 42,
      customerSatisfaction: 8,
    },
  },
  {
    id: 'bigbet-5',
    name: 'Influencer Partnership Network',
    description: 'Build exclusive partnerships with top-tier influencers and content creators for authentic brand advocacy.',
    category: 'partnership',
    cost: 2000000,
    risk: 0.2,
    strategy: 'Authentic brand advocacy through strategic influencer partnerships and content collaboration',
    potentialImpact: {
      revenue: 4750000,
      marketShare: 5,
      brandAwareness: 14,
      customerSatisfaction: 10,
    },
  },
  {
    id: 'bigbet-6',
    name: 'Sustainability Revolution',
    description: 'Transform the brand into a sustainability leader with eco-friendly initiatives and carbon neutrality.',
    category: 'product_launch',
    cost: 4000000,
    risk: 0.15,
    strategy: 'Brand differentiation through environmental leadership and sustainable innovation',
    potentialImpact: {
      revenue: 6500000,
      marketShare: 6,
      brandAwareness: 45,
      customerSatisfaction: 32,
    },
  },
];

// Helper functions
export function getRandomTalentPool(count: number = 3): TalentCandidate[] {
  const shuffled = [...TALENT_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getRandomBigBets(count: number = 3): BigBetOption[] {
  const shuffled = [...BIG_BETS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function calculateTalentImpact(candidate: TalentCandidate, quarterlyRevenue: number): number {
  // Calculate the actual impact based on candidate's abilities and current performance
  const baseImpact = candidate.impact.revenue;
  const performanceMultiplier = Math.max(0.5, Math.min(2.0, quarterlyRevenue / 500000));
  return Math.round(baseImpact * performanceMultiplier);
}

export function calculateBigBetOutcome(bigBet: BigBetOption, context: any, hasStrongTeam: boolean = false): {
  success: boolean;
  actualImpact: {
    revenue: number;
    marketShare: number;
    brandAwareness: number;
    customerSatisfaction: number;
  };
} {
  // Calculate success probability based on risk (lower risk = higher success chance)
  let successProbability = (1 - bigBet.risk) * 100;
  
  if (hasStrongTeam) {
    successProbability += 10;
  }
  
  const success = Math.random() * 100 < successProbability;
  
  if (success) {
    return {
      success: true,
      actualImpact: {
        revenue: bigBet.potentialImpact.revenue,
        marketShare: bigBet.potentialImpact.marketShare,
        brandAwareness: bigBet.potentialImpact.brandAwareness,
        customerSatisfaction: bigBet.potentialImpact.customerSatisfaction,
      },
    };
  } else {
    // Failure impact is reduced potential impact
    return {
      success: false,
      actualImpact: {
        revenue: -Math.round(bigBet.potentialImpact.revenue * 0.3),
        marketShare: -Math.round(bigBet.potentialImpact.marketShare * 0.3),
        brandAwareness: -Math.round(bigBet.potentialImpact.brandAwareness * 0.3),
        customerSatisfaction: -Math.round(bigBet.potentialImpact.customerSatisfaction * 0.3),
      },
    };
  }
}
