'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Medal,
  Crown,
  TrendingUp,
  Filter,
  ChevronDown,
  Search,
  Users,
  Clock,
  Star,
  Building2
} from 'lucide-react';

// Types
export interface EnhancedLeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatarUrl?: string;
  companyName: string;
  industry: string;
  score: number;
  grade: string;
  roi: number;
  marketShare: number;
  level: number;
  achievementCount: number;
  streak: number;
  submittedAt: string;
  timeHorizon: string;
}

type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'all-time';
type SortField = 'score' | 'roi' | 'marketShare' | 'level';

interface LeaderboardFilters {
  timePeriod: TimePeriod;
  industry: string | null;
  timeHorizon: string | null;
  sortBy: SortField;
}

// Mock data generator
function generateMockLeaderboardData(count: number, filters: LeaderboardFilters): EnhancedLeaderboardEntry[] {
  const names = [
    'Sarah Chen', 'Michael Johnson', 'Emma Davis', 'James Wilson',
    'Olivia Brown', 'William Taylor', 'Sophia Martinez', 'Alexander Lee',
    'Isabella Garcia', 'Benjamin Anderson', 'Mia Thomas', 'Lucas White',
    'Charlotte Robinson', 'Henry Clark', 'Amelia Wright', 'Sebastian Hall'
  ];
  
  const companies = [
    'TechVentures Inc', 'Growth Labs', 'MarketMasters', 'Digital Dynamics',
    'Innovation Hub', 'Strategy Plus', 'NextGen Solutions', 'Peak Performance'
  ];
  
  const industries = ['healthcare', 'legal', 'ecommerce', 'saas', 'fintech'];
  const timeHorizons = ['1-year', '3-year', '5-year'];
  const grades = ['A+', 'A', 'B', 'C'];
  
  const entries: EnhancedLeaderboardEntry[] = [];
  
  for (let i = 0; i < count; i++) {
    const baseScore = 8500 - (i * 150) + Math.floor(Math.random() * 100);
    const industry = industries[i % industries.length];
    const timeHorizon = timeHorizons[i % timeHorizons.length];
    
    // Apply filters
    if (filters.industry && filters.industry !== industry) continue;
    if (filters.timeHorizon && filters.timeHorizon !== timeHorizon) continue;
    
    // Time period filtering - ensure some entries exist for each period
    // Distribute entries across time periods based on index
    let daysAgo: number;
    if (filters.timePeriod === 'daily') {
      daysAgo = i < 10 ? 0 : Math.floor(Math.random() * 365);
    } else if (filters.timePeriod === 'weekly') {
      daysAgo = i < 15 ? Math.floor(Math.random() * 7) : Math.floor(Math.random() * 365);
    } else if (filters.timePeriod === 'monthly') {
      daysAgo = i < 25 ? Math.floor(Math.random() * 30) : Math.floor(Math.random() * 365);
    } else {
      daysAgo = Math.floor(Math.random() * 365);
    }
    
    entries.push({
      rank: entries.length + 1,
      userId: `user-${i}`,
      username: names[i % names.length],
      avatarUrl: undefined,
      companyName: companies[i % companies.length],
      industry,
      score: Math.max(1000, baseScore),
      grade: grades[Math.min(Math.floor(i / 4), grades.length - 1)],
      roi: Math.max(50, 400 - i * 15 + Math.floor(Math.random() * 50)),
      marketShare: Math.max(5, 45 - i * 2 + Math.floor(Math.random() * 10)),
      level: Math.max(1, 30 - i + Math.floor(Math.random() * 5)),
      achievementCount: Math.max(1, 20 - i),
      streak: Math.floor(Math.random() * 30),
      submittedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      timeHorizon
    });
  }
  
  // Sort by selected field
  entries.sort((a, b) => {
    switch (filters.sortBy) {
      case 'roi': return b.roi - a.roi;
      case 'marketShare': return b.marketShare - a.marketShare;
      case 'level': return b.level - a.level;
      default: return b.score - a.score;
    }
  });
  
  // Update ranks after sorting
  entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });
  
  return entries;
}

interface EnhancedLeaderboardProps {
  currentUserId?: string;
  initialLimit?: number;
}

