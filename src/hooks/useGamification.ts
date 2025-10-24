/**
 * React Hooks for Gamification
 * Achievements, scoring, and leaderboards
 */

import { useState, useEffect, useCallback } from 'react';
import {
  ACHIEVEMENTS,
  achievementTracker,
  leaderboardService,
  ScoringSystem,
  ScoreBreakdown
} from '@/lib/gamification';
import { Achievement, Leaderboard } from '@/types';

/**
 * Hook to track achievements
 */
export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const checkAchievements = useCallback((metrics: {
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
  }) => {
    const newlyUnlocked = achievementTracker.checkAchievements(metrics);
    
    if (newlyUnlocked.length > 0) {
      const unlocked = achievementTracker.getUnlockedAchievements();
      setAchievements(prev => 
        prev.map(a => ({
          ...a,
          unlocked: unlocked.some(u => u.id === a.id),
          progress: achievementTracker.getProgress(a.id)
        }))
      );
      setUnlockedCount(unlocked.length);
      setTotalPoints(achievementTracker.getTotalPoints());
      
      return newlyUnlocked;
    }
    
    return [];
  }, []);

  const getProgress = useCallback((achievementId: string) => {
    return achievementTracker.getProgress(achievementId);
  }, []);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return {
    achievements,
    unlockedAchievements,
    lockedAchievements,
    unlockedCount,
    totalPoints,
    checkAchievements,
    getProgress
  };
}

/**
 * Hook to calculate and track score
 */
export function useScoring() {
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown | null>(null);
  const [rank, setRank] = useState<string>('Marketing Intern');

  const calculateScore = useCallback((metrics: {
    total_revenue: number;
    avg_roi: number;
    final_market_share: number;
    budget_efficiency: number;
    quarters_with_growth: number;
    total_quarters: number;
    achievements_unlocked: number;
  }) => {
    const breakdown = ScoringSystem.calculateScore(metrics);
    const userRank = ScoringSystem.getRank(breakdown.total_score);
    
    setScoreBreakdown(breakdown);
    setRank(userRank);
    
    return { breakdown, rank: userRank };
  }, []);

  const getRankColor = useCallback(() => {
    return ScoringSystem.getRankColor(rank);
  }, [rank]);

  return {
    scoreBreakdown,
    rank,
    calculateScore,
    getRankColor
  };
}

/**
 * Hook to access leaderboard
 */
export function useLeaderboard(period: 'daily' | 'weekly' | 'monthly' | 'all-time' = 'all-time') {
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const data = leaderboardService.getLeaderboard(period);
    setLeaderboard(data);
    setIsLoading(false);
  }, [period]);

  const getUserRank = useCallback((userId: string) => {
    return leaderboardService.getUserRank(userId);
  }, []);

  const topPlayers = leaderboard?.entries.slice(0, 10) || [];

  return {
    leaderboard,
    topPlayers,
    isLoading,
    getUserRank
  };
}

/**
 * Hook for achievement notifications
 */
export function useAchievementNotifications() {
  const [notifications, setNotifications] = useState<Achievement[]>([]);

  const showNotification = useCallback((achievement: Achievement) => {
    setNotifications(prev => [...prev, achievement]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(a => a.id !== achievement.id));
    }, 5000);
  }, []);

  const dismissNotification = useCallback((achievementId: string) => {
    setNotifications(prev => prev.filter(a => a.id !== achievementId));
  }, []);

  return {
    notifications,
    showNotification,
    dismissNotification
  };
}

/**
 * Hook to track progress towards achievements
 */
export function useAchievementProgress(achievementId: string) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const currentProgress = achievementTracker.getProgress(achievementId);
    setProgress(currentProgress);
  }, [achievementId]);

  return { progress };
}

/**
 * Hook for gamification stats summary
 */
export function useGamificationStats() {
  const { unlockedCount, totalPoints } = useAchievements();
  const { rank, scoreBreakdown } = useScoring();

  const stats = {
    achievements_unlocked: unlockedCount,
    total_achievements: ACHIEVEMENTS.length,
    achievement_percentage: (unlockedCount / ACHIEVEMENTS.length) * 100,
    total_points: totalPoints,
    current_rank: rank,
    total_score: scoreBreakdown?.total_score || 0
  };

  return stats;
}
