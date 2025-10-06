import { Achievement } from '@/lib/database/types';

export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'id' | 'created_at'>[] = [
  // Performance Achievements
  {
    name: 'Marketing Genius',
    description: 'Achieve a perfect score of 100 points',
    icon: '🧠',
    category: 'Performance',
    rarity: 'legendary',
    points: 1000,
    criteria: {
      min_score: 100
    }
  },
  {
    name: 'Grade A Student',
    description: 'Earn an A+ grade in your simulation',
    icon: '🏆',
    category: 'Performance',
    rarity: 'epic',
    points: 500,
    criteria: {
      required_grade: 'A+'
    }
  },
  {
    name: 'Honor Roll',
    description: 'Earn an A grade in your simulation',
    icon: '🎖️',
    category: 'Performance',
    rarity: 'rare',
    points: 250,
    criteria: {
      required_grade: 'A'
    }
  },
  {
    name: 'Above Average',
    description: 'Score above 75 points',
    icon: '📈',
    category: 'Performance',
    rarity: 'common',
    points: 100,
    criteria: {
      min_score: 75
    }
  },

  // ROI Achievements
  {
    name: 'ROI Master',
    description: 'Achieve over 500% return on investment',
    icon: '💰',
    category: 'Financial',
    rarity: 'legendary',
    points: 800,
    criteria: {
      min_roi: 500
    }
  },
  {
    name: 'Profit Prophet',
    description: 'Achieve over 300% return on investment',
    icon: '💎',
    category: 'Financial',
    rarity: 'epic',
    points: 400,
    criteria: {
      min_roi: 300
    }
  },
  {
    name: 'Money Maker',
    description: 'Achieve over 200% return on investment',
    icon: '💵',
    category: 'Financial',
    rarity: 'rare',
    points: 200,
    criteria: {
      min_roi: 200
    }
  },
  {
    name: 'Profitable',
    description: 'Achieve positive return on investment',
    icon: '💲',
    category: 'Financial',
    rarity: 'common',
    points: 50,
    criteria: {
      min_roi: 0
    }
  },

  // Market Share Achievements
  {
    name: 'Market Dominator',
    description: 'Capture over 40% market share',
    icon: '👑',
    category: 'Market',
    rarity: 'legendary',
    points: 600,
    criteria: {
      min_market_share: 40
    }
  },
  {
    name: 'Market Leader',
    description: 'Capture over 30% market share',
    icon: '🎯',
    category: 'Market',
    rarity: 'epic',
    points: 300,
    criteria: {
      min_market_share: 30
    }
  },
  {
    name: 'Strong Competitor',
    description: 'Capture over 20% market share',
    icon: '🚀',
    category: 'Market',
    rarity: 'rare',
    points: 150,
    criteria: {
      min_market_share: 20
    }
  },
  {
    name: 'Market Player',
    description: 'Capture over 10% market share',
    icon: '📊',
    category: 'Market',
    rarity: 'common',
    points: 75,
    criteria: {
      min_market_share: 10
    }
  },

  // Strategic Achievements
  {
    name: 'Big Bet Champion',
    description: 'Successfully execute a big bet strategy',
    icon: '⚡',
    category: 'Strategy',
    rarity: 'epic',
    points: 400,
    criteria: {
      requires_big_bet: true,
      requires_big_bet_success: true
    }
  },
  {
    name: 'Risk Taker',
    description: 'Make a big bet decision',
    icon: '🎲',
    category: 'Strategy',
    rarity: 'rare',
    points: 200,
    criteria: {
      requires_big_bet: true
    }
  },
  {
    name: 'Team Builder',
    description: 'Hire 3 or more talented team members',
    icon: '👥',
    category: 'Strategy',
    rarity: 'rare',
    points: 150,
    criteria: {
      min_talent_hired: 3
    }
  },
  {
    name: 'Talent Scout',
    description: 'Hire at least one talented team member',
    icon: '🔍',
    category: 'Strategy',
    rarity: 'common',
    points: 75,
    criteria: {
      min_talent_hired: 1
    }
  },

  // Speed Achievements
  {
    name: 'Speed Demon',
    description: 'Complete simulation in under 15 minutes',
    icon: '⚡',
    category: 'Speed',
    rarity: 'epic',
    points: 300,
    criteria: {
      max_completion_time: 15
    }
  },
  {
    name: 'Quick Thinker',
    description: 'Complete simulation in under 30 minutes',
    icon: '🏃',
    category: 'Speed',
    rarity: 'rare',
    points: 150,
    criteria: {
      max_completion_time: 30
    }
  },
  {
    name: 'Efficient',
    description: 'Complete simulation in under 45 minutes',
    icon: '⏱️',
    category: 'Speed',
    rarity: 'common',
    points: 75,
    criteria: {
      max_completion_time: 45
    }
  },

  // Combo Achievements
  {
    name: 'Triple Crown',
    description: 'Achieve A+ grade, 300%+ ROI, and 30%+ market share',
    icon: '👑',
    category: 'Combo',
    rarity: 'legendary',
    points: 1500,
    criteria: {
      required_grade: 'A+',
      min_roi: 300,
      min_market_share: 30
    }
  },
  {
    name: 'Perfect Storm',
    description: 'Achieve A grade with successful big bet and 3+ talent hires',
    icon: '🌟',
    category: 'Combo',
    rarity: 'legendary',
    points: 1200,
    criteria: {
      required_grade: 'A',
      requires_big_bet_success: true,
      min_talent_hired: 3
    }
  },
  {
    name: 'Strategic Excellence',
    description: 'Achieve B+ grade with big bet and talent hire',
    icon: '🎖️',
    category: 'Combo',
    rarity: 'epic',
    points: 600,
    criteria: {
      min_score: 85,
      requires_big_bet: true,
      min_talent_hired: 1
    }
  },

  // Special Achievements
  {
    name: 'First Timer',
    description: 'Complete your first simulation',
    icon: '🎉',
    category: 'Milestone',
    rarity: 'common',
    points: 100,
    criteria: {
      min_score: 0 // Everyone gets this
    }
  },
  {
    name: 'Comeback Kid',
    description: 'Achieve A grade after previously scoring below 60',
    icon: '🔄',
    category: 'Special',
    rarity: 'epic',
    points: 500,
    criteria: {
      required_grade: 'A',
      // This would need special logic to check previous scores
    }
  },
  {
    name: 'Consistency Champion',
    description: 'Achieve 3 consecutive A grades',
    icon: '🔥',
    category: 'Special',
    rarity: 'legendary',
    points: 1000,
    criteria: {
      // This would need special logic to check consecutive scores
    }
  }
];

export const ACHIEVEMENT_CATEGORIES = [
  'Performance',
  'Financial',
  'Market',
  'Strategy',
  'Speed',
  'Combo',
  'Milestone',
  'Special'
];

export const RARITY_COLORS = {
  common: 'bg-gray-100 text-gray-800 border-gray-300',
  rare: 'bg-blue-100 text-blue-800 border-blue-300',
  epic: 'bg-purple-100 text-purple-800 border-purple-300',
  legendary: 'bg-yellow-100 text-yellow-800 border-yellow-300'
};

export const RARITY_POINTS = {
  common: 100,
  rare: 200,
  epic: 500,
  legendary: 1000
};
