'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Trophy, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  Zap,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';

// Daily Challenge Types
export interface DailyChallenge {
  id: string;
  type: 'complete_simulation' | 'achieve_roi' | 'market_share' | 'speed_run' | 'perfect_quarter';
  title: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'easy' | 'medium' | 'hard';
  reward: {
    xp: number;
    bonus_multiplier?: number;
  };
  requirement: {
    target: number;
    unit: string;
  };
  progress: number;
  completed: boolean;
  expiresAt: Date;
}

// Challenge definitions
const CHALLENGE_TEMPLATES: Omit<DailyChallenge, 'id' | 'progress' | 'completed' | 'expiresAt'>[] = [
  {
    type: 'complete_simulation',
    title: 'Simulation Master',
    description: 'Complete a full simulation from start to finish',
    icon: <Target className="w-5 h-5" />,
    difficulty: 'easy',
    reward: { xp: 50 },
    requirement: { target: 1, unit: 'simulation' }
  },
  {
    type: 'achieve_roi',
    title: 'ROI Champion',
    description: 'Achieve at least 200% ROI in your next simulation',
    icon: <DollarSign className="w-5 h-5" />,
    difficulty: 'medium',
    reward: { xp: 100, bonus_multiplier: 1.25 },
    requirement: { target: 200, unit: '% ROI' }
  },
  {
    type: 'market_share',
    title: 'Market Conqueror',
    description: 'Capture 25% or more market share',
    icon: <TrendingUp className="w-5 h-5" />,
    difficulty: 'medium',
    reward: { xp: 100 },
    requirement: { target: 25, unit: '% share' }
  },
  {
    type: 'speed_run',
    title: 'Speed Demon',
    description: 'Complete a simulation in under 20 minutes',
    icon: <Zap className="w-5 h-5" />,
    difficulty: 'hard',
    reward: { xp: 150, bonus_multiplier: 1.5 },
    requirement: { target: 20, unit: 'minutes' }
  },
  {
    type: 'perfect_quarter',
    title: 'Perfect Quarter',
    description: 'Achieve all KPI targets in a single quarter',
    icon: <Trophy className="w-5 h-5" />,
    difficulty: 'hard',
    reward: { xp: 200 },
    requirement: { target: 4, unit: 'targets' }
  }
];

// Generate daily challenges based on date
function generateDailyChallenges(date: Date): DailyChallenge[] {
  const seed = date.toDateString();
  // Simple seeded shuffle based on date
  const seedValue = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const shuffled = [...CHALLENGE_TEMPLATES].sort((a, b) => {
    const hashA = (a.type.charCodeAt(0) + seedValue) % 100;
    const hashB = (b.type.charCodeAt(0) + seedValue) % 100;
    return hashA - hashB;
  });
  
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  return shuffled.slice(0, 3).map((template, index) => ({
    ...template,
    id: `${seed}-${index}`,
    progress: 0,
    completed: false,
    expiresAt: tomorrow
  }));
}

// Get time remaining string
function getTimeRemaining(expiresAt: Date): string {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }
  return `${minutes}m remaining`;
}

interface DailyChallengesProps {
  onChallengeComplete?: (challenge: DailyChallenge) => void;
  completedChallengeIds?: string[];
  challengeProgress?: Record<string, number>;
}

