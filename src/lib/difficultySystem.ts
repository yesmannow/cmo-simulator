// Difficulty System for CMO Simulator

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface DifficultyConfig {
  level: DifficultyLevel;
  displayName: string;
  description: string;

  // Starting conditions
  initialBudget: number;
  timeHorizon: '1-year' | '3-year' | '5-year';

  // Available features
  availableTactics: string[];
  wildcardFrequency: number; // 0-1, higher = more frequent
  complexityMultiplier: number; // Affects scoring complexity

  // Scoring adjustments
  kpiWeights: {
    revenue: number;
    profit: number;
    marketShare: number;
    customerSatisfaction: number;
    brandAwareness: number;
  };

  // AI commentary style
  commentaryStyle: {
    formality: 'casual' | 'professional' | 'executive';
    detailLevel: 'simple' | 'detailed' | 'comprehensive';
    encouragementLevel: 'high' | 'moderate' | 'challenging';
  };

  // Learning focus
  learningObjectives: string[];
  recommendedFor: string[];
}

export const difficultyConfigs: Record<DifficultyLevel, DifficultyConfig> = {
  beginner: {
    level: 'beginner',
    displayName: 'Marketing Fundamentals',
    description: 'Perfect for learning basic marketing concepts. Simplified decisions, clear guidance, and forgiving scoring.',

    initialBudget: 300000,
    timeHorizon: '1-year',

    availableTactics: [
      'social-media-ads',
      'email-marketing',
      'content-marketing',
      'seo-basics',
      'google-ads',
      'facebook-ads'
    ],
    wildcardFrequency: 0.3,
    complexityMultiplier: 0.7,

    kpiWeights: {
      revenue: 0.3,
      profit: 0.2,
      marketShare: 0.2,
      customerSatisfaction: 0.15,
      brandAwareness: 0.15
    },

    commentaryStyle: {
      formality: 'casual',
      detailLevel: 'simple',
      encouragementLevel: 'high'
    },

    learningObjectives: [
      'Understand basic marketing concepts',
      'Learn budget allocation fundamentals',
      'Experience cause-and-effect relationships',
      'Build confidence in decision making'
    ],
    recommendedFor: [
      'New to marketing',
      'Students learning business fundamentals',
      'Anyone wanting to understand marketing basics'
    ]
  },

  intermediate: {
    level: 'intermediate',
    displayName: 'Strategic Marketing',
    description: 'Balanced challenge for developing marketing strategy skills. Realistic decisions with moderate complexity.',

    initialBudget: 1000000,
    timeHorizon: '3-year',

    availableTactics: [
      'social-media-ads',
      'email-marketing',
      'content-marketing',
      'seo-basics',
      'seo-advanced',
      'google-ads',
      'facebook-ads',
      'influencer-marketing',
      'pr-campaigns',
      'events',
      'partnerships'
    ],
    wildcardFrequency: 0.6,
    complexityMultiplier: 1.0,

    kpiWeights: {
      revenue: 0.25,
      profit: 0.25,
      marketShare: 0.2,
      customerSatisfaction: 0.15,
      brandAwareness: 0.15
    },

    commentaryStyle: {
      formality: 'professional',
      detailLevel: 'detailed',
      encouragementLevel: 'moderate'
    },

    learningObjectives: [
      'Develop strategic thinking',
      'Master marketing mix decisions',
      'Understand competitive dynamics',
      'Learn to balance multiple objectives'
    ],
    recommendedFor: [
      'Marketing professionals',
      'Business students',
      'Entrepreneurs',
      'Anyone with basic marketing knowledge'
    ]
  },

  advanced: {
    level: 'advanced',
    displayName: 'CMO Challenge',
    description: 'High-stakes simulation for experienced marketers. Complex decisions, realistic constraints, and demanding scoring.',

    initialBudget: 2000000,
    timeHorizon: '5-year',

    availableTactics: [
      'social-media-ads',
      'email-marketing',
      'content-marketing',
      'seo-basics',
      'seo-advanced',
      'google-ads',
      'facebook-ads',
      'influencer-marketing',
      'pr-campaigns',
      'events',
      'partnerships',
      'brand-ambassador',
      'crisis-management',
      'international-expansion',
      'product-launch',
      'mergers-acquisitions'
    ],
    wildcardFrequency: 0.9,
    complexityMultiplier: 1.5,

    kpiWeights: {
      revenue: 0.2,
      profit: 0.3,
      marketShare: 0.2,
      customerSatisfaction: 0.15,
      brandAwareness: 0.15
    },

    commentaryStyle: {
      formality: 'executive',
      detailLevel: 'comprehensive',
      encouragementLevel: 'challenging'
    },

    learningObjectives: [
      'Master executive-level decision making',
      'Navigate complex competitive landscapes',
      'Optimize for long-term strategic goals',
      'Manage high-stakes marketing investments'
    ],
    recommendedFor: [
      'Senior marketing professionals',
      'CMOs and marketing directors',
      'MBA students',
      'Experienced strategists'
    ]
  }
};

// Helper functions
export const getDifficultyConfig = (level: DifficultyLevel): DifficultyConfig => {
  return difficultyConfigs[level];
};

export const getDifficultyByBudget = (budget: number): DifficultyLevel => {
  if (budget <= 500000) return 'beginner';
  if (budget <= 1500000) return 'intermediate';
  return 'advanced';
};

export const getRecommendedDifficulty = (userExperience?: string): DifficultyLevel => {
  switch (userExperience) {
    case 'beginner':
    case 'new-to-marketing':
      return 'beginner';
    case 'some-experience':
    case 'marketing-professional':
      return 'intermediate';
    case 'experienced':
    case 'cmo':
    case 'senior-marketer':
      return 'advanced';
    default:
      return 'intermediate';
  }
};
