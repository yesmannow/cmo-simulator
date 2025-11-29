'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Flame, 
  Calendar, 
  Trophy,
  Zap,
  Star,
  Gift
} from 'lucide-react';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  streakMultiplier: number;
  streakMilestones: number[];
  nextMilestone: number;
}

interface StreakBadgeProps {
  streak: StreakData;
  compact?: boolean;
}

// Streak milestone rewards
const STREAK_MILESTONES = [
  { days: 3, reward: 50, badge: '🔥', title: '3-Day Streak' },
  { days: 7, reward: 100, badge: '⚡', title: 'Week Warrior' },
  { days: 14, reward: 200, badge: '💫', title: 'Two Week Champion' },
  { days: 30, reward: 500, badge: '🏆', title: 'Monthly Master' },
  { days: 60, reward: 1000, badge: '👑', title: 'Dedication King' },
  { days: 100, reward: 2000, badge: '💎', title: 'Century Legend' },
];

function getStreakColor(streak: number): string {
  if (streak >= 100) return 'text-purple-500';
  if (streak >= 60) return 'text-yellow-500';
  if (streak >= 30) return 'text-orange-500';
  if (streak >= 14) return 'text-red-500';
  if (streak >= 7) return 'text-blue-500';
  if (streak >= 3) return 'text-green-500';
  return 'text-gray-500';
}

function getStreakMultiplier(streak: number): number {
  if (streak >= 100) return 2.0;
  if (streak >= 60) return 1.75;
  if (streak >= 30) return 1.5;
  if (streak >= 14) return 1.3;
  if (streak >= 7) return 1.2;
  if (streak >= 3) return 1.1;
  return 1.0;
}

function getNextMilestone(streak: number): { days: number; reward: number; badge: string; title: string } | null {
  const next = STREAK_MILESTONES.find(m => m.days > streak);
  return next || null;
}

export function StreakBadge({ streak, compact = false }: StreakBadgeProps) {
  const [showAnimation, setShowAnimation] = useState(false);
  const streakColor = getStreakColor(streak.currentStreak);
  const nextMilestone = getNextMilestone(streak.currentStreak);
  const multiplier = getStreakMultiplier(streak.currentStreak);
  
  useEffect(() => {
    // Show animation when streak increases
    if (streak.currentStreak > 0) {
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [streak.currentStreak]);

  if (compact) {
    return (
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: showAnimation ? [1, 1.2, 1] : 1 }}
        className="flex items-center gap-1.5"
      >
        <Flame className={`w-4 h-4 ${streakColor}`} />
        <span className={`font-bold ${streakColor}`}>{streak.currentStreak}</span>
        {multiplier > 1 && (
          <Badge variant="outline" className="text-xs px-1 py-0">
            {multiplier}x
          </Badge>
        )}
      </motion.div>
    );
  }

  const progressToNextMilestone = nextMilestone 
    ? (streak.currentStreak / nextMilestone.days) * 100 
    : 100;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <motion.div
            animate={showAnimation ? { rotate: [0, -10, 10, -10, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Flame className={`w-6 h-6 ${streakColor}`} />
          </motion.div>
          Daily Streak
        </CardTitle>
        <CardDescription>
          Keep playing daily to maintain your streak and earn bonus XP!
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main Streak Display */}
        <div className="flex items-center justify-between">
          <div className="text-center">
            <motion.div
              key={streak.currentStreak}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-5xl font-bold ${streakColor}`}
            >
              {streak.currentStreak}
            </motion.div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>
          
          <div className="text-center px-4 border-l border-r">
            <div className="text-2xl font-bold text-muted-foreground">
              {streak.longestStreak}
            </div>
            <p className="text-xs text-muted-foreground">Best Streak</p>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${multiplier > 1 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
              {multiplier}x
            </div>
            <p className="text-xs text-muted-foreground">XP Bonus</p>
          </div>
        </div>
        
        {/* Progress to Next Milestone */}
        {nextMilestone && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Next milestone</span>
              <span className="font-medium">
                {nextMilestone.badge} {nextMilestone.title} ({nextMilestone.days} days)
              </span>
            </div>
            <Progress value={progressToNextMilestone} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">
              +{nextMilestone.reward} XP reward
            </p>
          </div>
        )}
        
        {/* Milestone Badges */}
        <div className="pt-2">
          <p className="text-sm font-medium mb-2">Streak Milestones</p>
          <div className="flex gap-2 flex-wrap">
            {STREAK_MILESTONES.map((milestone) => {
              const achieved = streak.currentStreak >= milestone.days || 
                             streak.streakMilestones.includes(milestone.days);
              return (
                <motion.div
                  key={milestone.days}
                  whileHover={{ scale: 1.1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                    ${achieved 
                      ? 'bg-primary/20 border-2 border-primary' 
                      : 'bg-muted border border-border opacity-50'
                    }`}
                  title={`${milestone.title} - ${milestone.days} days (+${milestone.reward} XP)`}
                >
                  {milestone.badge}
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Last Activity */}
        {streak.lastActivityDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
            <Calendar className="w-4 h-4" />
            <span>
              Last active: {new Date(streak.lastActivityDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Streak celebration animation component
interface StreakCelebrationProps {
  days: number;
  isVisible: boolean;
  onClose: () => void;
}

export function StreakCelebration({ days, isVisible, onClose }: StreakCelebrationProps) {
  const milestone = STREAK_MILESTONES.find(m => m.days === days);
  
  if (!milestone) return null;
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50 }}
            className="bg-card rounded-xl p-8 shadow-2xl max-w-sm text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 1, repeat: 2 }}
              className="text-6xl mb-4"
            >
              {milestone.badge}
            </motion.div>
            
            <h2 className="text-2xl font-bold mb-2">Streak Milestone!</h2>
            <p className="text-lg text-primary font-medium mb-1">{milestone.title}</p>
            <p className="text-muted-foreground mb-4">
              You&apos;ve maintained a {days}-day streak!
            </p>
            
            <div className="bg-primary/10 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                <span className="font-bold text-lg">+{milestone.reward} XP</span>
              </div>
            </div>
            
            <Button onClick={onClose} className="w-full">
              Awesome! 🎉
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Utility functions for streak management
export function calculateStreak(
  lastActivityDate: string | null, 
  currentStreak: number
): { newStreak: number; streakBroken: boolean; isNewDay: boolean } {
  if (!lastActivityDate) {
    return { newStreak: 1, streakBroken: false, isNewDay: true };
  }
  
  const last = new Date(lastActivityDate);
  const now = new Date();
  
  // Reset time to compare dates only
  last.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Same day, no change
    return { newStreak: currentStreak, streakBroken: false, isNewDay: false };
  } else if (diffDays === 1) {
    // Consecutive day, increment streak
    return { newStreak: currentStreak + 1, streakBroken: false, isNewDay: true };
  } else {
    // Streak broken, start over
    return { newStreak: 1, streakBroken: true, isNewDay: true };
  }
}

export function checkMilestoneReached(
  previousStreak: number,
  newStreak: number,
  achievedMilestones: number[]
): number | null {
  for (const milestone of STREAK_MILESTONES) {
    if (
      newStreak >= milestone.days && 
      previousStreak < milestone.days &&
      !achievedMilestones.includes(milestone.days)
    ) {
      return milestone.days;
    }
  }
  return null;
}
