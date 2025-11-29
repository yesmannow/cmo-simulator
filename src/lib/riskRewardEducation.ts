/**
 * Risk & Reward Education System
 * Explains the risks and rewards for all decision types in the simulation
 * Helps users understand consequences before making decisions
 */

export interface RiskRewardAnalysis {
  id: string;
  name: string;
  category: 'tactic' | 'event' | 'hiring' | 'big-bet' | 'strategy' | 'budget';
  riskLevel: 'low' | 'medium' | 'high';
  rewardLevel: 'low' | 'medium' | 'high';
  risks: {
    description: string;
    probability: 'low' | 'medium' | 'high';
    impact: 'minor' | 'moderate' | 'major';
  }[];
  rewards: {
    description: string;
    probability: 'low' | 'medium' | 'high';
    impact: 'minor' | 'moderate' | 'major';
  }[];
  bestFor: string[];
  worstFor: string[];
  realWorldExample: string;
  expertAdvice: string;
  mitigationStrategies?: string[];
}

export const riskRewardDatabase: Record<string, RiskRewardAnalysis> = {
  // ============================================================================
  // TACTICS
  // ============================================================================
  'google-ads': {
    id: 'google-ads',
    name: 'Google Ads (Paid Search)',
    category: 'tactic',
    riskLevel: 'medium',
    rewardLevel: 'high',
    risks: [
      {
        description: 'High cost per click - can burn through budget quickly if not optimized',
        probability: 'high',
        impact: 'moderate',
      },
      {
        description: 'Competition drives up costs, especially for popular keywords',
        probability: 'high',
        impact: 'moderate',
      },
      {
        description: 'Low conversion if targeting wrong audience or using poor ad copy',
        probability: 'medium',
        impact: 'major',
      },
    ],
    rewards: [
      {
        description: 'Immediate traffic and leads - results appear within hours',
        probability: 'high',
        impact: 'major',
      },
      {
        description: 'Highly measurable - see exactly what works and what doesn\'t',
        probability: 'high',
        impact: 'moderate',
      },
      {
        description: 'Target specific keywords and demographics precisely',
        probability: 'high',
        impact: 'moderate',
      },
    ],
    bestFor: [
      'Quick lead generation',
      'Testing new markets',
      'Promoting time-sensitive offers',
      'When you have budget to test and optimize',
    ],
    worstFor: [
      'Long-term brand building',
      'Very competitive industries with high CPC',
      'Limited budget that can\'t afford testing',
    ],
    realWorldExample: 'A SaaS company spends $10,000/month on Google Ads, gets 500 clicks at $20/click, converts 5% to customers. Works great for them because their customer lifetime value is $2,000.',
    expertAdvice: 'Start with a small test budget ($1,000-2,000) to find winning keywords and ad copy. Scale what works. Always track ROI - if you\'re losing money, pause and optimize before spending more.',
    mitigationStrategies: [
      'Start with small test budgets',
      'Use negative keywords to avoid irrelevant clicks',
      'Test multiple ad variations',
      'Monitor daily spend and pause if not profitable',
      'Focus on long-tail keywords (cheaper, more specific)',
    ],
  },
  'content-marketing': {
    id: 'content-marketing',
    name: 'Content Marketing (Blogs, Guides, Videos)',
    category: 'tactic',
    riskLevel: 'low',
    rewardLevel: 'medium',
    risks: [
      {
        description: 'Takes 3-6 months to see significant results - not immediate',
        probability: 'high',
        impact: 'moderate',
      },
      {
        description: 'Requires consistent effort - one blog post won\'t move the needle',
        probability: 'high',
        impact: 'moderate',
      },
      {
        description: 'Quality matters more than quantity - poor content hurts brand',
        probability: 'medium',
        impact: 'major',
      },
    ],
    rewards: [
      {
        description: 'Compounds over time - each piece builds on previous ones',
        probability: 'high',
        impact: 'major',
      },
      {
        description: 'Builds trust and authority - positions you as expert',
        probability: 'high',
        impact: 'major',
      },
      {
        description: 'Long-term SEO value - ranks in Google for years',
        probability: 'high',
        impact: 'major',
      },
      {
        description: 'Cost-effective - one great guide can generate leads for years',
        probability: 'high',
        impact: 'moderate',
      },
    ],
    bestFor: [
      'Long-term brand building',
      'Establishing thought leadership',
      'SEO and organic traffic',
      'Educating potential customers',
      'B2B companies with long sales cycles',
    ],
    worstFor: [
      'Need immediate results',
      'Very short-term campaigns',
      'Industries where content doesn\'t influence decisions',
    ],
    realWorldExample: 'HubSpot started with free marketing guides. Years later, those guides still rank #1 on Google and generate thousands of leads monthly. Initial investment paid off 100x over.',
    expertAdvice: 'Think marathon, not sprint. Commit to 6-12 months minimum. Focus on quality over quantity - one amazing guide beats 10 mediocre blog posts. Answer questions your customers actually have.',
    mitigationStrategies: [
      'Start early - don\'t wait until you need leads',
      'Repurpose content across formats (blog → video → podcast)',
      'Promote content through other channels (social, email)',
      'Focus on topics with search volume but low competition',
    ],
  },
  'seo': {
    id: 'seo',
    name: 'SEO (Search Engine Optimization)',
    category: 'tactic',
    riskLevel: 'low',
    rewardLevel: 'high',
    risks: [
      {
        description: 'Takes 6-12 months to see significant rankings',
        probability: 'high',
        impact: 'moderate',
      },
      {
        description: 'Google algorithm changes can hurt rankings overnight',
        probability: 'low',
        impact: 'major',
      },
      {
        description: 'Requires technical knowledge or hiring experts',
        probability: 'medium',
        impact: 'minor',
      },
    ],
    rewards: [
      {
        description: 'Free traffic once you rank - no cost per click',
        probability: 'high',
        impact: 'major',
      },
      {
        description: 'Compounds exponentially - rankings improve over time',
        probability: 'high',
        impact: 'major',
      },
      {
        description: 'Builds long-term competitive advantage',
        probability: 'high',
        impact: 'major',
      },
    ],
    bestFor: [
      'Long-term growth strategy',
      'Industries with high search volume',
      'Companies with patience for results',
      'Building sustainable competitive moat',
    ],
    worstFor: [
      'Need immediate traffic',
      'Industries with no search demand',
      'Very competitive keywords (hard to rank)',
    ],
    realWorldExample: 'A law firm ranks #1 for "personal injury lawyer [city]". They get 500 free visitors/month, convert 10% to consultations. That\'s 50 potential clients/month at zero cost per click.',
    expertAdvice: 'SEO is like planting a tree - best time to start was 5 years ago, second best time is now. Focus on user intent, not just keywords. Build quality backlinks naturally. Don\'t try to game the system.',
    mitigationStrategies: [
      'Diversify - don\'t rely on single keywords',
      'Focus on user experience, not just rankings',
      'Build quality backlinks from reputable sites',
      'Monitor for algorithm updates and adapt',
    ],
  },
  'events': {
    id: 'events',
    name: 'Events & Trade Shows',
    category: 'tactic',
    riskLevel: 'high',
    rewardLevel: 'high',
    risks: [
      {
        description: 'High upfront cost - booth, travel, staff time',
        probability: 'high',
        impact: 'major',
      },
      {
        description: 'Unpredictable ROI - depends on who shows up',
        probability: 'high',
        impact: 'major',
      },
      {
        description: 'Time-intensive - takes team away from other work',
        probability: 'high',
        impact: 'moderate',
      },
      {
        description: 'If event is poorly attended, you waste entire investment',
        probability: 'medium',
        impact: 'major',
      },
    ],
    rewards: [
      {
        description: 'High-quality leads - people at events are actively looking',
        probability: 'high',
        impact: 'major',
      },
      {
        description: 'Face-to-face relationship building - strongest connections',
        probability: 'high',
        impact: 'major',
      },
      {
        description: 'Brand visibility and networking opportunities',
        probability: 'high',
        impact: 'moderate',
      },
      {
        description: 'Can close deals on the spot for some industries',
        probability: 'medium',
        impact: 'major',
      },
    ],
    bestFor: [
      'B2B companies with high-touch sales',
      'Industries where relationships matter',
      'Launching new products',
      'Networking and partnerships',
    ],
    worstFor: [
      'Very small budgets',
      'Industries where events aren\'t effective',
      'Companies that can\'t afford to send team',
    ],
    realWorldExample: 'A software company spends $50,000 on a major trade show. They meet 200 prospects, close 5 deals worth $100K each. ROI = 900%. But if they only closed 1 deal, ROI would be negative.',
    expertAdvice: 'Research events carefully - talk to past attendees. Set clear goals (leads, deals, awareness). Follow up within 48 hours while you\'re fresh in their minds. Track which events actually convert.',
    mitigationStrategies: [
      'Start with smaller, local events to test',
      'Share booth costs with partners',
      'Set clear goals and track ROI meticulously',
      'Have a follow-up system ready before the event',
      'Consider virtual events (lower cost, wider reach)',
    ],
  },

  // ============================================================================
  // WILDCARD EVENTS
  // ============================================================================
  'crisis-event': {
    id: 'crisis-event',
    name: 'Crisis Events',
    category: 'event',
    riskLevel: 'high',
    rewardLevel: 'low',
    risks: [
      {
        description: 'Can damage brand reputation if handled poorly',
        probability: 'high',
        impact: 'major',
      },
      {
        description: 'Negative publicity spreads faster than positive',
        probability: 'high',
        impact: 'major',
      },
      {
        description: 'May require significant resources to resolve',
        probability: 'medium',
        impact: 'moderate',
      },
    ],
    rewards: [
      {
        description: 'Handling crisis well can actually improve reputation',
        probability: 'medium',
        impact: 'moderate',
      },
      {
        description: 'Shows customers you care and are transparent',
        probability: 'medium',
        impact: 'minor',
      },
    ],
    bestFor: [
      'Companies with strong brand equity (can weather storm)',
      'Situations where transparency is valued',
    ],
    worstFor: [
      'New companies without established trust',
      'Industries where reputation is everything',
    ],
    realWorldExample: 'When Tylenol had product tampering, they immediately recalled all products, redesigned packaging, and communicated transparently. They actually gained market share after the crisis because of their response.',
    expertAdvice: 'Respond quickly, honestly, and take responsibility. Don\'t try to hide or minimize. Customers forgive mistakes, but not dishonesty. Have a crisis plan ready before you need it.',
    mitigationStrategies: [
      'Have crisis communication plan ready',
      'Monitor social media for early warning signs',
      'Train team on crisis response',
      'Build brand equity before crisis hits',
    ],
  },
  'opportunity-event': {
    id: 'opportunity-event',
    name: 'Market Opportunities',
    category: 'event',
    riskLevel: 'medium',
    rewardLevel: 'high',
    risks: [
      {
        description: 'May require quick decision-making without full information',
        probability: 'high',
        impact: 'moderate',
      },
      {
        description: 'Opportunity cost - resources spent here can\'t be used elsewhere',
        probability: 'medium',
        impact: 'moderate',
      },
      {
        description: 'Not all opportunities are real - some are distractions',
        probability: 'medium',
        impact: 'minor',
      },
    ],
    rewards: [
      {
        description: 'Can accelerate growth significantly if executed well',
        probability: 'medium',
        impact: 'major',
      },
      {
        description: 'First-mover advantage in new markets',
        probability: 'medium',
        impact: 'major',
      },
      {
        description: 'Can differentiate you from competitors',
        probability: 'high',
        impact: 'moderate',
      },
    ],
    bestFor: [
      'Companies ready to scale',
      'When opportunity aligns with strategy',
      'When you have resources to execute',
    ],
    worstFor: [
      'Companies already stretched thin',
      'Opportunities that don\'t fit your brand',
      'When you can\'t execute well',
    ],
    realWorldExample: 'When TikTok emerged, some brands jumped in early and built huge followings. Others waited and now struggle to get noticed in a crowded space. Early movers won big.',
    expertAdvice: 'Evaluate opportunities against your strategy. Not every opportunity is right for you. Ask: Does this align with our goals? Can we execute well? Will this distract from core business?',
    mitigationStrategies: [
      'Test with small investment first',
      'Set clear success metrics',
      'Have exit strategy if it doesn\'t work',
      'Don\'t chase every shiny object',
    ],
  },

  // ============================================================================
  // HIRING OPTIONS
  // ============================================================================
  'hire-marketing-director': {
    id: 'hire-marketing-director',
    name: 'Hire Marketing Director',
    category: 'hiring',
    riskLevel: 'medium',
    rewardLevel: 'high',
    risks: [
      {
        description: 'High salary cost - $80K-$150K+ annually',
        probability: 'high',
        impact: 'major',
      },
      {
        description: 'Takes 3-6 months to see impact - ramp-up time',
        probability: 'high',
        impact: 'moderate',
      },
      {
        description: 'Wrong hire can set you back significantly',
        probability: 'medium',
        impact: 'major',
      },
      {
        description: 'May not fit company culture or work style',
        probability: 'medium',
        impact: 'moderate',
      },
    ],
    rewards: [
      {
        description: 'Expertise you don\'t have internally',
        probability: 'high',
        impact: 'major',
      },
      {
        description: 'Frees up your time to focus on strategy',
        probability: 'high',
        impact: 'moderate',
      },
      {
        description: 'Can accelerate all marketing efforts',
        probability: 'high',
        impact: 'major',
      },
      {
        description: 'Brings network and industry connections',
        probability: 'medium',
        impact: 'minor',
      },
    ],
    bestFor: [
      'Companies ready to scale marketing',
      'When you\'re spending significant budget',
      'When you need expertise you don\'t have',
    ],
    worstFor: [
      'Very early stage startups',
      'Companies with tiny marketing budgets',
      'When you can\'t afford the salary',
    ],
    realWorldExample: 'A startup hired a marketing director for $120K. In 6 months, they increased qualified leads by 300% and improved conversion rates. The hire paid for itself in 3 months.',
    expertAdvice: 'Hire for cultural fit and learning ability, not just experience. Test with a project first if possible. Set clear 30/60/90 day goals. A great hire accelerates everything; a bad hire costs 2-3x their salary.',
    mitigationStrategies: [
      'Start with contract/freelance to test fit',
      'Check references thoroughly',
      'Set clear expectations and metrics',
      'Have 90-day review to ensure it\'s working',
    ],
  },

  // ============================================================================
  // BIG BETS
  // ============================================================================
  'big-bet': {
    id: 'big-bet',
    name: 'Big Bet Initiatives',
    category: 'big-bet',
    riskLevel: 'high',
    rewardLevel: 'high',
    risks: [
      {
        description: 'High investment with uncertain return',
        probability: 'high',
        impact: 'major',
      },
      {
        description: 'If it fails, you\'ve wasted significant resources',
        probability: 'medium',
        impact: 'major',
      },
      {
        description: 'Opportunity cost - can\'t invest in other areas',
        probability: 'high',
        impact: 'moderate',
      },
      {
        description: 'May take focus away from core business',
        probability: 'medium',
        impact: 'moderate',
      },
    ],
    rewards: [
      {
        description: 'Can create breakthrough growth if successful',
        probability: 'medium',
        impact: 'major',
      },
      {
        description: 'Differentiates you from competitors',
        probability: 'high',
        impact: 'major',
      },
      {
        description: 'Can open new markets or customer segments',
        probability: 'medium',
        impact: 'major',
      },
    ],
    bestFor: [
      'Companies with strong financial position',
      'When you have clear hypothesis to test',
      'Markets with high growth potential',
      'When you can afford to fail',
    ],
    worstFor: [
      'Companies on tight budgets',
      'When failure would be catastrophic',
      'Unproven markets or concepts',
    ],
    realWorldExample: 'Tesla bet big on Supercharger network when everyone said EVs would never work. That bet helped them dominate the market. But if it had failed, it could have bankrupted the company.',
    expertAdvice: 'Big bets should be calculated risks, not gambles. Do your research. Test assumptions with smaller experiments first. Have a clear success metric. Know when to cut losses. Only bet what you can afford to lose.',
    mitigationStrategies: [
      'Test assumptions with smaller experiments first',
      'Set clear success/failure criteria upfront',
      'Have exit strategy if it\'s not working',
      'Don\'t bet more than you can afford to lose',
      'Diversify - don\'t put all eggs in one basket',
    ],
  },
};

