// Gamification Components
export { AchievementBadge, AchievementNotification as AchievementBadgeNotification } from './AchievementBadge';
export { AchievementNotification } from './AchievementNotification';
export { DailyChallenges, checkChallengeProgress, type DailyChallenge } from './DailyChallenges';
export { StreakBadge, StreakCelebration, calculateStreak, checkMilestoneReached, type StreakData } from './StreakBadge';
export {
  LevelProgress,
  LevelUpCelebration,
  calculateLevelData,
  getLevelFromXP,
  getXPForLevel,
  getLevelTier,
  XP_REWARDS,
  type LevelData
} from './LevelProgress';
export { EnhancedLeaderboard, type EnhancedLeaderboardEntry } from './EnhancedLeaderboard';
export { AchievementDashboard, type AchievementDashboardProps } from './AchievementDashboard';
