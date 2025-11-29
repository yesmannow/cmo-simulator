'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  Trophy, 
  Zap,
  TrendingUp,
  Crown,
  Sparkles
} from 'lucide-react';

// Level configuration
const LEVEL_CONFIG = {
  baseXP: 100, // XP needed for level 1 to 2
  xpMultiplier: 1.5, // Each level requires 1.5x more XP
  maxLevel: 50
};

// Level titles and icons
const LEVEL_TIERS = [
  { minLevel: 1, title: 'Marketing Intern', icon: '📋', color: 'text-gray-500' },
  { minLevel: 5, title: 'Marketing Coordinator', icon: '📊', color: 'text-green-500' },
  { minLevel: 10, title: 'Marketing Specialist', icon: '📈', color: 'text-blue-500' },
  { minLevel: 15, title: 'Marketing Manager', icon: '💼', color: 'text-cyan-500' },
  { minLevel: 20, title: 'Senior Marketing Manager', icon: '🎯', color: 'text-teal-500' },
  { minLevel: 25, title: 'Marketing Director', icon: '⭐', color: 'text-yellow-500' },
  { minLevel: 30, title: 'VP of Marketing', icon: '🏆', color: 'text-orange-500' },
  { minLevel: 35, title: 'CMO', icon: '👑', color: 'text-red-500' },
  { minLevel: 40, title: 'Marketing Legend', icon: '💎', color: 'text-purple-500' },
  { minLevel: 45, title: 'Marketing God', icon: '🌟', color: 'text-amber-500' },
  { minLevel: 50, title: 'Ultimate CMO', icon: '✨', color: 'text-gradient' },
];

// XP rewards for different actions
export const XP_REWARDS = {
  COMPLETE_SIMULATION: 100,
  ACHIEVE_A_PLUS: 200,
  ACHIEVE_A: 150,
  ACHIEVE_B: 100,
  ACHIEVE_C: 50,
  DAILY_CHALLENGE_EASY: 50,
  DAILY_CHALLENGE_MEDIUM: 100,
  DAILY_CHALLENGE_HARD: 150,
  ACHIEVEMENT_COMMON: 25,
  ACHIEVEMENT_RARE: 50,
  ACHIEVEMENT_EPIC: 100,
  ACHIEVEMENT_LEGENDARY: 200,
  STREAK_BONUS: 10, // Per day of streak
};

export interface LevelData {
  currentLevel: number;
  currentXP: number;
  totalXP: number;
  xpToNextLevel: number;
  xpProgress: number; // 0-100 percentage
  title: string;
  icon: string;
  color: string;
}

// Calculate XP needed for a specific level
export function getXPForLevel(level: number): number {
  if (level <= 1) return 0;
  let totalXP = 0;
  for (let i = 1; i < level; i++) {
    totalXP += Math.floor(LEVEL_CONFIG.baseXP * Math.pow(LEVEL_CONFIG.xpMultiplier, i - 1));
  }
  return totalXP;
}

// Calculate level from total XP
export function getLevelFromXP(totalXP: number): number {
  let level = 1;
  let xpNeeded = 0;
  
  while (level < LEVEL_CONFIG.maxLevel) {
    const xpForNextLevel = Math.floor(LEVEL_CONFIG.baseXP * Math.pow(LEVEL_CONFIG.xpMultiplier, level - 1));
    if (xpNeeded + xpForNextLevel > totalXP) break;
    xpNeeded += xpForNextLevel;
    level++;
  }
  
  return level;
}

// Get title and icon for a level
export function getLevelTier(level: number): { title: string; icon: string; color: string } {
  const tier = [...LEVEL_TIERS].reverse().find(t => level >= t.minLevel);
  return tier || LEVEL_TIERS[0];
}

// Calculate complete level data from total XP
export function calculateLevelData(totalXP: number): LevelData {
  const level = getLevelFromXP(totalXP);
  const xpForCurrentLevel = getXPForLevel(level);
  const xpForNextLevel = getXPForLevel(level + 1);
  const xpInCurrentLevel = totalXP - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const tier = getLevelTier(level);
  
  return {
    currentLevel: level,
    currentXP: xpInCurrentLevel,
    totalXP,
    xpToNextLevel: xpNeededForNextLevel,
    xpProgress: (xpInCurrentLevel / xpNeededForNextLevel) * 100,
    title: tier.title,
    icon: tier.icon,
    color: tier.color,
  };
}

interface LevelProgressProps {
  totalXP: number;
  compact?: boolean;
  showAnimation?: boolean;
}