/**
 * Get risk/reward analysis for a decision
 */
export function getRiskRewardAnalysis(id: string): RiskRewardAnalysis | undefined {
  return riskRewardDatabase[id];
}

/**
 * Get all analyses for a category
 */
export function getAnalysesByCategory(category: RiskRewardAnalysis['category']): RiskRewardAnalysis[] {
  return Object.values(riskRewardDatabase).filter(analysis => analysis.category === category);
}

/**
 * Calculate overall risk score (0-100)
 */
export function calculateRiskScore(analysis: RiskRewardAnalysis): number {
  const riskWeights = { low: 1, medium: 2, high: 3 };
  const impactWeights = { minor: 1, moderate: 2, major: 3 };

  const totalRisk = analysis.risks.reduce((sum, risk) => {
    return sum + (riskWeights[risk.probability] * impactWeights[risk.impact]);
  }, 0);

  const maxRisk = analysis.risks.length * 9; // 3 * 3 = max
  return Math.round((totalRisk / maxRisk) * 100);
}

/**
 * Calculate overall reward score (0-100)
 */
export function calculateRewardScore(analysis: RiskRewardAnalysis): number {
  const rewardWeights = { low: 1, medium: 2, high: 3 };
  const impactWeights = { minor: 1, moderate: 2, major: 3 };

  const totalReward = analysis.rewards.reduce((sum, reward) => {
    return sum + (rewardWeights[reward.probability] * impactWeights[reward.impact]);
  }, 0);

  const maxReward = analysis.rewards.length * 9;
  return Math.round((totalReward / maxReward) * 100);
}

