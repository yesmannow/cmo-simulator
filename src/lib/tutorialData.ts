export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

export const tutorialSteps: Record<string, TutorialStep[]> = {
  welcome: [
    {
      id: 'welcome-1',
      title: 'Welcome to CMO Simulator!',
      content: 'This interactive simulation teaches you real marketing strategy through hands-on experience. You\'ll make decisions that affect revenue, market share, and customer satisfaction.',
      position: 'bottom'
    },
    {
      id: 'welcome-2',
      title: 'Your Mission',
      content: 'As Chief Marketing Officer, you\'ll manage a $2M budget across 4 quarters. Your goal is to maximize revenue, profit, market share, and customer satisfaction.',
      position: 'bottom'
    },
    {
      id: 'welcome-3',
      title: 'Learning Objectives',
      content: 'By the end of this simulation, you\'ll understand budget allocation, marketing tactics, competitive strategy, and performance analysis.',
      position: 'bottom'
    }
  ],

  dashboard: [
    {
      id: 'dashboard-1',
      title: 'Your Dashboard',
      content: 'This is your command center. Track KPIs, view simulation history, and access your profile settings.',
      target: '.dashboard-header',
      position: 'bottom'
    },
    {
      id: 'dashboard-2',
      title: 'KPI Cards',
      content: 'Monitor your total revenue, profit, market share, and customer satisfaction across all simulations.',
      target: '.kpi-cards',
      position: 'bottom'
    },
    {
      id: 'dashboard-3',
      title: 'Simulation History',
      content: 'Click on any company name to continue that simulation or start a new one.',
      target: '.simulation-table',
      position: 'top'
    },
    {
      id: 'dashboard-4',
      title: 'Theme Customization',
      content: 'Personalize your experience with different visual themes that match your brand preferences.',
      target: '.theme-picker',
      position: 'left'
    }
  ],

  setup: [
    {
      id: 'setup-1',
      title: 'Phase 0: Strategic Setup',
      content: 'Define your company profile, industry, and competitive landscape. These factors influence how tactics perform.',
      target: '.setup-form',
      position: 'right'
    },
    {
      id: 'setup-2',
      title: 'Budget Allocation',
      content: 'Distribute your budget across three areas: Brand Awareness (top-of-funnel), Lead Generation (middle-funnel), and Conversion Optimization (bottom-funnel).',
      target: '.budget-sliders',
      position: 'left'
    },
    {
      id: 'setup-3',
      title: 'Time Horizon',
      content: 'Choose between 1-year (fast results), 3-year (balanced growth), or 5-year (long-term strategy) timelines.',
      target: '.time-horizon',
      position: 'bottom'
    }
  ],

  strategy: [
    {
      id: 'strategy-1',
      title: 'Strategic Planning',
      content: 'Define your target audience, brand positioning, and primary marketing channels. These decisions guide your quarterly tactics.',
      target: '.strategy-form',
      position: 'right'
    },
    {
      id: 'strategy-2',
      title: 'Target Audience',
      content: 'Who are you trying to reach? B2B vs B2C, demographics, and pain points affect tactic effectiveness.',
      target: '.target-audience',
      position: 'bottom'
    },
    {
      id: 'strategy-3',
      title: 'Brand Positioning',
      content: 'How do you want to be perceived? Premium quality, best value, innovation leader, or customer-focused?',
      target: '.brand-positioning',
      position: 'bottom'
    }
  ],

  quarter: [
    {
      id: 'quarter-1',
      title: 'Quarterly Decision Making',
      content: 'Each quarter you\'ll allocate budget and time across marketing tactics, handle wildcard events, and make strategic choices.',
      target: '.quarter-header',
      position: 'bottom'
    },
    {
      id: 'quarter-2',
      title: 'Tactic Selection',
      content: 'Choose tactics that align with your strategy. Each has different costs, time requirements, and expected outcomes.',
      target: '.tactic-selection',
      position: 'top'
    },
    {
      id: 'quarter-3',
      title: 'Wildcard Events',
      content: 'Random opportunities and crises appear. Your responses can significantly impact results.',
      target: '.wildcard-events',
      position: 'left'
    },
    {
      id: 'quarter-4',
      title: 'Results Analysis',
      content: 'Review how your decisions affected revenue, market share, customer satisfaction, and other KPIs.',
      target: '.results-summary',
      position: 'bottom'
    }
  ],

  abtest: [
    {
      id: 'abtest-1',
      title: 'A/B Testing Mini-Game',
      content: 'In Q1, you\'ll run an A/B test to optimize conversion rates. Choose the winning variant wisely!',
      target: '.abtest-container',
      position: 'top'
    },
    {
      id: 'abtest-2',
      title: 'Test Variables',
      content: 'Compare headlines, images, CTAs, and layouts. The winning combination affects your entire campaign.',
      target: '.test-variants',
      position: 'bottom'
    },
    {
      id: 'abtest-3',
      title: 'Conversion Impact',
      content: 'Choosing correctly can boost conversions by 20-50%. Wrong choices can hurt performance.',
      target: '.conversion-impact',
      position: 'right'
    }
  ],

  debrief: [
    {
      id: 'debrief-1',
      title: 'Campaign Debrief',
      content: 'Review your overall performance, strategic decisions, and get personalized recommendations for improvement.',
      target: '.debrief-header',
      position: 'bottom'
    },
    {
      id: 'debrief-2',
      title: 'Performance Score',
      content: 'Your final score is calculated based on revenue, market share, customer satisfaction, and strategic execution.',
      target: '.performance-score',
      position: 'top'
    },
    {
      id: 'debrief-3',
      title: 'Strategic Insights',
      content: 'Learn what worked, what didn\'t, and how to improve your marketing strategy for real-world application.',
      target: '.strategic-insights',
      position: 'left'
    }
  ]
};

export const getTutorialForPhase = (phase: string): TutorialStep[] => {
  return tutorialSteps[phase] || [];
};

export const getAllTutorials = (): TutorialStep[] => {
  return Object.values(tutorialSteps).flat();
};
