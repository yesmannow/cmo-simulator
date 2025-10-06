'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Crown, Zap, X } from 'lucide-react';
import { Achievement } from '@/lib/database/types';
import { AchievementBadge } from './AchievementBadge';

interface AchievementNotificationProps {
  achievements: Achievement[];
  onDismiss: (achievementId: string) => void;
  onDismissAll: () => void;
}

export function AchievementNotification({
  achievements,
  onDismiss,
  onDismissAll
}: AchievementNotificationProps) {
  const [visibleAchievements, setVisibleAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (achievements.length > 0) {
      // Show achievements one by one with delay
      achievements.forEach((achievement, index) => {
        setTimeout(() => {
          setVisibleAchievements(prev => [...prev, achievement]);
        }, index * 800);
      });
    }
  }, [achievements]);

  const handleDismiss = (achievementId: string) => {
    setVisibleAchievements(prev => prev.filter(a => a.id !== achievementId));
    onDismiss(achievementId);
  };

  const handleDismissAll = () => {
    setVisibleAchievements([]);
    onDismissAll();
  };

  if (visibleAchievements.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop for multiple achievements */}
      <AnimatePresence>
        {visibleAchievements.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 pointer-events-auto"
            onClick={handleDismissAll}
          />
        )}
      </AnimatePresence>

      {/* Achievement notifications */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="space-y-4 max-w-md w-full">
          <AnimatePresence mode="popLayout">
            {visibleAchievements.map((achievement, index) => (
              <AchievementNotificationCard
                key={achievement.id}
                achievement={achievement}
                index={index}
                onDismiss={() => handleDismiss(achievement.id)}
                showDismissAll={visibleAchievements.length > 1 && index === 0}
                onDismissAll={handleDismissAll}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

interface AchievementNotificationCardProps {
  achievement: Achievement;
  index: number;
  onDismiss: () => void;
  showDismissAll: boolean;
  onDismissAll: () => void;
}

function AchievementNotificationCard({
  achievement,
  index,
  onDismiss,
  showDismissAll,
  onDismissAll
}: AchievementNotificationCardProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return Crown;
      case 'epic': return Trophy;
      case 'rare': return Star;
      default: return Zap;
    }
  };

  const getRarityColors = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return {
          bg: 'from-yellow-400 via-orange-500 to-red-500',
          border: 'border-yellow-400',
          glow: 'shadow-yellow-400/50'
        };
      case 'epic':
        return {
          bg: 'from-purple-400 via-pink-500 to-red-500',
          border: 'border-purple-400',
          glow: 'shadow-purple-400/50'
        };
      case 'rare':
        return {
          bg: 'from-blue-400 via-cyan-500 to-teal-500',
          border: 'border-blue-400',
          glow: 'shadow-blue-400/50'
        };
      default:
        return {
          bg: 'from-gray-400 via-gray-500 to-gray-600',
          border: 'border-gray-400',
          glow: 'shadow-gray-400/50'
        };
    }
  };

  const colors = getRarityColors(achievement.rarity);
  const Icon = getRarityIcon(achievement.rarity);

  return (
    <motion.div
      layout
      initial={{ 
        opacity: 0, 
        scale: 0.5, 
        y: 50,
        rotateX: -90
      }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        scale: isVisible ? 1 : 0.8, 
        y: isVisible ? 0 : 20,
        rotateX: 0
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.5, 
        y: -50,
        rotateX: 90
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        delay: index * 0.1
      }}
      className="pointer-events-auto"
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${colors.bg} opacity-20 blur-xl animate-pulse`} />
      
      {/* Main card */}
      <div className={`relative bg-card/95 backdrop-blur-sm border-2 ${colors.border} rounded-xl p-6 shadow-2xl ${colors.glow}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
              }}
              className={`p-2 rounded-full bg-gradient-to-r ${colors.bg}`}
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Achievement Unlocked!</h3>
              <p className="text-sm text-muted-foreground capitalize">{achievement.rarity} Achievement</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {showDismissAll && (
              <button
                onClick={onDismissAll}
                className="p-1 rounded-full hover:bg-muted/50 transition-colors text-xs"
                title="Dismiss All"
              >
                Dismiss All
              </button>
            )}
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onDismiss, 300);
              }}
              className="p-1 rounded-full hover:bg-muted/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Achievement details */}
        <div className="flex items-center gap-4">
          <AchievementBadge 
            achievement={achievement} 
            earned={true}
            size="lg"
            showAnimation={true}
          />
          
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-1">{achievement.name}</h4>
            <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {achievement.points} points
              </span>
              <span className="capitalize">{achievement.category}</span>
            </div>
          </div>
        </div>

        {/* Progress bar animation */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-b-xl"
        />
      </div>
    </motion.div>
  );
}
