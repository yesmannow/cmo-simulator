/**
 * Advanced Wildcard Events System
 * 
 * Creates dynamic, context-aware events based on:
 * - Market landscape (disruptor, crowded, frontier)
 * - Industry (healthcare, legal, ecommerce)
 * - Current performance (struggling vs. thriving)
 * - Quarter (early vs. late game)
 */

export interface WildcardEvent {
  id: string;
  type: 'competitive' | 'market-shift' | 'internal-crisis' | 'opportunity';
  severity: 'minor' | 'major' | 'critical';
  title: string;
  description: string;
  context: string; // Educational context about why this matters
  
  choices: WildcardChoice[];
  
  // Metadata
  triggeredInQuarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  industrySpecific?: string;
  landscapeSpecific?: string;
}

export interface WildcardChoice {
  id: string;
  title: string;
  description: string;
  
  // Costs
  budgetCost: number;
  timeCost: number; // Team hours
  
  // Immediate impacts
  impact: {
    revenue: number; // Can be negative
    marketShare: number;
    brandEquity: number;
    teamMorale: number;
    customerSatisfaction: number;
  };
  
  // Strategic implications
  riskLevel: 'low' | 'medium' | 'high';
  longTermEffect?: string; // Description of lasting impact
  
  // Educational feedback
  reasoning: string; // Why this choice has these effects
}

/**
 * Generate wildcard events based on simulation context
 */
export function generateWildcardEvent(
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4',
  context: {
    industry: 'healthcare' | 'legal' | 'ecommerce';
    landscape: 'disruptor' | 'crowded' | 'frontier';
    currentMarketShare: number;
    currentMorale: number;
    budgetRemaining: number;
  }
): WildcardEvent {
  // Select event type based on context
  const eventPool: WildcardEvent[] = [
    ...COMPETITIVE_EVENTS,
    ...MARKET_SHIFT_EVENTS,
    ...INTERNAL_CRISIS_EVENTS,
    ...OPPORTUNITY_EVENTS
  ];
  
  // Filter by industry and landscape
  const relevantEvents = eventPool.filter(event => {
    if (event.industrySpecific && event.industrySpecific !== context.industry) return false;
    if (event.landscapeSpecific && event.landscapeSpecific !== context.landscape) return false;
    return true;
  });
  
  // Weight by current situation
  const weightedEvent = selectWeightedEvent(relevantEvents, context);
  
  return {
    ...weightedEvent,
    triggeredInQuarter: quarter
  };
}

function selectWeightedEvent(
  events: WildcardEvent[],
  context: any
): WildcardEvent {
  // Simple random selection for now
  // Could be enhanced with weighted probability based on context
  return events[Math.floor(Math.random() * events.length)];
}

/**
 * COMPETITIVE EVENTS
 * Competitor actions that force strategic response
 */
