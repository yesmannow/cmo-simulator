-- CMO Simulator Leaderboard Schema

-- Users table for basic user information
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard entries table
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  username VARCHAR(50) NOT NULL,
  company_name VARCHAR(100) NOT NULL,
  industry VARCHAR(50) NOT NULL,
  strategy_type VARCHAR(50) NOT NULL,
  target_audience VARCHAR(100),
  brand_positioning VARCHAR(100),
  primary_channels TEXT[], -- Array of channels
  
  -- Final scores and metrics
  final_score INTEGER NOT NULL CHECK (final_score >= 0 AND final_score <= 100),
  grade VARCHAR(2) NOT NULL CHECK (grade IN ('A+', 'A', 'B', 'C', 'D', 'F')),
  total_revenue BIGINT NOT NULL,
  final_market_share DECIMAL(5,2) NOT NULL,
  final_satisfaction DECIMAL(5,2) NOT NULL,
  final_awareness DECIMAL(5,2) NOT NULL,
  roi_percentage DECIMAL(8,2) NOT NULL,
  
  -- Simulation details
  total_budget BIGINT NOT NULL,
  budget_utilized BIGINT NOT NULL,
  quarters_completed INTEGER DEFAULT 4 CHECK (quarters_completed BETWEEN 1 AND 4),
  wildcards_handled INTEGER DEFAULT 0,
  talent_hired INTEGER DEFAULT 0,
  big_bet_made BOOLEAN DEFAULT FALSE,
  big_bet_success BOOLEAN DEFAULT FALSE,
  
  -- Timing and competition
  completion_time_minutes INTEGER, -- Time to complete simulation
  season VARCHAR(20) DEFAULT '2025-Q4', -- For seasonal competitions
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Validation
  is_verified BOOLEAN DEFAULT FALSE,
  simulation_hash VARCHAR(64), -- For preventing cheating
  
  UNIQUE(user_id, season) -- One entry per user per season
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL,
  rarity VARCHAR(20) DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  points INTEGER DEFAULT 0,
  criteria JSONB NOT NULL, -- Flexible criteria for earning achievement
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements junction table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  leaderboard_entry_id UUID REFERENCES leaderboard_entries(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_id, leaderboard_entry_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard_entries(final_score DESC, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_season ON leaderboard_entries(season, final_score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_industry ON leaderboard_entries(industry, final_score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_strategy ON leaderboard_entries(strategy_type, final_score DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Users can read all leaderboard entries but only insert/update their own
CREATE POLICY "Users can view all leaderboard entries" ON leaderboard_entries
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own leaderboard entries" ON leaderboard_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leaderboard entries" ON leaderboard_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can view all achievements
CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT USING (true);

-- Users can view all user achievements but only insert their own
CREATE POLICY "Users can view all user achievements" ON user_achievements
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own achievements" ON user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
