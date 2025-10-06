'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AchievementBadge } from '@/components/gamification/AchievementBadge';
import { SocialShare, useSocialShare } from '@/components/social/SocialShare';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  Users, 
  Filter,
  Search,
  Calendar,
  Building,
  Target,
  DollarSign,
  Crown,
  Star,
  Zap,
  RefreshCw
} from 'lucide-react';
import { LeaderboardEntry, LeaderboardFilters, LeaderboardStats } from '@/lib/database/types';
import { LeaderboardService } from '@/lib/database/leaderboard';

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LeaderboardFilters>({
    sortBy: 'final_score',
    sortOrder: 'desc',
    limit: 50,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [availableSeasons, setAvailableSeasons] = useState<string[]>([]);

  useEffect(() => {
    loadLeaderboard();
    loadStats();
    loadSeasons();
  }, [filters]);

  const loadLeaderboard = async () => {
    setLoading(true);
    const data = await LeaderboardService.getLeaderboard(filters);
    setEntries(data);
    setLoading(false);
  };

  const loadStats = async () => {
    const statsData = await LeaderboardService.getLeaderboardStats(filters.season);
    setStats(statsData);
  };

  const loadSeasons = async () => {
    const seasons = await LeaderboardService.getAvailableSeasons();
    setAvailableSeasons(seasons);
  };

  const filteredEntries = entries.filter(entry =>
    entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      case 'F': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStrategyIcon = (strategy: string) => {
    switch (strategy.toLowerCase()) {
      case 'growth': return <TrendingUp className="h-4 w-4" />;
      case 'premium': return <Crown className="h-4 w-4" />;
      case 'value': return <DollarSign className="h-4 w-4" />;
      case 'innovation': return <Zap className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Global Leaderboard
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Compete with marketing strategists worldwide. See how your simulation performance ranks globally.
        </p>
      </motion.div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.total_entries.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Players</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.highest_score}</div>
                  <div className="text-sm text-muted-foreground">Highest Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.average_score}</div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Building className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-lg font-bold">{stats.most_common_industry}</div>
                  <div className="text-sm text-muted-foreground">Top Industry</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search players or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select
              value={filters.season || ''}
              onValueChange={(value) => setFilters({ ...filters, season: value || undefined })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Seasons" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Seasons</SelectItem>
                {availableSeasons.map(season => (
                  <SelectItem key={season} value={season}>{season}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.industry || ''}
              onValueChange={(value) => setFilters({ ...filters, industry: value || undefined })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Industries</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.strategy_type || ''}
              onValueChange={(value) => setFilters({ ...filters, strategy_type: value || undefined })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Strategies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Strategies</SelectItem>
                <SelectItem value="Growth">Growth</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Value">Value</SelectItem>
                <SelectItem value="Innovation">Innovation</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={loadLeaderboard}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Tabs defaultValue="leaderboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="leaderboard">Rankings</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`${index < 3 ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-12 h-12">
                            {getRankIcon(index + 1)}
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg">{entry.username}</h3>
                              <Badge className={getGradeColor(entry.grade)}>
                                {entry.grade}
                              </Badge>
                              {entry.big_bet_success && (
                                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                  <Zap className="h-3 w-3 mr-1" />
                                  Big Bet
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {entry.company_name} • {entry.industry}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              {getStrategyIcon(entry.strategy_type)}
                              <span>{entry.strategy_type} Strategy</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right space-y-2">
                          <div className="text-3xl font-bold text-primary">
                            {entry.final_score}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ${entry.total_revenue.toLocaleString()} revenue
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {entry.roi_percentage.toFixed(1)}% ROI
                          </div>
                        </div>
                      </div>

                      {/* Expandable details */}
                      <div className="mt-4 pt-4 border-t border-muted grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="font-medium">Market Share</div>
                          <div className="text-muted-foreground">{entry.final_market_share.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="font-medium">Satisfaction</div>
                          <div className="text-muted-foreground">{entry.final_satisfaction.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="font-medium">Brand Awareness</div>
                          <div className="text-muted-foreground">{entry.final_awareness.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="font-medium">Completion</div>
                          <div className="text-muted-foreground">
                            {entry.completion_time_minutes ? `${entry.completion_time_minutes}min` : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {filteredEntries.length === 0 && !loading && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters or search terms.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardContent className="p-12 text-center">
              <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Achievement System</h3>
              <p className="text-muted-foreground mb-4">
                Complete simulation challenges to earn badges and climb the achievement leaderboard.
              </p>
              <Button variant="outline">
                View All Achievements
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