const COMPETITIVE_EVENTS: WildcardEvent[] = [
  {
    id: 'comp-price-war',
    type: 'competitive',
    severity: 'major',
    title: '🚨 Competitor Launches Aggressive Price Cut',
    description: 'Your main competitor just slashed their prices by 40% and launched a massive "Lowest Price Guarantee" campaign. Your sales team reports customers are asking why your prices are higher.',
    context: 'Price wars are common but dangerous. Matching prices erodes margins. The key is to compete on value, not price.',
    triggeredInQuarter: 'Q2',
    landscapeSpecific: 'disruptor',
    choices: [
      {
        id: 'match-price',
        title: 'Match Their Discount',
        description: 'Launch your own 40% off sale immediately to stay competitive',
        budgetCost: 0,
        timeCost: 20,
        impact: {
          revenue: -50000,
          marketShare: 2,
          brandEquity: -15,
          teamMorale: -5,
          customerSatisfaction: 5
        },
        riskLevel: 'high',
        longTermEffect: 'Customers now expect discounts, hard to raise prices later',
        reasoning: 'Matching prices protects market share but destroys margins and brand perception'
      },
      {
        id: 'value-campaign',
        title: 'Counter with Value Messaging',
        description: 'Launch a campaign highlighting your superior quality, service, and results',
        budgetCost: 30000,
        timeCost: 40,
        impact: {
          revenue: 20000,
          marketShare: 1,
          brandEquity: 10,
          teamMorale: 5,
          customerSatisfaction: 8
        },
        riskLevel: 'medium',
        longTermEffect: 'Strengthens brand positioning as premium option',
        reasoning: 'Competing on value instead of price protects margins and builds brand equity'
      },
      {
        id: 'niche-focus',
        title: 'Double Down on Your Niche',
        description: 'Let them have the price-sensitive customers, focus on your ideal customer segment',
        budgetCost: 15000,
        timeCost: 30,
        impact: {
          revenue: -10000,
          marketShare: -1,
          brandEquity: 5,
          teamMorale: 0,
          customerSatisfaction: 10
        },
        riskLevel: 'low',
        longTermEffect: 'Builds loyal customer base less sensitive to price',
        reasoning: 'Strategic retreat to defensible position, sacrifices volume for profitability'
      }
    ]
  },
  
  {
    id: 'comp-viral-campaign',
    type: 'competitive',
    severity: 'major',
    title: '📱 Competitor Goes Viral',
    description: 'A competitor\'s creative marketing campaign just went viral on TikTok and Instagram. They\'ve gained 500K followers in 48 hours and your organic traffic is down 25%.',
    context: 'Viral moments create temporary spikes but require quick response to minimize damage.',
    triggeredInQuarter: 'Q2',
    landscapeSpecific: 'crowded',
    choices: [
      {
        id: 'trend-jack',
        title: 'Jump on the Trend',
        description: 'Create your own version of their viral content immediately',
        budgetCost: 10000,
        timeCost: 60,
        impact: {
          revenue: 15000,
          marketShare: 0,
          brandEquity: -5,
          teamMorale: -10,
          customerSatisfaction: 0
        },
        riskLevel: 'high',
        longTermEffect: 'May appear desperate or unoriginal',
        reasoning: 'Fast response captures attention but risks looking like a copycat'
      },
      {
        id: 'influencer-blitz',
        title: 'Launch Influencer Blitz',
        description: 'Partner with 10 micro-influencers for authentic content',
        budgetCost: 50000,
        timeCost: 40,
        impact: {
          revenue: 60000,
          marketShare: 3,
          brandEquity: 12,
          teamMorale: 5,
          customerSatisfaction: 8
        },
        riskLevel: 'medium',
        longTermEffect: 'Builds ongoing influencer relationships',
        reasoning: 'Strategic investment in authentic voices builds sustainable awareness'
      },
      {
        id: 'stay-course',
        title: 'Stay the Course',
        description: 'Ignore the noise, trust your long-term strategy',
        budgetCost: 0,
        timeCost: 0,
        impact: {
          revenue: -20000,
          marketShare: -2,
          brandEquity: 5,
          teamMorale: -5,
          customerSatisfaction: 0
        },
        riskLevel: 'low',
        longTermEffect: 'Maintains strategic focus and brand consistency',
        reasoning: 'Viral moments fade quickly, staying focused on fundamentals often wins long-term'
      }
    ]
  },

  {
    id: 'comp-acquisition',
    type: 'competitive',
    severity: 'critical',
    title: '💼 Major Competitor Acquisition',
    description: 'The largest player in your market just acquired a smaller competitor, combining their customer bases and technology. They now control 35% market share and are bundling services.',
    context: 'Market consolidation changes competitive dynamics. Smaller players must differentiate or find partners.',
    triggeredInQuarter: 'Q3',
    landscapeSpecific: 'disruptor',
    choices: [
      {
        id: 'partnership',
        title: 'Seek Strategic Partnership',
        description: 'Approach complementary companies about partnership or merger',
        budgetCost: 20000,
        timeCost: 80,
        impact: {
          revenue: 40000,
          marketShare: 4,
          brandEquity: 8,
          teamMorale: -10,
          customerSatisfaction: 5
        },
        riskLevel: 'high',
        longTermEffect: 'May lead to acquisition or strategic alliance',
        reasoning: 'Consolidation often triggers more consolidation, partnership provides scale'
      },
      {
        id: 'differentiate',
        title: 'Aggressive Differentiation',
        description: 'Launch campaign positioning as the independent, customer-focused alternative',
        budgetCost: 60000,
        timeCost: 50,
        impact: {
          revenue: 30000,
          marketShare: 2,
          brandEquity: 15,
          teamMorale: 10,
          customerSatisfaction: 12
        },
        riskLevel: 'medium',
        longTermEffect: 'Builds "David vs Goliath" brand narrative',
        reasoning: 'Customers often distrust large corporations, positioning as alternative captures this sentiment'
      },
      {
        id: 'niche-dominate',
        title: 'Dominate a Niche',
        description: 'Abandon broad market, become the absolute best in one specific segment',
        budgetCost: 40000,
        timeCost: 60,
        impact: {
          revenue: 20000,
          marketShare: -1,
          brandEquity: 10,
          teamMorale: 5,
          customerSatisfaction: 15
        },
        riskLevel: 'medium',
        longTermEffect: 'Becomes category leader in specific niche',
        reasoning: 'Can\'t compete everywhere, dominating a niche creates defensible position'
      }
    ]
  }
];

