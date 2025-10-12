import { SimulationContext } from '@/lib/simMachine';
import { LeaderboardEntry } from '@/lib/database/types';
import { Tactic } from '@/lib/tactics';

// Mock simulation contexts for testing
export const generateMockSimulationContext = (overrides: Partial<SimulationContext> = {}): SimulationContext => {
  const baseContext: SimulationContext = {
    strategy: {
      targetAudience: 'Young Professionals',
      brandPositioning: 'Premium Quality',
      primaryChannels: ['Digital Marketing', 'Social Media', 'Content Marketing'],
      companyName: 'TechCorp Solutions',
      industry: 'Technology',
      strategyType: 'Growth',
    },
    totalBudget: 1000000,
    currentQuarter: 'Q1',
    quarters: {
      Q1: {
        tactics: [
          {
            id: 'social-media-campaign',
            name: 'Social Media Campaign',
            description: 'Comprehensive social media marketing across platforms',
            category: 'digital',
            cost: 50000,
            timeRequired: 20,
            expectedImpact: {
              revenue: 75000,
              marketShare: 2,
              customerSatisfaction: 5,
              brandAwareness: 8,
            },
            channels: ['Social Media'],
            audienceReach: 100000,
            difficulty: 'medium',
          },
          {
            id: 'content-marketing',
            name: 'Content Marketing',
            description: 'Blog posts, whitepapers, and thought leadership content',
            category: 'content',
            cost: 30000,
            timeRequired: 15,
            expectedImpact: {
              revenue: 45000,
              marketShare: 1,
              customerSatisfaction: 3,
              brandAwareness: 6,
            },
            channels: ['Content Marketing'],
            audienceReach: 75000,
            difficulty: 'easy',
          },
        ],
        budgetSpent: 80000,
        timeSpent: 35,
        wildcardEvents: [
          {
            id: 'competitor-launch',
            title: 'Competitor Product Launch',
            description: 'A major competitor has launched a competing product',
            type: 'competitive_threat',
            severity: 'medium',
            choices: [
              {
                id: 'aggressive-response',
                title: 'Launch Aggressive Counter-Campaign',
                description: 'Increase marketing spend to counter the threat',
                cost: 25000,
                impact: {
                  revenue: -10000,
                  marketShare: -1,
                  customerSatisfaction: 2,
                  brandAwareness: 3,
                },
              },
              {
                id: 'wait-and-see',
                title: 'Monitor and Adapt',
                description: 'Wait to see market reaction before responding',
                cost: 0,
                impact: {
                  revenue: -5000,
                  marketShare: -0.5,
                  customerSatisfaction: 0,
                  brandAwareness: 0,
                },
              },
            ],
            selectedChoice: 'aggressive-response',
            impact: {
              revenue: -10000,
              marketShare: -1,
              customerSatisfaction: 2,
              brandAwareness: 3,
            },
          },
        ],
        results: {
          revenue: 110000,
          profit: 30000,
          marketShare: 12.5,
          customerSatisfaction: 78,
          brandAwareness: 65,
        },
      },
      Q2: {
        tactics: [
          {
            id: 'influencer-partnership',
            name: 'Influencer Partnership',
            description: 'Partner with industry influencers for product promotion',
            category: 'partnerships',
            cost: 75000,
            timeRequired: 25,
            expectedImpact: {
              revenue: 120000,
              marketShare: 3,
              customerSatisfaction: 4,
              brandAwareness: 10,
            },
            channels: ['Social Media', 'Influencer Marketing'],
            audienceReach: 200000,
            difficulty: 'hard',
          },
        ],
        budgetSpent: 75000,
        timeSpent: 25,
        wildcardEvents: [],
        talentHired: [
          {
            id: 'sarah-chen',
            name: 'Sarah Chen',
            role: 'Digital Marketing Specialist',
            experience: 'Senior',
            skills: ['SEO', 'PPC', 'Analytics'],
            cost: 15000,
            impact: {
              revenue: 1.15,
              marketShare: 1.1,
              customerSatisfaction: 1.05,
              brandAwareness: 1.2,
            },
            description: 'Expert in digital marketing with 8+ years experience',
            previousCompany: 'Google',
            specialization: 'Performance Marketing',
          },
        ],
        results: {
          revenue: 138000,
          profit: 63000,
          marketShare: 15.8,
          customerSatisfaction: 82,
          brandAwareness: 75,
        },
      },
      Q3: {
        tactics: [
          {
            id: 'product-launch-campaign',
            name: 'Product Launch Campaign',
            description: 'Comprehensive campaign for new product launch',
            category: 'campaigns',
            cost: 100000,
            timeRequired: 40,
            expectedImpact: {
              revenue: 200000,
              marketShare: 5,
              customerSatisfaction: 8,
              brandAwareness: 15,
            },
            channels: ['Digital Marketing', 'Traditional Media', 'Events'],
            audienceReach: 500000,
            difficulty: 'hard',
          },
        ],
        budgetSpent: 100000,
        timeSpent: 40,
        wildcardEvents: [
          {
            id: 'economic-downturn',
            title: 'Economic Uncertainty',
            description: 'Market conditions have become uncertain, affecting consumer spending',
            type: 'economic_shift',
            severity: 'high',
            choices: [
              {
                id: 'reduce-spending',
                title: 'Reduce Marketing Spend',
                description: 'Cut marketing budget to preserve cash',
                cost: -20000,
                impact: {
                  revenue: -30000,
                  marketShare: -2,
                  customerSatisfaction: -1,
                  brandAwareness: -3,
                },
              },
              {
                id: 'maintain-course',
                title: 'Maintain Investment',
                description: 'Continue planned marketing investments',
                cost: 0,
                impact: {
                  revenue: -10000,
                  marketShare: 0,
                  customerSatisfaction: 1,
                  brandAwareness: 2,
                },
              },
            ],
            selectedChoice: 'maintain-course',
            impact: {
              revenue: -10000,
              marketShare: 0,
              customerSatisfaction: 1,
              brandAwareness: 2,
            },
          },
        ],
        results: {
          revenue: 190000,
          profit: 90000,
          marketShare: 20.8,
          customerSatisfaction: 91,
          brandAwareness: 92,
        },
      },
      Q4: {
        tactics: [
          {
            id: 'holiday-campaign',
            name: 'Holiday Marketing Campaign',
            description: 'Seasonal marketing push for holiday sales',
            category: 'seasonal',
            cost: 80000,
            timeRequired: 30,
            expectedImpact: {
              revenue: 150000,
              marketShare: 3,
              customerSatisfaction: 5,
              brandAwareness: 8,
            },
            channels: ['Digital Marketing', 'Retail', 'Social Media'],
            audienceReach: 300000,
            difficulty: 'medium',
          },
        ],
        budgetSpent: 80000,
        timeSpent: 30,
        wildcardEvents: [],
        bigBetMade: {
          id: 'ai-integration',
          name: 'AI-Powered Personalization',
          description: 'Implement AI-driven personalization across all marketing channels',
          category: 'Technology Innovation',
          risk: 'high',
          cost: 150000,
          timeRequired: 45,
          strategy: 'Leverage AI to create personalized customer experiences',
          potentialImpact: {
            revenue: { min: 100000, max: 400000 },
            marketShare: { min: 2, max: 8 },
            customerSatisfaction: { min: 5, max: 15 },
            brandAwareness: { min: 3, max: 12 },
          },
          successProbability: 0.7,
        },
        results: {
          revenue: 280000,
          profit: 150000,
          marketShare: 28.5,
          customerSatisfaction: 95,
          brandAwareness: 98,
        },
      },
    },
    wildcards: [
      {
        id: 'competitor-launch',
        title: 'Competitor Product Launch',
        description: 'A major competitor has launched a competing product',
        type: 'competitive_threat',
        severity: 'medium',
        choices: [
          {
            id: 'aggressive-response',
            title: 'Launch Aggressive Counter-Campaign',
            description: 'Increase marketing spend to counter the threat',
            cost: 25000,
            impact: {
              revenue: -10000,
              marketShare: -1,
              customerSatisfaction: 2,
              brandAwareness: 3,
            },
          },
        ],
        selectedChoice: 'aggressive-response',
      },
    ],
    hiredTalent: [
      {
        id: 'sarah-chen',
        name: 'Sarah Chen',
        role: 'Digital Marketing Specialist',
        experience: 'Senior',
        skills: ['SEO', 'PPC', 'Analytics'],
        cost: 15000,
        impact: {
          revenue: 1.15,
          marketShare: 1.1,
          customerSatisfaction: 1.05,
          brandAwareness: 1.2,
        },
        description: 'Expert in digital marketing with 8+ years experience',
        previousCompany: 'Google',
        specialization: 'Performance Marketing',
      },
    ],
    selectedBigBet: {
      id: 'ai-integration',
      name: 'AI-Powered Personalization',
      description: 'Implement AI-driven personalization across all marketing channels',
      category: 'Technology Innovation',
      risk: 'high',
      cost: 150000,
      timeRequired: 45,
      strategy: 'Leverage AI to create personalized customer experiences',
      potentialImpact: {
        revenue: { min: 100000, max: 400000 },
        marketShare: { min: 2, max: 8 },
        customerSatisfaction: { min: 5, max: 15 },
        brandAwareness: { min: 3, max: 12 },
      },
      successProbability: 0.7,
    },
    bigBetOutcome: {
      success: true,
      actualImpact: {
        revenue: 320000,
        marketShare: 6.5,
        brandAwareness: 10,
        customerSatisfaction: 12,
      },
    },
    morale: 85,
    brandEquity: 78,
    completionTimeMinutes: 28,
    finalResults: {
      score: 92,
      grade: 'A',
      finalKPIs: {
        revenue: 718000,
        profit: 333000,
        marketShare: 28.5,
        customerSatisfaction: 95,
        brandAwareness: 98,
      },
      quarterlyBreakdown: {
        Q1: {
          tactics: [],
          budgetSpent: 80000,
          timeSpent: 35,
          wildcardEvents: [],
          results: {
            revenue: 110000,
            profit: 30000,
            marketShare: 12.5,
            customerSatisfaction: 78,
            brandAwareness: 65,
          },
        },
        Q2: {
          tactics: [],
          budgetSpent: 75000,
          timeSpent: 25,
          wildcardEvents: [],
          results: {
            revenue: 138000,
            profit: 63000,
            marketShare: 15.8,
            customerSatisfaction: 82,
            brandAwareness: 75,
          },
        },
        Q3: {
          tactics: [],
          budgetSpent: 100000,
          timeSpent: 40,
          wildcardEvents: [],
          results: {
            revenue: 190000,
            profit: 90000,
            marketShare: 20.8,
            customerSatisfaction: 91,
            brandAwareness: 92,
          },
        },
        Q4: {
          tactics: [],
          budgetSpent: 80000,
          timeSpent: 30,
          wildcardEvents: [],
          results: {
            revenue: 280000,
            profit: 150000,
            marketShare: 28.5,
            customerSatisfaction: 95,
            brandAwareness: 98,
          },
        },
      },
      recommendations: [
        'Excellent strategic execution with consistent growth across all quarters',
        'AI-powered personalization big bet paid off significantly',
        'Strong talent acquisition in Q2 boosted overall performance',
        'Consider expanding successful tactics in future simulations',
      ],
      wildcardEvents: [],
    },
  };
  const { finalResults: finalResultsOverride, ...restOverrides } = overrides;

  const mergedFinalResults = baseContext.finalResults
    ? { ...baseContext.finalResults, ...(finalResultsOverride || {}) }
    : finalResultsOverride;

  let context: SimulationContext = {
    ...baseContext,
    ...restOverrides,
    finalResults: mergedFinalResults,
  };

  const quarterlySpend = Object.entries(context.quarters).reduce(
    (acc, [quarterKey, data]) => {
      acc[quarterKey] = data.budgetSpent;
      return acc;
    },
    {} as Record<string, number>
  );

  const quarterlyTimeSpent = Object.entries(context.quarters).reduce(
    (acc, [quarterKey, data]) => {
      acc[quarterKey] = data.timeSpent;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalBudgetSpent = Object.values(quarterlySpend).reduce((sum, value) => sum + value, 0);
  const totalTimeSpent = Object.values(quarterlyTimeSpent).reduce((sum, value) => sum + value, 0);

  if (context.finalResults) {
    context = {
      ...context,
      finalResults: {
        ...context.finalResults,
        quarterlyBreakdown: context.finalResults.quarterlyBreakdown || context.quarters,
        totalBudgetSpent,
        totalTimeSpent,
        quarterlySpend,
        quarterlyTimeSpent,
      },
    };
  }

  return context;
};

// Generate multiple mock simulation runs
export const generateMockSimulationRuns = (count: number = 5): SimulationContext[] => {
  const variations = [
    {
      strategy: { 
        companyName: 'InnovateTech', 
        industry: 'Technology', 
        strategyType: 'Innovation',
        targetAudience: 'Tech Enthusiasts',
        brandPositioning: 'Cutting-edge Innovation'
      },
      finalResults: { score: 88, grade: 'A' as const },
      completionTimeMinutes: 32,
    },
    {
      strategy: { 
        companyName: 'HealthFirst', 
        industry: 'Healthcare', 
        strategyType: 'Premium',
        targetAudience: 'Healthcare Professionals',
        brandPositioning: 'Trusted Healthcare Partner'
      },
      finalResults: { score: 76, grade: 'B' as const },
      completionTimeMinutes: 45,
    },
    {
      strategy: { 
        companyName: 'EcoSolutions', 
        industry: 'Sustainability', 
        strategyType: 'Value',
        targetAudience: 'Environmentally Conscious Consumers',
        brandPositioning: 'Sustainable Future'
      },
      finalResults: { score: 94, grade: 'A+' as const },
      completionTimeMinutes: 22,
    },
    {
      strategy: { 
        companyName: 'FinanceFlow', 
        industry: 'Finance', 
        strategyType: 'Growth',
        targetAudience: 'Small Business Owners',
        brandPositioning: 'Financial Empowerment'
      },
      finalResults: { score: 82, grade: 'A' as const },
      completionTimeMinutes: 38,
    },
    {
      strategy: { 
        companyName: 'RetailRevolution', 
        industry: 'Retail', 
        strategyType: 'Value',
        targetAudience: 'Budget-Conscious Families',
        brandPositioning: 'Affordable Quality'
      },
      finalResults: { score: 69, grade: 'C' as const },
      completionTimeMinutes: 52,
    },
  ];

  return Array.from({ length: count }, (_, i) => {
    const variation = variations[i % variations.length];
    return generateMockSimulationContext(variation);
  });
};

// Generate mock leaderboard entries
export const generateMockLeaderboardEntries = (count: number = 10): Partial<LeaderboardEntry>[] => {
  const companies = [
    'TechCorp Solutions', 'InnovateTech', 'HealthFirst', 'EcoSolutions', 'FinanceFlow',
    'RetailRevolution', 'DataDriven Inc', 'CloudNine Systems', 'GreenTech Innovations', 'SmartSolutions'
  ];
  
  const industries = ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Education'];
  const strategies = ['Growth', 'Premium', 'Value', 'Innovation'];
  const usernames = [
    'MarketingMaven', 'StrategyKing', 'CMOExpert', 'GrowthHacker', 'BrandBuilder',
    'DataDriven', 'CreativeGenius', 'ROIMaster', 'InnovationLead', 'MarketLeader'
  ];

  return Array.from({ length: count }, (_, i) => {
    const score = Math.floor(Math.random() * 40) + 60; // 60-100
    const revenue = Math.floor(Math.random() * 800000) + 200000; // 200k-1M
    const roi = Math.floor(Math.random() * 400) + 50; // 50-450%
    
    const getGrade = (score: number): 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' => {
      if (score >= 95) return 'A+';
      if (score >= 85) return 'A';
      if (score >= 75) return 'B';
      if (score >= 65) return 'C';
      if (score >= 55) return 'D';
      return 'F';
    };

    return {
      username: usernames[i % usernames.length] + (i > 9 ? i : ''),
      company_name: companies[i % companies.length],
      industry: industries[Math.floor(Math.random() * industries.length)],
      strategy_type: strategies[Math.floor(Math.random() * strategies.length)],
      final_score: score,
      grade: getGrade(score),
      total_revenue: revenue,
      final_market_share: Math.random() * 30 + 5, // 5-35%
      final_satisfaction: Math.random() * 20 + 75, // 75-95%
      final_awareness: Math.random() * 25 + 60, // 60-85%
      roi_percentage: roi,
      total_budget: 1000000,
      budget_utilized: Math.floor(Math.random() * 400000) + 600000, // 600k-1M
      quarters_completed: 4,
      wildcards_handled: Math.floor(Math.random() * 5),
      talent_hired: Math.floor(Math.random() * 4),
      big_bet_made: Math.random() > 0.6,
      big_bet_success: Math.random() > 0.4,
      completion_time_minutes: Math.floor(Math.random() * 40) + 20, // 20-60 min
      season: '2025-Q4',
      is_verified: true,
    };
  });
};
