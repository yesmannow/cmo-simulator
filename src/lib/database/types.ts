export interface LeaderboardEntry {
  id: string;
  user_id: string;
  username: string;
  company_name: string;
  industry: string;
  strategy_type: string;
  target_audience?: string;
  brand_positioning?: string;
  primary_channels?: string[];
  
  // Final scores and metrics
  final_score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  total_revenue: number;
  final_market_share: number;
  final_satisfaction: number;
  final_awareness: number;
  roi_percentage: number;
  
  // Simulation details
  total_budget: number;
  budget_utilized: number;
  quarters_completed: number;
  wildcards_handled: number;
  talent_hired: number;
  big_bet_made: boolean;
  big_bet_success: boolean;
  
  // Timing and competition
  completion_time_minutes?: number;
  season: string;
  submitted_at: string;
  
  // Validation
  is_verified: boolean;
  simulation_hash?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  criteria: AchievementCriteria;
  created_at: string;
}

export interface AchievementCriteria {
  min_score?: number;
  required_grade?: LeaderboardEntry['grade'];
  min_roi?: number;
  min_market_share?: number;
  requires_big_bet?: boolean;
  requires_big_bet_success?: boolean;
  min_talent_hired?: number;
  max_completion_time?: number;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  leaderboard_entry_id: string;
  earned_at: string;
  achievement?: Achievement;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardFilters {
  season?: string;
  industry?: string;
  strategy_type?: string;
  grade?: string;
  sortBy?: 'final_score' | 'total_revenue' | 'roi_percentage' | 'submitted_at';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface LeaderboardStats {
  total_entries: number;
  average_score: number;
  highest_score: number;
  most_common_industry: string;
  most_successful_strategy: string;
  current_season: string;
}

export interface GameificationMetrics {
  rank: number;
  percentile: number;
  achievements_earned: number;
  total_points: number;
  next_achievement?: Achievement;
  progress_to_next?: number;
}
