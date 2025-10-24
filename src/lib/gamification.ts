/**
 * Gamification System
 * Achievements, scoring, leaderboards, and progression
 */

import { Achievement, AchievementCategory, AchievementRarity, Leaderboard, LeaderboardEntry } from '@/types';

// ============================================================================
// ACHIEVEMENT DEFINITIONS
// ============================================================================

export const ACHIEVEMENTS: Achievement[] = [
  // Revenue Achievements
  {
    id: 'first_million',
    name: 'Million Dollar Milestone',
    description: 'Generate $1M in revenue',
    category: 'revenue',
    rarity: 'common',
    icon: '💰',
    points: 100,
    unlocked: false,
    requirement: 'Generate $1,000,000 in total revenue',
    reward: '+100 points'
  },
  {
    id: 'ten_million',
    name: 'Revenue Titan',
    description: 'Generate $10M in revenue',
    category: 'revenue',
    rarity: 'rare',
    icon: '💎',
    points: 500,
    unlocked: false,
    requirement: 'Generate $10,000,000 in total revenue',
    reward: '+500 points'
  },
  {
    id: 'hundred_million',
    name: 'Marketing Mogul',
    description: 'Generate $100M in revenue',
    category: 'revenue',
    rarity: 'epic',
    icon: '👑',
    points: 2000,
    unlocked: false,
    requirement: 'Generate $100,000,000 in total revenue',
    reward: '+2000 points'
  },

  // Efficiency Achievements
  {
    id: 'roi_master',
    name: 'ROI Master',
    description: 'Achieve 300% ROI in a quarter',
    category: 'efficiency',
    rarity: 'rare',
    icon: '📈',
    points: 300,
    unlocked: false,
    requirement: 'Achieve 300% or higher ROI in any quarter',
    reward: '+300 points'
  },
  {
    id: 'perfect_allocation',
    name: 'Perfect Allocation',
    description: 'Spend exactly 100% of budget with no waste',
    category: 'efficiency',
    rarity: 'common',
    icon: '🎯',
    points: 150,
    unlocked: false,
    requirement: 'Allocate budget with less than 1% variance',
    reward: '+150 points'
  },
  {
    id: 'channel_master',
    name: 'Channel Master',
    description: 'Achieve 200%+ ROI on all channels in one quarter',
    category: 'efficiency',
    rarity: 'epic',
    icon: '🌟',
    points: 1000,
    unlocked: false,
    requirement: 'All marketing channels achieve 200%+ ROI',
    reward: '+1000 points'
  },

  // Strategy Achievements
  {
    id: 'market_leader',
    name: 'Market Leader',
    description: 'Capture 25% market share',
    category: 'strategy',
    rarity: 'rare',
    icon: '🏆',
    points: 400,
    unlocked: false,
    requirement: 'Reach 25% market share',
    reward: '+400 points'
  },
  {
    id: 'market_dominator',
    name: 'Market Dominator',
    description: 'Capture 50% market share',
    category: 'strategy',
    rarity: 'legendary',
    icon: '👑',
    points: 3000,
    unlocked: false,
    requirement: 'Reach 50% market share',
    reward: '+3000 points + Special Badge'
  },
  {
    id: 'crisis_manager',
    name: 'Crisis Manager',
    description: 'Successfully navigate 5 crisis events',
    category: 'strategy',
    rarity: 'rare',
    icon: '🛡️',
    points: 350,
    unlocked: false,
    requirement: 'Handle 5 crisis events successfully',
    reward: '+350 points'
  },

  // Innovation Achievements
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Invest heavily in emerging channels',
    category: 'innovation',
    rarity: 'common',
    icon: '🚀',
    points: 200,
    unlocked: false,
    requirement: 'Allocate 50%+ budget to digital channels',
    reward: '+200 points'
  },
  {
    id: 'ai_powered',
    name: 'AI-Powered CMO',
    description: 'Follow 10 AI recommendations',
    category: 'innovation',
    rarity: 'rare',
    icon: '🤖',
    points: 300,
    unlocked: false,
    requirement: 'Accept and apply 10 AI recommendations',
    reward: '+300 points'
  },
  {
    id: 'data_driven',
    name: 'Data-Driven Decision Maker',
    description: 'Run 20 scenario analyses',
    category: 'innovation',
    rarity: 'rare',
    icon: '📊',
    points: 250,
    unlocked: false,
    requirement: 'Create and analyze 20 scenarios',
    reward: '+250 points'
  },

  // Consistency Achievements
  {
    id: 'consistent_growth',
    name: 'Consistent Growth',
    description: 'Achieve positive growth for 4 consecutive quarters',
    category: 'consistency',
    rarity: 'common',
    icon: '📈',
    points: 200,
    unlocked: false,
    requirement: 'Grow revenue for 4 quarters in a row',
    reward: '+200 points'
  },
  {
    id: 'marathon_runner',
    name: 'Marathon Runner',
    description: 'Complete a 5-year simulation',
    category: 'consistency',
    rarity: 'rare',
    icon: '🏃',
    points: 500,
    unlocked: false,
    requirement: 'Complete a full 5-year simulation',
    reward: '+500 points'
  },
  {
    id: 'perfect_year',
    name: 'Perfect Year',
    description: 'Achieve all quarterly targets in one year',
    category: 'consistency',
    rarity: 'epic',
    icon: '⭐',
    points: 1500,
    unlocked: false,
    requirement: 'Meet all targets for 4 consecutive quarters',
    reward: '+1500 points'
  },

  // Mastery Achievements
  {
    id: 'cmo_veteran',
    name: 'CMO Veteran',
    description: 'Complete 10 simulations',
    category: 'mastery',
    rarity: 'rare',
    icon: '🎖️',
    points: 600,
    unlocked: false,
    requirement: 'Complete 10 different simulations',
    reward: '+600 points'
  },
  {
    id: 'industry_expert',
    name: 'Industry Expert',
    description: 'Master 5 different industries',
    category: 'mastery',
    rarity: 'epic',
    icon: '🎓',
    points: 1200,
    unlocked: false,
    requirement: 'Complete simulations in 5 industries',
    reward: '+1200 points'
  },
  {
    id: 'legendary_cmo',
    name: 'Legendary CMO',
    description: 'Achieve top 1% on global leaderboard',
    category: 'mastery',
    rarity: 'legendary',
    icon: '🏅',
    points: 5000,
    unlocked: false,
    requirement: 'Rank in top 1% globally',
    reward: '+5000 points + Legendary Badge'
  }
];