export function EnhancedLeaderboard({ 
  currentUserId, 
  initialLimit = 10 
}: EnhancedLeaderboardProps) {
  const [filters, setFilters] = useState<LeaderboardFilters>({
    timePeriod: 'all-time',
    industry: null,
    timeHorizon: null,
    sortBy: 'score'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(initialLimit);
  const [entries, setEntries] = useState<EnhancedLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data based on filters
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const data = generateMockLeaderboardData(50, filters);
      setEntries(data);
      setLoading(false);
    }, 300);
  }, [filters]);

  // Find current user's rank
  const currentUserEntry = useMemo(() => 
    entries.find(e => e.userId === currentUserId),
    [entries, currentUserId]
  );

  const displayedEntries = entries.slice(0, displayLimit);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 text-center font-bold text-muted-foreground">{rank}</span>;
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-green-100 text-green-800 border-green-300';
      case 'A': return 'bg-green-50 text-green-700 border-green-200';
      case 'B': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'C': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Leaderboard
            </CardTitle>
            <CardDescription>
              Compete with marketers worldwide
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Time Period Tabs */}
        <Tabs 
          value={filters.timePeriod} 
          onValueChange={(value) => setFilters(prev => ({ ...prev, timePeriod: value as TimePeriod }))}
          className="mt-3"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="daily" className="text-xs">Today</TabsTrigger>
            <TabsTrigger value="weekly" className="text-xs">Week</TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs">Month</TabsTrigger>
            <TabsTrigger value="all-time" className="text-xs">All Time</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-3 border-t mt-3">
                {/* Industry Filter */}
                <div>
                  <label className="text-sm font-medium mb-1 block">Industry</label>
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant={filters.industry === null ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setFilters(prev => ({ ...prev, industry: null }))}
                    >
                      All
                    </Badge>
                    {['healthcare', 'legal', 'ecommerce', 'saas', 'fintech'].map(ind => (
                      <Badge 
                        key={ind}
                        variant={filters.industry === ind ? 'default' : 'outline'}
                        className="cursor-pointer capitalize"
                        onClick={() => setFilters(prev => ({ ...prev, industry: ind }))}
                      >
                        {ind}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Time Horizon Filter */}
                <div>
                  <label className="text-sm font-medium mb-1 block">Time Horizon</label>
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant={filters.timeHorizon === null ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setFilters(prev => ({ ...prev, timeHorizon: null }))}
                    >
                      All
                    </Badge>
                    {['1-year', '3-year', '5-year'].map(horizon => (
                      <Badge 
                        key={horizon}
                        variant={filters.timeHorizon === horizon ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setFilters(prev => ({ ...prev, timeHorizon: horizon }))}
                      >
                        {horizon}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium mb-1 block">Sort By</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'score', label: 'Score' },
                      { value: 'roi', label: 'ROI' },
                      { value: 'marketShare', label: 'Market Share' },
                      { value: 'level', label: 'Level' }
                    ].map(option => (
                      <Badge 
                        key={option.value}
                        variant={filters.sortBy === option.value ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setFilters(prev => ({ ...prev, sortBy: option.value as SortField }))}
                      >
                        {option.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>
      
      <CardContent>
        {/* Current User's Rank (if not in top) */}
        {currentUserEntry && currentUserEntry.rank > displayLimit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-bold text-primary">#{currentUserEntry.rank}</span>
                <span className="font-medium">Your Ranking</span>
              </div>
              <Badge variant="outline">
                {currentUserEntry.score.toLocaleString()} pts
              </Badge>
            </div>
          </motion.div>
        )}

        {/* Leaderboard Table */}
        <div className="space-y-2">
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : displayedEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No entries found for this filter</p>
            </div>
          ) : (
            <AnimatePresence>
              {displayedEntries.map((entry, index) => {
                const isCurrentUser = entry.userId === currentUserId;
                
                return (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.03 }}
                    className={`p-3 rounded-lg border ${
                      isCurrentUser 
                        ? 'bg-primary/10 border-primary/30' 
                        : entry.rank <= 3 
                          ? 'bg-yellow-50/50 border-yellow-200' 
                          : 'bg-card hover:bg-accent/50'
                    } transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank */}
                      <div className="w-8 flex justify-center">
                        {getRankIcon(entry.rank)}
                      </div>
                      
                      {/* Avatar/Initial */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        entry.rank === 1 ? 'bg-yellow-200 text-yellow-800' :
                        entry.rank === 2 ? 'bg-gray-200 text-gray-800' :
                        entry.rank === 3 ? 'bg-amber-200 text-amber-800' :
                        'bg-primary/10 text-primary'
                      }`}>
                        {entry.username.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
                            {entry.username}
                            {isCurrentUser && <span className="text-xs text-primary ml-1">(You)</span>}
                          </span>
                          <Badge variant="outline" className={`text-xs ${getGradeColor(entry.grade)}`}>
                            {entry.grade}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Building2 className="w-3 h-3" />
                          <span className="truncate">{entry.companyName}</span>
                          <span>•</span>
                          <span className="capitalize">{entry.industry}</span>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-right hidden sm:block">
                          <div className="font-medium">{entry.roi}%</div>
                          <div className="text-xs text-muted-foreground">ROI</div>
                        </div>
                        <div className="text-right hidden md:block">
                          <div className="font-medium">{entry.marketShare}%</div>
                          <div className="text-xs text-muted-foreground">Share</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">
                            {entry.score.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">Score</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
        
        {/* Load More */}
        {displayedEntries.length < entries.length && (
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => setDisplayLimit(prev => prev + 10)}
          >
            Load More ({entries.length - displayedEntries.length} remaining)
          </Button>
        )}
        
        {/* Stats Footer */}
        <div className="mt-4 pt-4 border-t flex justify-between text-sm text-muted-foreground">
          <span>
            <Users className="w-4 h-4 inline mr-1" />
            {entries.length} competitors
          </span>
          <span>
            <Clock className="w-4 h-4 inline mr-1" />
            Updated just now
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