/**
 * MARKET SHIFT EVENTS
 * External changes in market conditions, regulations, or trends
 */
const MARKET_SHIFT_EVENTS: WildcardEvent[] = [
  {
    id: 'market-privacy-law',
    type: 'market-shift',
    severity: 'major',
    title: '⚖️ New Privacy Regulations',
    description: 'New data privacy legislation just passed, making all ad targeting 20% less effective. Third-party cookies are being phased out faster than expected.',
    context: 'Privacy regulations are reshaping digital marketing. First-party data and contextual targeting are the future.',
    triggeredInQuarter: 'Q2',
    choices: [
      {
        id: 'first-party',
        title: 'Build First-Party Data Strategy',
        description: 'Invest heavily in email list, loyalty program, and owned data',
        budgetCost: 50000,
        timeCost: 60,
        impact: {
          revenue: -10000,
          marketShare: 0,
          brandEquity: 8,
          teamMorale: 0,
          customerSatisfaction: 5
        },
        riskLevel: 'low',
        longTermEffect: 'Creates sustainable competitive advantage as regulations tighten',
        reasoning: 'First-party data becomes more valuable as third-party targeting disappears'
      },
      {
        id: 'contextual',
        title: 'Shift to Contextual Advertising',
        description: 'Move budget from behavioral to contextual targeting',
        budgetCost: 20000,
        timeCost: 30,
        impact: {
          revenue: -15000,
          marketShare: -1,
          brandEquity: 0,
          teamMorale: -5,
          customerSatisfaction: 0
        },
        riskLevel: 'medium',
        longTermEffect: 'Less efficient but compliant with regulations',
        reasoning: 'Contextual targeting is less precise but privacy-compliant'
      },
      {
        id: 'content-seo',
        title: 'Double Down on Content & SEO',
        description: 'Reduce paid ads, invest in organic content marketing',
        budgetCost: 40000,
        timeCost: 70,
        impact: {
          revenue: -20000,
          marketShare: -1,
          brandEquity: 12,
          teamMorale: 5,
          customerSatisfaction: 8
        },
        riskLevel: 'low',
        longTermEffect: 'Builds sustainable organic traffic independent of ad platforms',
        reasoning: 'Organic channels unaffected by privacy changes, compounds over time'
      }
    ]
  },

  {
    id: 'market-trend-surge',
    type: 'market-shift',
    severity: 'major',
    title: '📈 Your Category is Suddenly Trending',
    description: 'A celebrity endorsement and viral news story have put your product category in the spotlight. Search volume is up 300% but will likely fade in 4-6 weeks.',
    context: 'Trend-driven spikes are temporary but can be leveraged for long-term growth if captured correctly.',
    triggeredInQuarter: 'Q2',
    choices: [
      {
        id: 'capitalize-aggressive',
        title: 'Aggressive Paid Media Blitz',
        description: 'Spend 50% of remaining budget immediately to capture the surge',
        budgetCost: 100000,
        timeCost: 40,
        impact: {
          revenue: 250000,
          marketShare: 8,
          brandEquity: 5,
          teamMorale: -15,
          customerSatisfaction: 0
        },
        riskLevel: 'high',
        longTermEffect: 'Captures customers during peak interest',
        reasoning: 'Strike while iron is hot, but risks depleting budget and burning out team'
      },
      {
        id: 'content-capture',
        title: 'Content Marketing Surge',
        description: 'Rapidly create SEO-optimized content to capture organic traffic',
        budgetCost: 30000,
        timeCost: 80,
        impact: {
          revenue: 80000,
          marketShare: 4,
          brandEquity: 15,
          teamMorale: -5,
          customerSatisfaction: 8
        },
        riskLevel: 'medium',
        longTermEffect: 'Content continues to drive traffic after trend fades',
        reasoning: 'Content captures long-tail traffic and continues to perform after trend ends'
      },
      {
        id: 'email-capture',
        title: 'Lead Capture Focus',
        description: 'Optimize for email signups to build list during high traffic',
        budgetCost: 20000,
        timeCost: 30,
        impact: {
          revenue: 40000,
          marketShare: 2,
          brandEquity: 8,
          teamMorale: 0,
          customerSatisfaction: 5
        },
        riskLevel: 'low',
        longTermEffect: 'Builds owned audience for future marketing',
        reasoning: 'Captures audience for remarketing after trend fades'
      }
    ]
  },

  {
    id: 'market-recession',
    type: 'market-shift',
    severity: 'critical',
    title: '📉 Economic Downturn',
    description: 'Economic indicators show recession. Consumer spending is down 15%, B2B budgets are being cut, and your sales cycle is lengthening.',
    context: 'Recessions force difficult choices. Companies that invest strategically during downturns often emerge stronger.',
    triggeredInQuarter: 'Q3',
    choices: [
      {
        id: 'cut-budget',
        title: 'Cut Marketing Budget 40%',
        description: 'Preserve cash, focus only on highest-ROI channels',
        budgetCost: -80000,
        timeCost: 0,
        impact: {
          revenue: -100000,
          marketShare: -5,
          brandEquity: -10,
          teamMorale: -20,
          customerSatisfaction: -5
        },
        riskLevel: 'high',
        longTermEffect: 'Loses market position that\'s hard to regain',
        reasoning: 'Cutting marketing in recession often leads to permanent market share loss'
      },
      {
        id: 'value-messaging',
        title: 'Shift to Value Messaging',
        description: 'Reposition around ROI, cost-savings, and value',
        budgetCost: 30000,
        timeCost: 40,
        impact: {
          revenue: -30000,
          marketShare: 0,
          brandEquity: 5,
          teamMorale: 0,
          customerSatisfaction: 8
        },
        riskLevel: 'medium',
        longTermEffect: 'Aligns messaging with market conditions',
        reasoning: 'Customers prioritize value in recession, messaging must adapt'
      },
      {
        id: 'counter-invest',
        title: 'Counter-Cyclical Investment',
        description: 'Maintain budget while competitors cut, gain market share',
        budgetCost: 0,
        timeCost: 50,
        impact: {
          revenue: -50000,
          marketShare: 6,
          brandEquity: 12,
          teamMorale: 10,
          customerSatisfaction: 5
        },
        riskLevel: 'high',
        longTermEffect: 'Emerges from recession with stronger market position',
        reasoning: 'Competitors cutting creates opportunity to gain share at lower cost'
      }
    ]
  }
];

