/**
 * Enhanced Features for CMO Simulator
 * Value-increasing features based on research and best practices
 */

import { logger } from './logger';

/**
 * Daily Challenge System
 * Provides daily rotating challenges to increase engagement
 */
export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'revenue' | 'efficiency' | 'strategy' | 'innovation';
  target: number;
  reward: {
    points: number;
    bonus?: number; // Percentage bonus to simulation score
  };
  expiresAt: Date;
}

/**
 * Streak System
 * Tracks consecutive days of engagement
 */
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date | null;
  multiplier: number; // Score multiplier based on streak
}

/**
 * User Level System
 * XP-based progression with level unlocks
 */
export interface UserLevel {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  unlockedFeatures: string[];
}

/**
 * Calculate streak multiplier
 */
export function calculateStreakMultiplier(streak: number): number {
  // Base multiplier: 1.0
  // +0.05 per day, max 2.0 (20 days)
  return Math.min(1.0 + (streak * 0.05), 2.0);
}

/**
 * Calculate XP gained from simulation completion
 */
export function calculateSimulationXP(score: number, grade: string): number {
  const baseXP = {
    'A+': 500,
    'A': 400,
    'B': 300,
    'C': 200,
    'D': 100,
    'F': 50,
  }[grade] || 100;

  // Bonus XP for high scores
  const scoreBonus = Math.floor(score / 1000) * 10;

  return baseXP + scoreBonus;
}

/**
 * Calculate level from total XP
 */
export function calculateLevel(totalXP: number): UserLevel {
  // XP required per level (exponential growth)
  let level = 1;
  let xpForCurrentLevel = 0;
  let xpNeeded = 100; // Base XP for level 2

  while (xpForCurrentLevel + xpNeeded <= totalXP) {
    xpForCurrentLevel += xpNeeded;
    level++;
    xpNeeded = Math.floor(xpNeeded * 1.5); // 50% increase per level
  }

  const currentXP = totalXP - xpForCurrentLevel;
  const xpToNextLevel = xpNeeded - currentXP;

  // Unlock features based on level
  const unlockedFeatures: string[] = [];
  if (level >= 3) unlockedFeatures.push('advanced_analytics');
  if (level >= 5) unlockedFeatures.push('scenario_planning');
  if (level >= 7) unlockedFeatures.push('custom_industries');
  if (level >= 10) unlockedFeatures.push('multiplayer_mode');

  return {
    level,
    currentXP,
    xpToNextLevel,
    totalXP,
    unlockedFeatures,
  };
}

/**
 * Generate daily challenge
 */
export function generateDailyChallenge(date: Date = new Date()): DailyChallenge {
  const challenges: Omit<DailyChallenge, 'id' | 'expiresAt'>[] = [
    {
      title: 'Revenue Rush',
      description: 'Generate $100K in revenue in a single simulation',
      type: 'revenue',
      target: 100000,
      reward: { points: 200, bonus: 5 },
    },
    {
      title: 'Efficiency Expert',
      description: 'Achieve 200% ROI in a simulation',
      type: 'efficiency',
      target: 200,
      reward: { points: 150, bonus: 3 },
    },
    {
      title: 'Strategic Master',
      description: 'Complete a simulation with A+ grade',
      type: 'strategy',
      target: 8000, // Strategy score
      reward: { points: 300, bonus: 10 },
    },
    {
      title: 'Innovation Leader',
      description: 'Use all 3 strategic initiatives in one simulation',
      type: 'innovation',
      target: 3,
      reward: { points: 100, bonus: 2 },
    },
  ];

  // Select challenge based on day of week
  const dayIndex = date.getDay();
  const challenge = challenges[dayIndex % challenges.length];

  // Set expiration to end of day
  const expiresAt = new Date(date);
  expiresAt.setHours(23, 59, 59, 999);

  return {
    id: `daily-${date.toISOString().split('T')[0]}`,
    ...challenge,
    expiresAt,
  };
}

/**
 * Check if challenge is completed
 */
export function checkChallengeCompletion(
  challenge: DailyChallenge,
  simulationResults: {
    revenue?: number;
    roi?: number;
    strategyScore?: number;
    initiativesUsed?: number;
  }
): boolean {
  switch (challenge.type) {
    case 'revenue':
      return (simulationResults.revenue || 0) >= challenge.target;
    case 'efficiency':
      return (simulationResults.roi || 0) >= challenge.target;
    case 'strategy':
      return (simulationResults.strategyScore || 0) >= challenge.target;
    case 'innovation':
      return (simulationResults.initiativesUsed || 0) >= challenge.target;
    default:
      return false;
  }
}

/**
 * Update streak data
 */
export function updateStreak(
  currentStreak: number,
  lastActivityDate: Date | null
): StreakData {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDate = lastActivityDate
    ? new Date(lastActivityDate)
    : null;
  if (lastDate) {
    lastDate.setHours(0, 0, 0, 0);
  }

  let newStreak = currentStreak;
  let longestStreak = currentStreak;

  if (!lastDate) {
    // First activity
    newStreak = 1;
  } else {
    const daysDiff = Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 0) {
      // Already logged in today
      newStreak = currentStreak;
    } else if (daysDiff === 1) {
      // Consecutive day
      newStreak = currentStreak + 1;
    } else {
      // Streak broken
      newStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, newStreak);
  const multiplier = calculateStreakMultiplier(newStreak);

  return {
    currentStreak: newStreak,
    longestStreak,
    lastActivityDate: today,
    multiplier,
  };
}

