export const strategyTourSteps = [
  {
    id: 'welcome',
    title: 'Welcome to CMO Simulator!',
    content: 'This interactive simulation will teach you marketing strategy through hands-on experience. You\'ll make real decisions and see their impact on key business metrics.',
    target: '[data-tour="strategy-header"]',
    position: 'bottom' as const,
  },
  {
    id: 'audience',
    title: 'Define Your Target Audience',
    content: 'Start by selecting your target audience. This foundational decision will influence all your marketing tactics and their effectiveness throughout the simulation.',
    target: '[data-tour="target-audience"]',
    position: 'right' as const,
  },
  {
    id: 'positioning',
    title: 'Brand Positioning Strategy',
    content: 'Choose how you want to position your brand in the market. This affects customer perception and competitive differentiation.',
    target: '[data-tour="brand-positioning"]',
    position: 'right' as const,
  },
  {
    id: 'channels',
    title: 'Select Primary Channels',
    content: 'Pick your main marketing channels. Different channels work better for different audiences and have varying cost structures.',
    target: '[data-tour="primary-channels"]',
    position: 'top' as const,
  },
  {
    id: 'budget',
    title: 'Set Your Budget',
    content: 'Allocate your annual marketing budget. Remember, you\'ll need to manage this across 4 quarters, balancing investment with expected returns.',
    target: '[data-tour="budget-slider"]',
    position: 'top' as const,
  },
];

export const quarterlyTourSteps = [
  {
    id: 'kpi-dashboard',
    title: 'Monitor Your KPIs',
    content: 'These key performance indicators show your current business health. Watch how your decisions impact revenue, market share, customer satisfaction, and brand awareness.',
    target: '[data-tour="kpi-dashboard"]',
    position: 'bottom' as const,
  },
  {
    id: 'tactic-library',
    title: 'Choose Your Tactics',
    content: 'Browse available marketing tactics. Each has different costs, time requirements, and expected impacts. Drag tactics to your campaign to activate them.',
    target: '[data-tour="tactic-library"]',
    position: 'right' as const,
  },
  {
    id: 'resource-management',
    title: 'Manage Resources',
    content: 'Keep track of your budget and time constraints. You can\'t exceed 100% of either resource in a quarter.',
    target: '[data-tour="resource-bars"]',
    position: 'left' as const,
  },
  {
    id: 'wildcard-events',
    title: 'Handle Market Events',
    content: 'Unexpected market events will appear. Your responses to these wildcards can significantly impact your performance.',
    target: '[data-tour="wildcard-modal"]',
    position: 'top' as const,
  },
  {
    id: 'momentum-system',
    title: 'Build Momentum',
    content: 'Consecutive successful quarters build momentum, giving you bonus multipliers. Consistency pays off!',
    target: '[data-tour="momentum-indicator"]',
    position: 'bottom' as const,
  },
];

export const specialFeaturesTourSteps = [
  {
    id: 'talent-market',
    title: 'Hire Key Talent (Q2)',
    content: 'In Q2, you can hire specialized talent to boost your team\'s capabilities. Each candidate brings unique skills and impact multipliers.',
    target: '[data-tour="talent-market-button"]',
    position: 'bottom' as const,
  },
  {
    id: 'big-bet',
    title: 'Make a Big Bet (Q4)',
    content: 'Q4 offers the chance to make a strategic big bet. These high-risk, high-reward decisions can dramatically change your final results.',
    target: '[data-tour="big-bet-button"]',
    position: 'bottom' as const,
  },
  {
    id: 'debrief-analytics',
    title: 'Comprehensive Analytics',
    content: 'After completing the simulation, get detailed analytics, insights, and a professional PDF report of your performance.',
    target: '[data-tour="debrief-charts"]',
    position: 'top' as const,
  },
];

export const getAllTourSteps = () => [
  ...strategyTourSteps,
  ...quarterlyTourSteps,
  ...specialFeaturesTourSteps,
];