// ============================================================================
// SCORING SYSTEM
// ============================================================================

export interface ScoreBreakdown {
  revenue_score: number;
  roi_score: number;
  market_share_score: number;
  efficiency_score: number;
  consistency_score: number;
  achievement_bonus: number;
  total_score: number;
}

export class ScoringSystem {
  /**
   * Calculate comprehensive score
   */
  static calculateScore(metrics: {
    total_revenue: number;
    avg_roi: number;
    final_market_share: number;
    budget_efficiency: number; // 0-100
    quarters_with_growth: number;
    total_quarters: number;
    achievements_unlocked: number;
  }): ScoreBreakdown {
    // Revenue Score (0-3000 points)
    const revenue_score = Math.min(3000, (metrics.total_revenue / 1000000) * 100);

    // ROI Score (0-2000 points)
    const roi_score = Math.min(2000, metrics.avg_roi * 5);

    // Market Share Score (0-2000 points)
    const market_share_score = metrics.final_market_share * 40;

    // Efficiency Score (0-1000 points)
    const efficiency_score = metrics.budget_efficiency * 10;

    // Consistency Score (0-1000 points)
    const growth_rate = metrics.quarters_with_growth / metrics.total_quarters;
    const consistency_score = growth_rate * 1000;

    // Achievement Bonus (variable)
    const achievement_bonus = metrics.achievements_unlocked * 50;

    // Total Score
    const total_score = Math.round(
      revenue_score +
      roi_score +
      market_share_score +
      efficiency_score +
      consistency_score +
      achievement_bonus
    );

    return {
      revenue_score: Math.round(revenue_score),
      roi_score: Math.round(roi_score),
      market_share_score: Math.round(market_share_score),
      efficiency_score: Math.round(efficiency_score),
      consistency_score: Math.round(consistency_score),
      achievement_bonus,
      total_score
    };
  }

