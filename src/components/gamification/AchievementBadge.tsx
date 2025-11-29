'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Achievement } from '@/lib/database/types';
import { RARITY_COLORS } from '@/lib/achievements/achievements';
import { Meteors } from '@/components/ui/meteors';
import { SparklesCore } from '@/components/ui/sparkles';

interface AchievementBadgeProps {
  achievement: Achievement;
  earned?: boolean;
  earnedAt?: string;
  showAnimation?: boolean;
  size?: 'sm' | 'md' | 'lg';
  progress?: number; // 0-100 percentage
  showProgress?: boolean;
}

export function AchievementBadge({
  achievement,
  earned = false,
  earnedAt,
  showAnimation = false,
  size = 'md',
  progress = 0,
  showProgress = false
}: AchievementBadgeProps) {
  const sizeClasses = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-20 h-20 text-3xl',
    lg: 'w-24 h-24 text-4xl'
  };

  const cardSizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const isEpicOrLegendary = earned && (achievement.rarity === 'epic' || achievement.rarity === 'legendary');

  return (
    <motion.div
      initial={showAnimation ? { scale: 0, rotate: -180 } : false}
      animate={showAnimation ? { scale: 1, rotate: 0 } : false}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: showAnimation ? 0.2 : 0
      }}
      whileHover={{ scale: 1.05 }}
      className="relative"
    >
      {/* Meteors for epic/legendary achievements */}
      {isEpicOrLegendary && showAnimation && (
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none -z-10">
          <Meteors number={achievement.rarity === 'legendary' ? 25 : 15} />
        </div>
      )}

      {/* Sparkles for rare+ achievements */}
      {earned && achievement.rarity !== 'common' && showAnimation && (
        <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none opacity-20 -z-10">
          <SparklesCore
            particleColor={achievement.rarity === 'legendary' ? '#fbbf24' : achievement.rarity === 'epic' ? '#a855f7' : '#3b82f6'}
            particleDensity={40}
            speed={2}
            className="h-full w-full"
          />
        </div>
      )}

      <Card className={`${earned ? 'border-2' : 'border border-dashed opacity-60'} ${earned ? RARITY_COLORS[achievement.rarity] : 'border-gray-300'} transition-all duration-300 relative z-0`}>
        <CardContent className={cardSizeClasses[size]}>
          <div className="text-center space-y-2">
            {/* Icon */}
            <div className={`${sizeClasses[size]} mx-auto flex items-center justify-center rounded-full ${earned ? 'bg-white shadow-sm' : 'bg-gray-100'} transition-all duration-300`}>
              <span className={earned ? '' : 'grayscale opacity-50'}>
                {achievement.icon}
              </span>
            </div>

            {/* Name */}
            <div className={`font-semibold ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'} leading-tight`}>
              {achievement.name}
            </div>

            {/* Rarity Badge */}
            <Badge
              variant="outline"
              className={`text-xs ${RARITY_COLORS[achievement.rarity]} capitalize`}
            >
              {achievement.rarity}
            </Badge>

            {/* Points */}
            <div className="text-xs text-muted-foreground">
              {achievement.points} pts
            </div>

            {/* Progress Bar */}
            {showProgress && !earned && progress > 0 && (
              <div className="space-y-1 w-full">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-primary">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            )}

            {/* Progress Percentage (compact) */}
            {showProgress && !earned && progress === 0 && (
              <div className="text-xs text-muted-foreground">
                Not started
              </div>
            )}

            {/* Earned Date */}
            {earned && earnedAt && (
              <div className="text-xs text-muted-foreground">
                Earned {new Date(earnedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Animation Effects */}
      {showAnimation && earned && (
        <>
          {/* Glow Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1] }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400/30 to-orange-400/30 blur-xl -z-10"
          />

          {/* Sparkle Effects */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 100],
                y: [0, (Math.random() - 0.5) * 100]
              }}
              transition={{
                duration: 1.5,
                delay: 0.8 + i * 0.1,
                ease: "easeOut"
              }}
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}

// Achievement Notification Component
interface AchievementNotificationProps {
  achievement: Achievement;
  isVisible: boolean;
  onClose: () => void;
}

export function AchievementNotification({ achievement, isVisible, onClose }: AchievementNotificationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100, scale: 0.8 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -100, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-4 right-4 z-50 max-w-sm"
    >
      <Card className={`border-2 ${RARITY_COLORS[achievement.rarity]} shadow-2xl`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{achievement.icon}</div>
            <div className="flex-1">
              <div className="font-bold text-sm mb-1">Achievement Unlocked!</div>
              <div className="font-semibold">{achievement.name}</div>
              <div className="text-xs text-muted-foreground">{achievement.description}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className={`text-xs ${RARITY_COLORS[achievement.rarity]} capitalize`}>
                  {achievement.rarity}
                </Badge>
                <span className="text-xs text-muted-foreground">+{achievement.points} pts</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ×
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