export function DailyChallenges({ 
  onChallengeComplete,
  completedChallengeIds = [],
  challengeProgress = {}
}: DailyChallengesProps) {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  // Initialize challenges
  useEffect(() => {
    const today = new Date();
    const dailyChallenges = generateDailyChallenges(today);
    
    // Apply saved progress and completion status
    const updatedChallenges = dailyChallenges.map(challenge => ({
      ...challenge,
      progress: challengeProgress[challenge.id] || 0,
      completed: completedChallengeIds.includes(challenge.id)
    }));
    
    setChallenges(updatedChallenges);
  }, [completedChallengeIds, challengeProgress]);

  // Update timer
  useEffect(() => {
    if (challenges.length === 0) return;
    
    const updateTimer = () => {
      setTimeRemaining(getTimeRemaining(challenges[0].expiresAt));
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [challenges]);

  // Handle challenge completion
  const handleCompleteChallenge = useCallback((challenge: DailyChallenge) => {
    setChallenges(prev => prev.map(c => 
      c.id === challenge.id ? { ...c, completed: true, progress: c.requirement.target } : c
    ));
    onChallengeComplete?.(challenge);
  }, [onChallengeComplete]);

  // Refresh challenges (for demo purposes)
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      const today = new Date();
      setChallenges(generateDailyChallenges(today));
      setRefreshing(false);
    }, 500);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const completedCount = challenges.filter(c => c.completed).length;
  const totalXP = challenges
    .filter(c => c.completed)
    .reduce((sum, c) => sum + c.reward.xp, 0);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Daily Challenges
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4" />
              {timeRemaining}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10">
              {completedCount}/{challenges.length} Complete
            </Badge>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        {/* Overall Progress */}
        <div className="mt-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Daily Progress</span>
            <span className="font-medium">{totalXP} XP earned</span>
          </div>
          <Progress value={(completedCount / Math.max(challenges.length, 1)) * 100} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <AnimatePresence mode="popLayout">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <ChallengeCard 
                challenge={challenge}
                onComplete={() => handleCompleteChallenge(challenge)}
                getDifficultyColor={getDifficultyColor}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {challenges.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No challenges available today</p>
            <p className="text-sm">Check back tomorrow!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ChallengeCardProps {
  challenge: DailyChallenge;
  onComplete: () => void;
  getDifficultyColor: (difficulty: string) => string;
}

function ChallengeCard({ challenge, onComplete, getDifficultyColor }: ChallengeCardProps) {
  const progressPercent = Math.min((challenge.progress / challenge.requirement.target) * 100, 100);
  
  return (
    <motion.div
      whileHover={{ scale: challenge.completed ? 1 : 1.02 }}
      className={`p-4 rounded-lg border ${
        challenge.completed 
          ? 'bg-green-50 border-green-200' 
          : 'bg-card hover:bg-accent/50'
      } transition-colors`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`p-2 rounded-lg ${
          challenge.completed 
            ? 'bg-green-200 text-green-700' 
            : 'bg-primary/10 text-primary'
        }`}>
          {challenge.completed ? <CheckCircle2 className="w-5 h-5" /> : challenge.icon}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-medium ${challenge.completed ? 'line-through text-muted-foreground' : ''}`}>
              {challenge.title}
            </h4>
            <Badge variant="outline" className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">
            {challenge.description}
          </p>
          
          {/* Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>
                {challenge.progress} / {challenge.requirement.target} {challenge.requirement.unit}
              </span>
              <span className="font-medium text-primary">
                +{challenge.reward.xp} XP
                {challenge.reward.bonus_multiplier && (
                  <span className="ml-1 text-yellow-600">
                    ({challenge.reward.bonus_multiplier}x bonus)
                  </span>
                )}
              </span>
            </div>
            <Progress value={progressPercent} className="h-1.5" />
          </div>
        </div>
        
        {/* Status/Action */}
        <div className="flex-shrink-0">
          {challenge.completed ? (
            <Badge className="bg-green-500 text-white">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Done
            </Badge>
          ) : progressPercent >= 100 ? (
            <Button size="sm" onClick={onComplete}>
              Claim
            </Button>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

// Export utility function for checking challenge progress
export function checkChallengeProgress(
  challenge: DailyChallenge,
  simulationResult: {
    completed: boolean;
    roi: number;
    marketShare: number;
    completionTimeMinutes: number;
    quartersWithAllTargets: number;
  }
): number {
  switch (challenge.type) {
    case 'complete_simulation':
      return simulationResult.completed ? 1 : 0;
    case 'achieve_roi':
      return simulationResult.roi;
    case 'market_share':
      return simulationResult.marketShare;
    case 'speed_run':
      // Inverse: lower time = higher progress toward goal
      return simulationResult.completed && simulationResult.completionTimeMinutes <= challenge.requirement.target 
        ? challenge.requirement.target 
        : 0;
    case 'perfect_quarter':
      return simulationResult.quartersWithAllTargets;
    default:
      return 0;
  }
}