export function LevelProgress({ totalXP, compact = false, showAnimation = true }: LevelProgressProps) {
  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [animatedXP, setAnimatedXP] = useState(totalXP);
  const [isLevelingUp, setIsLevelingUp] = useState(false);

  useEffect(() => {
    const data = calculateLevelData(totalXP);
    
    // Check for level up
    if (levelData && data.currentLevel > levelData.currentLevel) {
      setIsLevelingUp(true);
      setTimeout(() => setIsLevelingUp(false), 2000);
    }
    
    setLevelData(data);
    
    // Animate XP change
    if (showAnimation && animatedXP !== totalXP) {
      const diff = totalXP - animatedXP;
      const duration = Math.min(Math.abs(diff) * 5, 1000);
      const startTime = Date.now();
      const startXP = animatedXP;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out
        setAnimatedXP(Math.round(startXP + diff * eased));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [totalXP, animatedXP, showAnimation, levelData]);

  if (!levelData) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <motion.div
          animate={isLevelingUp ? { scale: [1, 1.3, 1], rotate: [0, 360] } : {}}
          className={`text-lg ${levelData.color}`}
        >
          {levelData.icon}
        </motion.div>
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="font-bold">
            Lv.{levelData.currentLevel}
          </Badge>
          <div className="w-20">
            <Progress value={levelData.xpProgress} className="h-1.5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Level Progress
        </CardTitle>
        <CardDescription>
          Earn XP by completing simulations and challenges
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Level Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={isLevelingUp ? { 
                scale: [1, 1.5, 1], 
                rotate: [0, 360],
                transition: { duration: 1 }
              } : {}}
              className={`text-4xl p-2 rounded-lg bg-primary/10`}
            >
              {levelData.icon}
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">Level {levelData.currentLevel}</span>
                {isLevelingUp && (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-green-500 font-bold"
                  >
                    LEVEL UP! 🎉
                  </motion.span>
                )}
              </div>
              <p className={`text-sm ${levelData.color} font-medium`}>
                {levelData.title}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-primary">
              {animatedXP.toLocaleString()} XP
            </div>
            <p className="text-xs text-muted-foreground">Total Earned</p>
          </div>
        </div>
        
        {/* XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Progress to Level {levelData.currentLevel + 1}
            </span>
            <span className="font-medium">
              {levelData.currentXP.toLocaleString()} / {levelData.xpToNextLevel.toLocaleString()} XP
            </span>
          </div>
          <div className="relative">
            <Progress value={levelData.xpProgress} className="h-3" />
            {isLevelingUp && (
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                className="absolute inset-0 bg-yellow-400/50 rounded-full"
                style={{ height: '100%' }}
              />
            )}
          </div>
        </div>
        
        {/* Level Tiers Preview */}
        <div className="pt-2 border-t">
          <p className="text-sm font-medium mb-2">Career Path</p>
          <div className="flex justify-between items-center">
            {LEVEL_TIERS.slice(0, 5).map((tier, index) => {
              const achieved = levelData.currentLevel >= tier.minLevel;
              const isCurrent = LEVEL_TIERS[index + 1] 
                ? levelData.currentLevel >= tier.minLevel && levelData.currentLevel < LEVEL_TIERS[index + 1].minLevel
                : levelData.currentLevel >= tier.minLevel;
              
              return (
                <motion.div
                  key={tier.minLevel}
                  whileHover={{ scale: 1.1 }}
                  className={`flex flex-col items-center ${
                    achieved ? '' : 'opacity-40 grayscale'
                  } ${isCurrent ? 'ring-2 ring-primary ring-offset-2 rounded-lg p-1' : ''}`}
                  title={`${tier.title} - Level ${tier.minLevel}+`}
                >
                  <span className="text-2xl">{tier.icon}</span>
                  <span className="text-xs text-muted-foreground">Lv.{tier.minLevel}</span>
                </motion.div>
              );
            })}
            <span className="text-muted-foreground">...</span>
          </div>
        </div>
        
        {/* XP Earnings Info */}
        <div className="pt-2 border-t">
          <p className="text-sm font-medium mb-2 flex items-center gap-1">
            <Zap className="w-4 h-4 text-yellow-500" />
            Ways to Earn XP
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Complete Simulation</span>
              <span className="font-medium">+100 XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">A+ Grade</span>
              <span className="font-medium">+200 XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Daily Challenge</span>
              <span className="font-medium">+50-150 XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Unlock Achievement</span>
              <span className="font-medium">+25-200 XP</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Level up celebration modal
interface LevelUpCelebrationProps {
  newLevel: number;
  isVisible: boolean;
  onClose: () => void;
}

export function LevelUpCelebration({ newLevel, isVisible, onClose }: LevelUpCelebrationProps) {
  const tier = getLevelTier(newLevel);
  const nextTier = LEVEL_TIERS.find(t => t.minLevel > newLevel);
  
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
            className="bg-card rounded-xl p-8 shadow-2xl max-w-sm text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sparkles Background */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 opacity-10"
            >
              <Sparkles className="w-full h-full" />
            </motion.div>
            
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 0.5, repeat: 3 }}
              className="text-6xl mb-4 relative z-10"
            >
              {tier.icon}
            </motion.div>
            
            <h2 className="text-2xl font-bold mb-2 relative z-10">Level Up!</h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-4xl font-bold mb-2 ${tier.color} relative z-10`}
            >
              Level {newLevel}
            </motion.p>
            <p className={`text-lg font-medium mb-4 ${tier.color} relative z-10`}>
              {tier.title}
            </p>
            
            {nextTier && (
              <p className="text-sm text-muted-foreground mb-4 relative z-10">
                Next: {nextTier.title} at Level {nextTier.minLevel}
              </p>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium relative z-10"
            >
              Continue 🚀
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