  /**
   * Get rank based on score
   */
  static getRank(score: number): string {
    if (score >= 8000) return 'Legendary CMO';
    if (score >= 6000) return 'Master Marketer';
    if (score >= 4000) return 'Expert Strategist';
    if (score >= 2500) return 'Senior CMO';
    if (score >= 1500) return 'Marketing Manager';
    if (score >= 800) return 'Marketing Specialist';
    if (score >= 400) return 'Junior Marketer';
    return 'Marketing Intern';
  }

  /**
   * Get rank color
   */
  static getRankColor(rank: string): string {
    const colors: Record<string, string> = {
      'Legendary CMO': 'text-yellow-500',
      'Master Marketer': 'text-purple-500',
      'Expert Strategist': 'text-blue-500',
      'Senior CMO': 'text-green-500',
      'Marketing Manager': 'text-teal-500',
      'Marketing Specialist': 'text-cyan-500',
      'Junior Marketer': 'text-gray-500',
      'Marketing Intern': 'text-gray-400'
    };
    return colors[rank] || 'text-gray-500';
  }
}

// ============================================================================
// ACHIEVEMENT TRACKER
// ============================================================================

export class AchievementTracker {
  private unlockedAchievements: Set<string> = new Set();
  private progress: Map<string, number> = new Map();

  /**
   * Check and unlock achievements based on metrics
   */
  checkAchievements(metrics: {
    total_revenue: number;
    quarter_revenue: number;
    quarter_roi: number;
    market_share: number;
    budget_spent: number;
    budget_total: number;
    all_channels_roi: number[];
    crisis_events_handled: number;
    ai_recommendations_followed: number;
    scenarios_created: number;
    consecutive_growth_quarters: number;
    total_quarters: number;
    simulations_completed: number;
    industries_mastered: number;
    global_rank_percentile: number;
  }): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    ACHIEVEMENTS.forEach(achievement => {
      if (this.unlockedAchievements.has(achievement.id)) return;

      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first_million':
          shouldUnlock = metrics.total_revenue >= 1000000;
          break;
        case 'ten_million':
          shouldUnlock = metrics.total_revenue >= 10000000;
          break;
        case 'hundred_million':
          shouldUnlock = metrics.total_revenue >= 100000000;
          break;
        case 'roi_master':
          shouldUnlock = metrics.quarter_roi >= 300;
          break;
        case 'perfect_allocation':
          const variance = Math.abs(metrics.budget_spent - metrics.budget_total) / metrics.budget_total;
          shouldUnlock = variance < 0.01;
          break;
        case 'channel_master':
          shouldUnlock = metrics.all_channels_roi.every(roi => roi >= 200);
          break;
        case 'market_leader':
          shouldUnlock = metrics.market_share >= 25;
          break;
        case 'market_dominator':
          shouldUnlock = metrics.market_share >= 50;
          break;
        case 'crisis_manager':
          shouldUnlock = metrics.crisis_events_handled >= 5;
          this.progress.set(achievement.id, (metrics.crisis_events_handled / 5) * 100);
          break;
        case 'early_adopter':
          // Check if digital channels get 50%+ budget
          shouldUnlock = true; // Simplified for now
          break;
        case 'ai_powered':
          shouldUnlock = metrics.ai_recommendations_followed >= 10;
          this.progress.set(achievement.id, (metrics.ai_recommendations_followed / 10) * 100);
          break;
        case 'data_driven':
          shouldUnlock = metrics.scenarios_created >= 20;
          this.progress.set(achievement.id, (metrics.scenarios_created / 20) * 100);
          break;
        case 'consistent_growth':
          shouldUnlock = metrics.consecutive_growth_quarters >= 4;
          this.progress.set(achievement.id, (metrics.consecutive_growth_quarters / 4) * 100);
          break;
        case 'marathon_runner':
          shouldUnlock = metrics.total_quarters >= 20; // 5 years
          this.progress.set(achievement.id, (metrics.total_quarters / 20) * 100);
          break;
        case 'perfect_year':
          shouldUnlock = metrics.consecutive_growth_quarters >= 4;
          break;
        case 'cmo_veteran':
          shouldUnlock = metrics.simulations_completed >= 10;
          this.progress.set(achievement.id, (metrics.simulations_completed / 10) * 100);
          break;
        case 'industry_expert':
          shouldUnlock = metrics.industries_mastered >= 5;
          this.progress.set(achievement.id, (metrics.industries_mastered / 5) * 100);
          break;
        case 'legendary_cmo':
          shouldUnlock = metrics.global_rank_percentile <= 1;
          break;
      }

      if (shouldUnlock) {
        this.unlockAchievement(achievement);
        newlyUnlocked.push({
          ...achievement,
          unlocked: true,
          unlocked_at: new Date().toISOString()
        });
      }
    });

    return newlyUnlocked;
  }

  /**
   * Unlock an achievement
   */
  private unlockAchievement(achievement: Achievement): void {
    this.unlockedAchievements.add(achievement.id);
  }

  /**
   * Get all unlocked achievements
   */
  getUnlockedAchievements(): Achievement[] {
    return ACHIEVEMENTS.filter(a => this.unlockedAchievements.has(a.id))
      .map(a => ({ ...a, unlocked: true }));
  }

  /**
   * Get achievement progress
   */
  getProgress(achievementId: string): number {
    return this.progress.get(achievementId) || 0;
  }

  /**
   * Get total points from achievements
   */
  getTotalPoints(): number {
    return this.getUnlockedAchievements().reduce((sum, a) => sum + a.points, 0);
  }
}

