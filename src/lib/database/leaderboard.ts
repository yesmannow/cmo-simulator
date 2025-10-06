import { supabase } from '@/lib/supabase/client';
import { SimulationContext } from '@/lib/simMachine';
import { LeaderboardEntry, LeaderboardFilters, LeaderboardStats, Achievement, UserAchievement } from './types';

export class LeaderboardService {
  // Submit a simulation result to the leaderboard
  static async submitScore(context: SimulationContext, userId: string, username: string): Promise<LeaderboardEntry | null> {
    try {
      // Calculate final metrics
      const finalResults = context.finalResults;
      if (!finalResults) throw new Error('No final results available');

      const quarterlyData = [
        context.quarters.Q1,
        context.quarters.Q2,
        context.quarters.Q3,
        context.quarters.Q4,
      ];

      const totalRevenue = quarterlyData.reduce((sum, q) => sum + q.results.revenue, 0);
      const totalBudgetSpent = quarterlyData.reduce((sum, q) => sum + q.budgetSpent, 0);
      const roi = totalBudgetSpent > 0 ? ((totalRevenue - totalBudgetSpent) / totalBudgetSpent) * 100 : 0;

      // Generate simulation hash for validation
      const simulationData = {
        strategy: context.strategy,
        quarters: context.quarters,
        finalResults: context.finalResults,
      };
      const simulationHash = await this.generateSimulationHash(simulationData);

      const leaderboardEntry: Partial<LeaderboardEntry> = {
        user_id: userId,
        username,
        company_name: context.strategy.companyName || 'Anonymous Company',
        industry: context.strategy.industry || 'Technology',
        strategy_type: context.strategy.strategyType || 'Growth',
        target_audience: context.strategy.targetAudience,
        brand_positioning: context.strategy.brandPositioning,
        primary_channels: context.strategy.primaryChannels,
        
        final_score: finalResults.score,
        grade: finalResults.grade,
        total_revenue: totalRevenue,
        final_market_share: finalResults.finalKPIs.marketShare,
        final_satisfaction: finalResults.finalKPIs.customerSatisfaction,
        final_awareness: finalResults.finalKPIs.brandAwareness,
        roi_percentage: roi,
        
        total_budget: context.totalBudget,
        budget_utilized: totalBudgetSpent,
        quarters_completed: 4,
        wildcards_handled: context.wildcards.length,
        talent_hired: context.hiredTalent.length,
        big_bet_made: !!context.selectedBigBet,
        big_bet_success: context.bigBetOutcome?.success || false,
        
        completion_time_minutes: context.completionTimeMinutes || null,
        season: this.getCurrentSeason(),
        simulation_hash: simulationHash,
        is_verified: true,
      };

      const { data, error } = await supabase
        .from('leaderboard_entries')
        .upsert(leaderboardEntry, { 
          onConflict: 'user_id,season',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) throw error;

      // Check for achievements
      await this.checkAndAwardAchievements(userId, data.id, context);

      return data;
    } catch (error) {
      console.error('Error submitting score:', error);
      return null;
    }
  }

  // Get leaderboard entries with filtering and sorting
  static async getLeaderboard(filters: LeaderboardFilters = {}): Promise<LeaderboardEntry[]> {
    try {
      let query = supabase
        .from('leaderboard_entries')
        .select('*');

      // Apply filters
      if (filters.season) {
        query = query.eq('season', filters.season);
      }
      if (filters.industry) {
        query = query.eq('industry', filters.industry);
      }
      if (filters.strategy_type) {
        query = query.eq('strategy_type', filters.strategy_type);
      }
      if (filters.grade) {
        query = query.eq('grade', filters.grade);
      }

      // Apply sorting
      const sortBy = filters.sortBy || 'final_score';
      const sortOrder = filters.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }

  // Get leaderboard statistics
  static async getLeaderboardStats(season?: string): Promise<LeaderboardStats | null> {
    try {
      let query = supabase.from('leaderboard_entries').select('*');
      
      if (season) {
        query = query.eq('season', season);
      }

      const { data, error } = await query;
      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          total_entries: 0,
          average_score: 0,
          highest_score: 0,
          most_common_industry: 'Technology',
          most_successful_strategy: 'Growth',
          current_season: this.getCurrentSeason(),
        };
      }

      const totalEntries = data.length;
      const averageScore = data.reduce((sum, entry) => sum + entry.final_score, 0) / totalEntries;
      const highestScore = Math.max(...data.map(entry => entry.final_score));

      // Find most common industry
      const industryCount = data.reduce((acc, entry) => {
        acc[entry.industry] = (acc[entry.industry] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const mostCommonIndustry = Object.entries(industryCount)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Technology';

      // Find most successful strategy (highest average score)
      const strategyScores = data.reduce((acc, entry) => {
        if (!acc[entry.strategy_type]) {
          acc[entry.strategy_type] = { total: 0, count: 0 };
        }
        acc[entry.strategy_type].total += entry.final_score;
        acc[entry.strategy_type].count += 1;
        return acc;
      }, {} as Record<string, { total: number; count: number }>);

      const mostSuccessfulStrategy = Object.entries(strategyScores)
        .map(([strategy, { total, count }]) => ({ strategy, average: total / count }))
        .sort((a, b) => b.average - a.average)[0]?.strategy || 'Growth';

      return {
        total_entries: totalEntries,
        average_score: Math.round(averageScore),
        highest_score: highestScore,
        most_common_industry: mostCommonIndustry,
        most_successful_strategy: mostSuccessfulStrategy,
        current_season: this.getCurrentSeason(),
      };
    } catch (error) {
      console.error('Error fetching leaderboard stats:', error);
      return null;
    }
  }

  // Get user's rank and achievements
  static async getUserRank(userId: string, season?: string): Promise<{ rank: number; percentile: number } | null> {
    try {
      let query = supabase
        .from('leaderboard_entries')
        .select('final_score, user_id')
        .order('final_score', { ascending: false });

      if (season) {
        query = query.eq('season', season);
      }

      const { data, error } = await query;
      if (error) throw error;

      if (!data) return null;

      const userIndex = data.findIndex(entry => entry.user_id === userId);
      if (userIndex === -1) return null;

      const rank = userIndex + 1;
      const percentile = Math.round(((data.length - userIndex) / data.length) * 100);

      return { rank, percentile };
    } catch (error) {
      console.error('Error fetching user rank:', error);
      return null;
    }
  }

  // Get available seasons
  static async getAvailableSeasons(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('leaderboard_entries')
        .select('season')
        .order('season', { ascending: false });

      if (error) throw error;

      const uniqueSeasons = [...new Set(data?.map(entry => entry.season) || [])];
      return uniqueSeasons;
    } catch (error) {
      console.error('Error fetching seasons:', error);
      return [this.getCurrentSeason()];
    }
  }

  // Achievement system
  static async checkAndAwardAchievements(userId: string, leaderboardEntryId: string, context: SimulationContext): Promise<UserAchievement[]> {
    try {
      const achievements = await this.getAchievements();
      const awardedAchievements: UserAchievement[] = [];

      for (const achievement of achievements) {
        if (await this.meetsAchievementCriteria(achievement, context)) {
          const { data, error } = await supabase
            .from('user_achievements')
            .upsert({
              user_id: userId,
              achievement_id: achievement.id,
              leaderboard_entry_id: leaderboardEntryId,
            }, { 
              onConflict: 'user_id,achievement_id,leaderboard_entry_id',
              ignoreDuplicates: true 
            })
            .select()
            .single();

          if (!error && data) {
            awardedAchievements.push(data);
          }
        }
      }

      return awardedAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  }

  private static async getAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('category', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  private static async meetsAchievementCriteria(achievement: Achievement, context: SimulationContext): Promise<boolean> {
    const criteria = achievement.criteria;
    const finalResults = context.finalResults;
    if (!finalResults) return false;

    // Check various achievement criteria
    if (criteria.min_score && finalResults.score < criteria.min_score) return false;
    if (criteria.required_grade && finalResults.grade !== criteria.required_grade) return false;
    if (criteria.min_roi && context.quarters) {
      const totalRevenue = Object.values(context.quarters).reduce((sum, q) => sum + q.results.revenue, 0);
      const totalSpent = Object.values(context.quarters).reduce((sum, q) => sum + q.budgetSpent, 0);
      const roi = totalSpent > 0 ? ((totalRevenue - totalSpent) / totalSpent) * 100 : 0;
      if (roi < criteria.min_roi) return false;
    }
    if (criteria.min_market_share && finalResults.finalKPIs.marketShare < criteria.min_market_share) return false;
    if (criteria.requires_big_bet && !context.selectedBigBet) return false;
    if (criteria.requires_big_bet_success && !context.bigBetOutcome?.success) return false;
    if (criteria.min_talent_hired && context.hiredTalent.length < criteria.min_talent_hired) return false;
    if (criteria.max_completion_time && context.completionTimeMinutes && context.completionTimeMinutes > criteria.max_completion_time) return false;

    return true;
  }

  private static async generateSimulationHash(data: any): Promise<string> {
    const jsonString = JSON.stringify(data, Object.keys(data).sort());
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(jsonString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private static getCurrentSeason(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 0-based to 1-based
    
    let quarter: string;
    if (month <= 3) quarter = 'Q1';
    else if (month <= 6) quarter = 'Q2';
    else if (month <= 9) quarter = 'Q3';
    else quarter = 'Q4';
    
    return `${year}-${quarter}`;
  }

  // Reset seasonal leaderboard (admin function)
  static async resetSeason(season: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leaderboard_entries')
        .delete()
        .eq('season', season);

      return !error;
    } catch (error) {
      console.error('Error resetting season:', error);
      return false;
    }
  }
}
