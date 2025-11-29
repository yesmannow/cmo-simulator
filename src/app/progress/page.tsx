'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DailyChallenges,
  StreakBadge,
  LevelProgress,
  EnhancedLeaderboard,
  AchievementBadge,
  type DailyChallenge,
  type StreakData
} from '@/components/gamification';
import { ACHIEVEMENT_DEFINITIONS } from '@/lib/achievements/achievements';
import {
  Trophy,
  Flame,
  Star,
  Award,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

// Mock user data
const MOCK_USER_ID = 'current-user';

export default function ProgressPage() {
  // State for gamification features
  const [totalXP, setTotalXP] = useState(2750);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 7,
    longestStreak: 14,
    lastActivityDate: new Date().toISOString(),
    streakMultiplier: 1.2,
    streakMilestones: [3, 7],
    nextMilestone: 14
  });

  // Mock earned achievements
  const earnedAchievementNames = ['First Timer', 'Profitable', 'Market Player', 'Above Average', 'Talent Scout'];

  // Handle challenge completion
  const handleChallengeComplete = (challenge: DailyChallenge) => {
    const xpGain = challenge.reward.xp * (challenge.reward.bonus_multiplier || 1);
    setTotalXP(prev => prev + xpGain);
    setCompletedChallenges(prev => [...prev, challenge.id]);
  };

  // Simulate adding XP (for demo)
  const addXP = (amount: number) => {
    setTotalXP(prev => prev + amount);
  };

  // Simulate incrementing streak (for demo)
  const incrementStreak = () => {
    setStreakData(prev => ({
      ...prev,
      currentStreak: prev.currentStreak + 1,
      longestStreak: Math.max(prev.longestStreak, prev.currentStreak + 1),
      lastActivityDate: new Date().toISOString()
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/sim">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Your Progress
                </h1>
                <p className="text-sm text-muted-foreground">
                  Track your achievements and compete with others
                </p>
              </div>
            </div>

            {/* Quick Stats in Header */}
            <div className="flex items-center gap-4">
              <StreakBadge streak={streakData} compact />
              <Badge variant="outline" className="font-bold">
                {totalXP.toLocaleString()} XP
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total XP</p>
                  <p className="text-2xl font-bold">{totalXP.toLocaleString()}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold">{streakData.currentStreak} days</p>
                </div>
                <Flame className="w-8 h-8 text-orange-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Achievements</p>
                  <p className="text-2xl font-bold">{earnedAchievementNames.length}</p>
                </div>
                <Award className="w-8 h-8 text-purple-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Simulations</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Demo Controls (for testing) */}
        <Card className="mb-8 border-dashed border-2 border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              🧪 Demo Controls
            </CardTitle>
            <CardDescription>Test the gamification features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => addXP(50)}>+50 XP</Button>
              <Button size="sm" onClick={() => addXP(100)}>+100 XP</Button>
              <Button size="sm" onClick={() => addXP(200)}>+200 XP</Button>
              <Button size="sm" variant="outline" onClick={incrementStreak}>+1 Streak</Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Level & Streak */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <LevelProgress totalXP={totalXP} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <StreakBadge streak={streakData} />
            </motion.div>
          </div>

          {/* Middle Column - Daily Challenges */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <DailyChallenges
                onChallengeComplete={handleChallengeComplete}
                completedChallengeIds={completedChallenges}
              />
            </motion.div>
          </div>

          {/* Right Column - Achievements */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-500" />
                    Achievements
                  </CardTitle>
                  <CardDescription>
                    {earnedAchievementNames.length} of {ACHIEVEMENT_DEFINITIONS.length} unlocked
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {ACHIEVEMENT_DEFINITIONS.slice(0, 8).map((achievementDef) => {
                      const isEarned = earnedAchievementNames.includes(achievementDef.name);
                      const achievement = {
                        id: achievementDef.name.toLowerCase().replace(/\s+/g, '-'),
                        name: achievementDef.name,
                        description: achievementDef.description,
                        icon: achievementDef.icon,
                        category: achievementDef.category,
                        rarity: achievementDef.rarity,
                        points: achievementDef.points,
                        criteria: achievementDef.criteria,
                        created_at: new Date().toISOString()
                      };

                      return (
                        <AchievementBadge
                          key={achievementDef.name}
                          achievement={achievement}
                          earned={isEarned}
                          size="sm"
                        />
                      );
                    })}
                  </div>

                  <Button variant="outline" className="w-full mt-4">
                    View All Achievements
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Leaderboard Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <EnhancedLeaderboard currentUserId={MOCK_USER_ID} initialLimit={10} />
        </motion.div>
      </main>
    </div>
  );
}