/**
 * INTERNAL CRISIS EVENTS
 * Problems within your organization
 */
const INTERNAL_CRISIS_EVENTS: WildcardEvent[] = [
  {
    id: 'internal-website-down',
    type: 'internal-crisis',
    severity: 'critical',
    title: '🚨 Website Outage During Peak Season',
    description: 'Your website crashed during your biggest campaign of the quarter. It was down for 36 hours during peak traffic. Customers are frustrated and some campaigns are still running, wasting budget.',
    context: 'Technical failures happen. Response speed and customer communication determine long-term damage.',
    triggeredInQuarter: 'Q3',
    choices: [
      {
        id: 'pause-all',
        title: 'Pause All Campaigns Immediately',
        description: 'Stop all paid advertising until site is stable',
        budgetCost: -20000,
        timeCost: 20,
        impact: {
          revenue: -80000,
          marketShare: -3,
          brandEquity: -5,
          teamMorale: -10,
          customerSatisfaction: -15
        },
        riskLevel: 'low',
        longTermEffect: 'Prevents wasted ad spend but loses momentum',
        reasoning: 'Conservative approach prevents further waste but sacrifices revenue'
      },
      {
        id: 'discount-apology',
        title: 'Offer Apology Discount',
        description: 'Give 20% discount to all affected customers and prospects',
        budgetCost: 30000,
        timeCost: 30,
        impact: {
          revenue: -40000,
          marketShare: 0,
          brandEquity: 5,
          teamMorale: -5,
          customerSatisfaction: 10
        },
        riskLevel: 'medium',
        longTermEffect: 'Rebuilds trust but sets discount precedent',
        reasoning: 'Compensation shows accountability and can turn crisis into loyalty opportunity'
      },
      {
        id: 'infrastructure',
        title: 'Emergency Infrastructure Upgrade',
        description: 'Invest in enterprise hosting and redundancy immediately',
        budgetCost: 60000,
        timeCost: 60,
        impact: {
          revenue: -60000,
          marketShare: -2,
          brandEquity: 8,
          teamMorale: 5,
          customerSatisfaction: 5
        },
        riskLevel: 'low',
        longTermEffect: 'Prevents future outages, improves site performance',
        reasoning: 'Addresses root cause, prevents future crises and improves customer experience'
      }
    ]
  },

  {
    id: 'internal-key-resignation',
    type: 'internal-crisis',
    severity: 'major',
    title: '👋 Key Team Member Resigns',
    description: 'Your most experienced marketing manager just resigned to join a competitor. They managed your top-performing campaigns and have relationships with key vendors. Team morale is shaken.',
    context: 'Talent loss is inevitable. How you respond determines whether it becomes a crisis or opportunity.',
    triggeredInQuarter: 'Q2',
    choices: [
      {
        id: 'counter-offer',
        title: 'Make Counter-Offer',
        description: 'Offer 30% raise and promotion to retain them',
        budgetCost: 40000,
        timeCost: 10,
        impact: {
          revenue: 0,
          marketShare: 0,
          brandEquity: 0,
          teamMorale: -15,
          customerSatisfaction: 0
        },
        riskLevel: 'high',
        longTermEffect: 'May retain person but damages team dynamics and sets precedent',
        reasoning: 'Counter-offers often fail and signal to team that leaving is way to get raise'
      },
      {
        id: 'promote-internal',
        title: 'Promote from Within',
        description: 'Give opportunity to high-potential junior team member',
        budgetCost: 15000,
        timeCost: 40,
        impact: {
          revenue: -20000,
          marketShare: 0,
          brandEquity: 0,
          teamMorale: 15,
          customerSatisfaction: 0
        },
        riskLevel: 'medium',
        longTermEffect: 'Builds loyalty and shows career path exists',
        reasoning: 'Internal promotion boosts morale and develops talent pipeline'
      },
      {
        id: 'hire-expert',
        title: 'Hire Senior Expert',
        description: 'Recruit experienced leader from outside',
        budgetCost: 50000,
        timeCost: 60,
        impact: {
          revenue: 30000,
          marketShare: 1,
          brandEquity: 5,
          teamMorale: -5,
          customerSatisfaction: 0
        },
        riskLevel: 'medium',
        longTermEffect: 'Brings fresh perspective and expertise',
        reasoning: 'External hire brings new ideas but takes time to onboard'
      }
    ]
  },

  {
    id: 'internal-pr-crisis',
    type: 'internal-crisis',
    severity: 'critical',
    title: '📰 PR Crisis: Negative Press',
    description: 'A customer complaint went viral on social media. A journalist picked it up and wrote a critical article. Your brand mentions are 80% negative today and customer service is overwhelmed.',
    context: 'PR crises spread fast on social media. Transparent, quick response is critical.',
    triggeredInQuarter: 'Q3',
    choices: [
      {
        id: 'ignore',
        title: 'Stay Silent',
        description: 'Don\'t feed the fire, let it blow over naturally',
        budgetCost: 0,
        timeCost: 0,
        impact: {
          revenue: -100000,
          marketShare: -4,
          brandEquity: -25,
          teamMorale: -15,
          customerSatisfaction: -20
        },
        riskLevel: 'high',
        longTermEffect: 'Silence often interpreted as guilt or indifference',
        reasoning: 'Ignoring crisis allows narrative to be controlled by critics'
      },
      {
        id: 'transparent-response',
        title: 'Transparent Public Response',
        description: 'Acknowledge issue, explain what happened, outline fixes',
        budgetCost: 20000,
        timeCost: 40,
        impact: {
          revenue: -30000,
          marketShare: -1,
          brandEquity: 10,
          teamMorale: 5,
          customerSatisfaction: 15
        },
        riskLevel: 'low',
        longTermEffect: 'Builds trust through transparency and accountability',
        reasoning: 'Honest communication and action plan can turn crisis into trust-building moment'
      },
      {
        id: 'pr-campaign',
        title: 'Launch PR Counter-Campaign',
        description: 'Hire crisis PR firm, launch positive story campaign',
        budgetCost: 80000,
        timeCost: 60,
        impact: {
          revenue: -50000,
          marketShare: 0,
          brandEquity: 5,
          teamMorale: 0,
          customerSatisfaction: 5
        },
        riskLevel: 'high',
        longTermEffect: 'Can appear defensive or inauthentic if not handled well',
        reasoning: 'Aggressive PR response can backfire if not paired with genuine fixes'
      }
    ]
  }
];