// ============================================================================
// LEADERBOARD SERVICE
// ============================================================================

export class LeaderboardService {
  private static instance: LeaderboardService;
  private entries: LeaderboardEntry[] = [];

  private constructor() {
    this.loadMockData();
  }

  static getInstance(): LeaderboardService {
    if (!LeaderboardService.instance) {
      LeaderboardService.instance = new LeaderboardService();
    }
    return LeaderboardService.instance;
  }

  /**
   * Load mock leaderboard data
   */
  private loadMockData(): void {
    // Generate mock entries
    const mockNames = [
      'Sarah Chen', 'Michael Johnson', 'Emma Davis', 'James Wilson',
      'Olivia Brown', 'William Taylor', 'Sophia Martinez', 'Alexander Lee'
    ];

    this.entries = mockNames.map((name, i) => ({
      rank: i + 1,
      user_id: crypto.randomUUID(),
      user_name: name,
      score: 8000 - (i * 500),
      simulation_id: crypto.randomUUID(),
      company_name: `${name.split(' ')[0]}'s Company`,
      industry: 'saas',
      achievements_count: 15 - i
    }));
  }

  /**
   * Get leaderboard
   */
  getLeaderboard(period: 'daily' | 'weekly' | 'monthly' | 'all-time' = 'all-time'): Leaderboard {
    return {
      period,
      entries: this.entries,
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Add entry to leaderboard
   */
  addEntry(entry: Omit<LeaderboardEntry, 'rank'>): void {
    this.entries.push({ ...entry, rank: this.entries.length + 1 });
    this.entries.sort((a, b) => b.score - a.score);
    this.entries.forEach((e, i) => e.rank = i + 1);
  }

  /**
   * Get user rank
   */
  getUserRank(userId: string): number | undefined {
    return this.entries.find(e => e.user_id === userId)?.rank;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const achievementTracker = new AchievementTracker();
export const leaderboardService = LeaderboardService.getInstance();
