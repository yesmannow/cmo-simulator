'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  Award,
  TrendingUp,
  Target,
  Star,
  Zap,
  Flame,
  BarChart3,
  Calendar,
  Medal
} from 'lucide-react';
import { AchievementBadge } from './AchievementBadge';
import { LevelProgress, calculateLevelData, type LevelData } from './LevelProgress';
import { StreakBadge, type StreakData } from './StreakBadge';
import { Achievement } from '@/types';
import { ACHIEVEMENT_DEFINITIONS } from '@/lib/achievements/achievements';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { GradientText } from '@/components/ui/gradient-text';
import { SparklesCore } from '@/components/ui/sparkles';
import CountUp from 'react-countup';

// Animated counter component
function AnimatedCounter({ value, duration = 1.5, decimals = 0 }: { value: number; duration?: number; decimals?: number }) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100
  });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [springValue]);

  return <span>{displayValue.toFixed(decimals).toLocaleString()}</span>;
}

// Stat card component
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  change?: number;
  suffix?: string;
  animate?: boolean;
}

function StatCard({ icon, label, value, change, suffix = '', animate = true }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="relative"
    >
      {/* Subtle sparkles on hover */}
      <div className="absolute inset-0 rounded-lg overflow-hidden opacity-0 hover:opacity-20 transition-opacity pointer-events-none">
        <SparklesCore
          particleColor="#3b82f6"
          particleDensity={30}
          speed={2}
          className="h-full w-full"
        />
      </div>

      <Card className="h-full relative z-10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold flex items-center gap-1">
                  {typeof value === 'number' && animate ? (
                    <CountUp
                      end={value}
                      duration={2}
                      separator=","
                      className="tabular-nums"
                    />
                  ) : (
                    value
                  )}
                  {suffix && <span className="text-sm font-normal text-muted-foreground">{suffix}</span>}
                </p>
              </div>
            </div>
            {change !== undefined && (
              <div className={`flex items-center gap-1 text-sm font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <TrendingUp className={`w-4 h-4 ${change < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(change)}%
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Achievement progress card
interface AchievementProgressCardProps {
  achievement: Achievement;
  progress: number;
  earned: boolean;
}

function AchievementProgressCard({ achievement, progress, earned }: AchievementProgressCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      <Card className={`h-full ${earned ? 'border-2 border-primary' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-3xl">{achievement.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-sm truncate">{achievement.name}</h4>
                {earned && (
                  <Badge variant="outline" className="text-xs">
                    <Trophy className="w-3 h-3 mr-1" />
                    Earned
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {achievement.description}
              </p>
              {!earned && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {achievement.rarity}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {achievement.points} pts
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Main dashboard props
export interface AchievementDashboardProps {
  userProgress?: {
    totalXP: number;
    currentLevel: number;
    totalPoints: number;
    unlockedAchievements: Achievement[];
    allAchievements: Achievement[];
    streakData: StreakData;
    recentActivity?: Array<{
      type: 'achievement' | 'level_up' | 'challenge';
      title: string;
      timestamp: string;
      icon?: string;
    }>;
    stats?: {
      simulationsCompleted: number;
      averageScore: number;
      totalRevenue: number;
      globalRank: number;
    };
  };
  compact?: boolean;
}

// Default mock data
const DEFAULT_PROGRESS: AchievementDashboardProps['userProgress'] = {
  totalXP: 2750,
  currentLevel: 5,
  totalPoints: 1250,
  unlockedAchievements: [],
  allAchievements: [],
  streakData: {
    currentStreak: 7,
    longestStreak: 14,
    lastActivityDate: new Date().toISOString(),
    streakMultiplier: 1.2,
    streakMilestones: [3, 7],
    nextMilestone: 14
  },
  stats: {
    simulationsCompleted: 12,
    averageScore: 87,
    totalRevenue: 2500000,
    globalRank: 1247
  }
};

export function AchievementDashboard({
  userProgress = DEFAULT_PROGRESS,
  compact = false
}: AchievementDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  const levelData = calculateLevelData(userProgress.totalXP);

  // Filter achievements
  const categories = ['all', ...new Set(userProgress.allAchievements.map(a => a.category))];
  const rarities = ['all', 'common', 'rare', 'epic', 'legendary'];

  const filteredAchievements = userProgress.allAchievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const rarityMatch = selectedRarity === 'all' || achievement.rarity === selectedRarity;
    return categoryMatch && rarityMatch;
  });

  const unlockedCount = userProgress.unlockedAchievements.length;
  const totalCount = userProgress.allAchievements.length;
  const completionRate = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  // Group achievements by category
  const achievementsByCategory = filteredAchievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={<Trophy className="w-5 h-5" />}
            label="Total Points"
            value={userProgress.totalPoints}
          />
          <StatCard
            icon={<Award className="w-5 h-5" />}
            label="Achievements"
            value={`${unlockedCount}/${totalCount}`}
          />
        </div>
        <LevelProgress totalXP={userProgress.totalXP} compact />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Background Beams */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <BackgroundBeams />
      </div>

      {/* Header with Gradient Text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <GradientText
          text="Achievement Dashboard"
          className="text-4xl font-bold mb-2"
          neon={false}
        />
        <p className="text-muted-foreground">
          Track your progress and unlock new achievements
        </p>
      </motion.div>

      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10"
      >
        <StatCard
          icon={<Trophy className="w-5 h-5" />}
          label="Total Points"
          value={userProgress.totalPoints}
          animate
        />
        <StatCard
          icon={<Award className="w-5 h-5" />}
          label="Achievements"
          value={`${unlockedCount}/${totalCount}`}
        />
        <StatCard
          icon={<Star className="w-5 h-5" />}
          label="Current Level"
          value={levelData.currentLevel}
          suffix={levelData.title}
        />
        <StatCard
          icon={<Zap className="w-5 h-5" />}
          label="Total XP"
          value={userProgress.totalXP}
          animate
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Level & Streak */}
        <div className="lg:col-span-1 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <LevelProgress totalXP={userProgress.totalXP} showAnimation />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StreakBadge streak={userProgress.streakData} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Completion Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Collection Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Achievements Unlocked</span>
                    <span className="font-medium">{Math.round(completionRate)}%</span>
                  </div>
                  <Progress value={completionRate} className="h-3" />
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {rarities.slice(1).map(rarity => {
                    const count = userProgress.allAchievements.filter(
                      a => a.rarity === rarity && userProgress.unlockedAchievements.some(u => u.id === a.id)
                    ).length;
                    const total = userProgress.allAchievements.filter(a => a.rarity === rarity).length;
                    return (
                      <div key={rarity} className="p-2 rounded-lg bg-muted/50">
                        <div className="text-lg font-bold">{count}/{total}</div>
                        <div className="text-xs text-muted-foreground capitalize">{rarity}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Achievements */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Medal className="w-5 h-5 text-yellow-500" />
                      Achievements
                    </CardTitle>
                    <CardDescription>
                      {unlockedCount} of {totalCount} achievements unlocked
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-sm border rounded-md px-2 py-1"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                      ))}
                    </select>
                    <select
                      value={selectedRarity}
                      onChange={(e) => setSelectedRarity(e.target.value)}
                      className="text-sm border rounded-md px-2 py-1"
                    >
                      {rarities.map(rarity => (
                        <option key={rarity} value={rarity}>
                          {rarity === 'all' ? 'All Rarities' : rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
                    <TabsTrigger value="locked">Locked</TabsTrigger>
                    <TabsTrigger value="progress">In Progress</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AnimatePresence mode="popLayout">
                        {filteredAchievements.map((achievement, index) => {
                          const earned = userProgress.unlockedAchievements.some(u => u.id === achievement.id);
                          const progress = achievement.progress || 0;
                          return (
                            <motion.div
                              key={achievement.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <AchievementProgressCard
                                achievement={achievement}
                                progress={progress}
                                earned={earned}
                              />
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </TabsContent>

                  <TabsContent value="unlocked" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userProgress.unlockedAchievements
                        .filter(a => filteredAchievements.some(f => f.id === a.id))
                        .map((achievement, index) => (
                          <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <AchievementProgressCard
                              achievement={achievement}
                              progress={100}
                              earned={true}
                            />
                          </motion.div>
                        ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="locked" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredAchievements
                        .filter(a => !userProgress.unlockedAchievements.some(u => u.id === a.id))
                        .map((achievement, index) => (
                          <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <AchievementProgressCard
                              achievement={achievement}
                              progress={achievement.progress || 0}
                              earned={false}
                            />
                          </motion.div>
                        ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="progress" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredAchievements
                        .filter(a => {
                          const earned = userProgress.unlockedAchievements.some(u => u.id === a.id);
                          const progress = a.progress || 0;
                          return !earned && progress > 0 && progress < 100;
                        })
                        .map((achievement, index) => (
                          <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <AchievementProgressCard
                              achievement={achievement}
                              progress={achievement.progress || 0}
                              earned={false}
                            />
                          </motion.div>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Additional Stats Section */}
      {userProgress.stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">{userProgress.stats.simulationsCompleted}</div>
                  <div className="text-sm text-muted-foreground">Simulations</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">{userProgress.stats.averageScore}%</div>
                  <div className="text-sm text-muted-foreground">Avg Score</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">
                    ${(userProgress.stats.totalRevenue / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-muted-foreground">Revenue</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">#{userProgress.stats.globalRank}</div>
                  <div className="text-sm text-muted-foreground">Global Rank</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