/**
 * OPPORTUNITY EVENTS
 * Positive unexpected opportunities
 */
const OPPORTUNITY_EVENTS: WildcardEvent[] = [
  {
    id: 'opp-partnership',
    type: 'opportunity',
    severity: 'major',
    title: '🤝 Strategic Partnership Opportunity',
    description: 'A well-known brand in a complementary space has approached you about a co-marketing partnership. They have 10x your audience but want to leverage your expertise.',
    context: 'Strategic partnerships can accelerate growth but require careful negotiation and execution.',
    triggeredInQuarter: 'Q2',
    choices: [
      {
        id: 'accept-partnership',
        title: 'Accept Partnership',
        description: 'Commit resources to joint campaign',
        budgetCost: 40000,
        timeCost: 80,
        impact: {
          revenue: 150000,
          marketShare: 6,
          brandEquity: 20,
          teamMorale: 10,
          customerSatisfaction: 10
        },
        riskLevel: 'medium',
        longTermEffect: 'Opens door to larger audience and future collaborations',
        reasoning: 'Partnership provides access to established audience and credibility boost'
      },
      {
        id: 'negotiate-better',
        title: 'Negotiate Better Terms',
        description: 'Push for more favorable revenue share and control',
        budgetCost: 30000,
        timeCost: 60,
        impact: {
          revenue: 80000,
          marketShare: 3,
          brandEquity: 10,
          teamMorale: 0,
          customerSatisfaction: 5
        },
        riskLevel: 'low',
        longTermEffect: 'Better economics but may strain relationship',
        reasoning: 'Negotiation protects interests but risks souring partnership'
      },
      {
        id: 'decline',
        title: 'Decline Politely',
        description: 'Focus on your own growth strategy',
        budgetCost: 0,
        timeCost: 0,
        impact: {
          revenue: 0,
          marketShare: 0,
          brandEquity: 0,
          teamMorale: -5,
          customerSatisfaction: 0
        },
        riskLevel: 'low',
        longTermEffect: 'Maintains focus but misses growth opportunity',
        reasoning: 'Sometimes saying no to good opportunities allows focus on great ones'
      }
    ]
  },

  {
    id: 'opp-press',
    type: 'opportunity',
    severity: 'major',
    title: '📰 Major Press Feature Opportunity',
    description: 'A top-tier publication (Forbes/TechCrunch/WSJ) wants to feature your company in an upcoming article about industry innovation. They need a response in 48 hours.',
    context: 'Earned media is incredibly valuable but requires quick, strategic response.',
    triggeredInQuarter: 'Q1',
    choices: [
      {
        id: 'full-commitment',
        title: 'Full Commitment',
        description: 'Drop everything, prepare comprehensive materials, offer exclusive access',
        budgetCost: 15000,
        timeCost: 60,
        impact: {
          revenue: 80000,
          marketShare: 4,
          brandEquity: 25,
          teamMorale: 15,
          customerSatisfaction: 5
        },
        riskLevel: 'low',
        longTermEffect: 'Major credibility boost and ongoing media relationships',
        reasoning: 'Earned media in top publications provides lasting credibility and SEO value'
      },
      {
        id: 'standard-response',
        title: 'Standard Response',
        description: 'Provide requested information with existing materials',
        budgetCost: 5000,
        timeCost: 20,
        impact: {
          revenue: 40000,
          marketShare: 2,
          brandEquity: 15,
          teamMorale: 5,
          customerSatisfaction: 0
        },
        riskLevel: 'low',
        longTermEffect: 'Good exposure without major resource commitment',
        reasoning: 'Balanced approach captures value without disrupting operations'
      },
      {
        id: 'decline-timing',
        title: 'Decline - Bad Timing',
        description: 'Politely decline, focus on current priorities',
        budgetCost: 0,
        timeCost: 0,
        impact: {
          revenue: 0,
          marketShare: 0,
          brandEquity: 0,
          teamMorale: -10,
          customerSatisfaction: 0
        },
        riskLevel: 'medium',
        longTermEffect: 'Misses rare PR opportunity that may not come again',
        reasoning: 'Sometimes timing is wrong, but declining major press is rarely optimal'
      }
    ]
  }
];

export { COMPETITIVE_EVENTS, MARKET_SHIFT_EVENTS, INTERNAL_CRISIS_EVENTS, OPPORTUNITY_EVENTS };
