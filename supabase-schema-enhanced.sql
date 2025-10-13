-- Enhanced CMO Simulator Database Schema
-- Supports all Phase 0 variables, decision tracking, and advanced scoring

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Profiles table for user preferences and theme settings
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  brand_theme TEXT DEFAULT 'aurora-tech',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Function to automatically create profile on user signup
DROP FUNCTION IF EXISTS public.handle_new_user();
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, brand_theme)
  VALUES (NEW.id, 'aurora-tech');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enhanced simulations table with all Phase 0 variables
CREATE TABLE IF NOT EXISTS simulations_enhanced (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Phase 0: Company Setup
  company_name TEXT NOT NULL,
  time_horizon TEXT NOT NULL CHECK (time_horizon IN ('1-year', '3-year', '5-year')),
  industry TEXT NOT NULL CHECK (industry IN ('healthcare', 'legal', 'ecommerce')),
  company_profile TEXT NOT NULL CHECK (company_profile IN ('startup', 'enterprise')),
  market_landscape TEXT NOT NULL CHECK (market_landscape IN ('disruptor', 'crowded', 'frontier')),
  difficulty TEXT DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  
  -- Budget Allocation (percentages, must sum to 100)
  budget_brand_awareness INTEGER NOT NULL CHECK (budget_brand_awareness >= 0 AND budget_brand_awareness <= 100),
  budget_lead_generation INTEGER NOT NULL CHECK (budget_lead_generation >= 0 AND budget_lead_generation <= 100),
  budget_conversion_optimization INTEGER NOT NULL CHECK (budget_conversion_optimization >= 0 AND budget_conversion_optimization <= 100),
  
  -- Financial Data
  total_budget BIGINT NOT NULL,
  budget_spent BIGINT DEFAULT 0,
  total_revenue BIGINT DEFAULT 0,
  total_profit BIGINT DEFAULT 0,
  
  -- Hidden Metrics (not directly shown to player)
  brand_equity DECIMAL(5,2) DEFAULT 50.0 CHECK (brand_equity >= 0 AND brand_equity <= 100),
  team_morale DECIMAL(5,2) DEFAULT 75.0 CHECK (team_morale >= 0 AND team_morale <= 100),
  
  -- Final KPIs
  final_market_share DECIMAL(5,2) DEFAULT 5.0,
  customer_satisfaction DECIMAL(5,2) DEFAULT 50.0,
  brand_awareness DECIMAL(5,2) DEFAULT 20.0,
  roi_percentage DECIMAL(8,2) DEFAULT 0,
  
  -- Scoring
  strategy_score INTEGER DEFAULT 0,
  grade TEXT CHECK (grade IN ('A+', 'A', 'B', 'C', 'D', 'F')),
  percentile INTEGER CHECK (percentile >= 0 AND percentile <= 100),
  
  -- Simulation State
  current_quarter TEXT DEFAULT 'Q1' CHECK (current_quarter IN ('Q1', 'Q2', 'Q3', 'Q4', 'completed')),
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  completion_time_minutes INTEGER,
  
  -- Constraints
  CONSTRAINT budget_allocation_sum CHECK (
    budget_brand_awareness + budget_lead_generation + budget_conversion_optimization = 100
  )
);

-- Quarterly Performance Data
CREATE TABLE IF NOT EXISTS quarterly_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  simulation_id UUID REFERENCES simulations_enhanced(id) ON DELETE CASCADE NOT NULL,
  quarter TEXT NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
  
  -- Spend & Time
  budget_spent BIGINT NOT NULL,
  team_hours_used INTEGER NOT NULL,
  
  -- Results
  revenue BIGINT DEFAULT 0,
  profit BIGINT DEFAULT 0,
  leads INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  market_share DECIMAL(5,2) DEFAULT 0,
  
  -- Traffic Sources
  traffic_organic INTEGER DEFAULT 0,
  traffic_paid INTEGER DEFAULT 0,
  traffic_social INTEGER DEFAULT 0,
  traffic_referral INTEGER DEFAULT 0,
  
  -- Hidden Metrics Changes
  brand_equity_change DECIMAL(5,2) DEFAULT 0,
  team_morale_change DECIMAL(5,2) DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(simulation_id, quarter)
);

-- Decision Points (for Campaign Debrief)
CREATE TABLE IF NOT EXISTS decision_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  simulation_id UUID REFERENCES simulations_enhanced(id) ON DELETE CASCADE NOT NULL,
  quarter TEXT NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
  
  -- Decision Details
  decision_type TEXT NOT NULL CHECK (decision_type IN (
    'budget-allocation', 
    'tactic-selection', 
    'wildcard-response', 
    'talent-hire', 
    'big-bet',
    'ab-test',
    'strategic-initiative'
  )),
  decision_description TEXT NOT NULL,
  
  -- Outcome
  outcome TEXT NOT NULL CHECK (outcome IN ('positive', 'negative', 'neutral')),
  
  -- Impact
  revenue_impact BIGINT DEFAULT 0,
  market_share_impact DECIMAL(5,2) DEFAULT 0,
  brand_equity_impact DECIMAL(5,2) DEFAULT 0,
  team_morale_impact DECIMAL(5,2) DEFAULT 0,
  
  -- Educational Content
  reasoning TEXT,
  alternative_outcome TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  decision_order INTEGER, -- Order within quarter
  
  UNIQUE(simulation_id, quarter, decision_order)
);

-- Tactics Used (tracks what tactics were selected each quarter)
CREATE TABLE IF NOT EXISTS tactics_used (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  simulation_id UUID REFERENCES simulations_enhanced(id) ON DELETE CASCADE NOT NULL,
  quarter TEXT NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
  
  tactic_id TEXT NOT NULL,
  tactic_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('seo', 'paid-ads', 'content', 'social', 'events', 'pr')),
  
  -- Investment
  budget_allocated BIGINT NOT NULL,
  time_invested INTEGER NOT NULL,
  
  -- Results
  leads_generated INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue_generated BIGINT DEFAULT 0,
  
  -- Effectiveness
  cost_per_lead DECIMAL(10,2),
  cost_per_acquisition DECIMAL(10,2),
  roi_percentage DECIMAL(8,2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wildcard Events & Responses
CREATE TABLE IF NOT EXISTS wildcard_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  simulation_id UUID REFERENCES simulations_enhanced(id) ON DELETE CASCADE NOT NULL,
  quarter TEXT NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
  
  -- Event Details
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('competitive', 'market-shift', 'internal-crisis', 'opportunity')),
  severity TEXT NOT NULL CHECK (severity IN ('minor', 'major', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Response
  choice_id TEXT NOT NULL,
  choice_title TEXT NOT NULL,
  
  -- Impact
  budget_cost BIGINT DEFAULT 0,
  time_cost INTEGER DEFAULT 0,
  revenue_impact BIGINT DEFAULT 0,
  market_share_impact DECIMAL(5,2) DEFAULT 0,
  brand_equity_impact DECIMAL(5,2) DEFAULT 0,
  team_morale_impact DECIMAL(5,2) DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Talent Hires
CREATE TABLE IF NOT EXISTS talent_hires (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  simulation_id UUID REFERENCES simulations_enhanced(id) ON DELETE CASCADE NOT NULL,
  quarter TEXT NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
  
  candidate_id TEXT NOT NULL,
  role TEXT NOT NULL,
  salary BIGINT NOT NULL,
  
  -- Impact
  skill_bonus DECIMAL(5,2) DEFAULT 0, -- Multiplier for certain tactics
  morale_boost DECIMAL(5,2) DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Big Bets (Q4 final initiative)
CREATE TABLE IF NOT EXISTS big_bets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  simulation_id UUID REFERENCES simulations_enhanced(id) ON DELETE CASCADE NOT NULL,
  
  bet_id TEXT NOT NULL,
  bet_type TEXT NOT NULL,
  investment BIGINT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  
  -- Outcome
  success BOOLEAN DEFAULT FALSE,
  actual_return BIGINT DEFAULT 0,
  
  -- Impact
  revenue_impact BIGINT DEFAULT 0,
  market_share_impact DECIMAL(5,2) DEFAULT 0,
  brand_awareness_impact DECIMAL(5,2) DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A/B Test Results
CREATE TABLE IF NOT EXISTS ab_test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  simulation_id UUID REFERENCES simulations_enhanced(id) ON DELETE CASCADE NOT NULL,
  quarter TEXT NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
  
  test_id TEXT NOT NULL,
  selected_ad TEXT NOT NULL CHECK (selected_ad IN ('A', 'B')),
  correct_ad TEXT NOT NULL CHECK (correct_ad IN ('A', 'B')),
  selected_correctly BOOLEAN NOT NULL,
  
  -- Impact on campaign
  cpa_change_percentage DECIMAL(5,2) NOT NULL, -- Negative is good
  conversion_change_percentage DECIMAL(5,2) NOT NULL, -- Positive is good
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_simulations_user_id ON simulations_enhanced(user_id);
CREATE INDEX IF NOT EXISTS idx_simulations_status ON simulations_enhanced(status);
CREATE INDEX IF NOT EXISTS idx_simulations_score ON simulations_enhanced(strategy_score DESC);
CREATE INDEX IF NOT EXISTS idx_simulations_industry ON simulations_enhanced(industry, strategy_score DESC);

CREATE INDEX IF NOT EXISTS idx_quarterly_results_sim ON quarterly_results(simulation_id);
CREATE INDEX IF NOT EXISTS idx_decision_points_sim ON decision_points(simulation_id);
CREATE INDEX IF NOT EXISTS idx_tactics_used_sim ON tactics_used(simulation_id);
CREATE INDEX IF NOT EXISTS idx_wildcard_events_sim ON wildcard_events(simulation_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE simulations_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE quarterly_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE tactics_used ENABLE ROW LEVEL SECURITY;
ALTER TABLE wildcard_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_hires ENABLE ROW LEVEL SECURITY;
ALTER TABLE big_bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_results ENABLE ROW LEVEL SECURITY;

-- Simulations policies
DROP POLICY IF EXISTS "Users can view their own simulations" ON simulations_enhanced;
DROP POLICY IF EXISTS "Users can insert their own simulations" ON simulations_enhanced;
DROP POLICY IF EXISTS "Users can update their own simulations" ON simulations_enhanced;
DROP POLICY IF EXISTS "Users can delete their own simulations" ON simulations_enhanced;

CREATE POLICY "Users can view their own simulations" ON simulations_enhanced
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own simulations" ON simulations_enhanced
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own simulations" ON simulations_enhanced
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own simulations" ON simulations_enhanced
  FOR DELETE USING (auth.uid() = user_id);

-- Quarterly results policies
DROP POLICY IF EXISTS "Users can view their simulation quarterly results" ON quarterly_results;
DROP POLICY IF EXISTS "Users can insert their simulation quarterly results" ON quarterly_results;

CREATE POLICY "Users can view their simulation quarterly results" ON quarterly_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM simulations_enhanced 
      WHERE simulations_enhanced.id = quarterly_results.simulation_id 
      AND simulations_enhanced.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their simulation quarterly results" ON quarterly_results
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM simulations_enhanced 
      WHERE simulations_enhanced.id = quarterly_results.simulation_id 
      AND simulations_enhanced.user_id = auth.uid()
    )
  );

-- Decision points policies (same pattern)
DROP POLICY IF EXISTS "Users can view their simulation decision points" ON decision_points;
DROP POLICY IF EXISTS "Users can insert their simulation decision points" ON decision_points;

CREATE POLICY "Users can view their simulation decision points" ON decision_points
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM simulations_enhanced 
      WHERE simulations_enhanced.id = decision_points.simulation_id 
      AND simulations_enhanced.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their simulation decision points" ON decision_points
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM simulations_enhanced 
      WHERE simulations_enhanced.id = decision_points.simulation_id 
      AND simulations_enhanced.user_id = auth.uid()
    )
  );

-- Apply similar policies to other tables
DROP POLICY IF EXISTS "Users can view their simulation tactics" ON tactics_used;
DROP POLICY IF EXISTS "Users can insert their simulation tactics" ON tactics_used;

CREATE POLICY "Users can view their simulation tactics" ON tactics_used
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM simulations_enhanced 
      WHERE simulations_enhanced.id = tactics_used.simulation_id 
      AND simulations_enhanced.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their simulation tactics" ON tactics_used
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM simulations_enhanced 
      WHERE simulations_enhanced.id = tactics_used.simulation_id 
      AND simulations_enhanced.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can view their simulation wildcards" ON wildcard_events;
DROP POLICY IF EXISTS "Users can insert their simulation wildcards" ON wildcard_events;

CREATE POLICY "Users can view their simulation wildcards" ON wildcard_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM simulations_enhanced 
      WHERE simulations_enhanced.id = wildcard_events.simulation_id 
      AND simulations_enhanced.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their simulation wildcards" ON wildcard_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM simulations_enhanced 
      WHERE simulations_enhanced.id = wildcard_events.simulation_id 
      AND simulations_enhanced.user_id = auth.uid()
    )
  );

-- ============================================================================
-- VIEWS FOR ANALYTICS
-- ============================================================================

-- Leaderboard view with all necessary data
DROP VIEW IF EXISTS leaderboard_view;
CREATE VIEW leaderboard_view AS
SELECT 
  s.id,
  s.user_id,
  p.brand_theme,
  s.company_name,
  s.industry,
  s.time_horizon,
  s.market_landscape,
  s.strategy_score,
  s.grade,
  s.total_revenue,
  s.final_market_share,
  s.roi_percentage,
  s.completed_at,
  s.completion_time_minutes,
  -- Count of decisions made
  (SELECT COUNT(*) FROM decision_points WHERE decision_points.simulation_id = s.id) as total_decisions,
  -- Count of wildcards handled
  (SELECT COUNT(*) FROM wildcard_events WHERE wildcard_events.simulation_id = s.id) as wildcards_handled,
  -- Big bet made
  (SELECT COUNT(*) > 0 FROM big_bets WHERE big_bets.simulation_id = s.id) as big_bet_made
FROM simulations_enhanced s
LEFT JOIN profiles p ON p.id = s.user_id
WHERE s.status = 'completed'
ORDER BY s.strategy_score DESC;

-- Industry averages view
DROP VIEW IF EXISTS industry_averages;
CREATE VIEW industry_averages AS
SELECT 
  industry,
  COUNT(*) as total_simulations,
  AVG(strategy_score) as avg_score,
  AVG(roi_percentage) as avg_roi,
  AVG(final_market_share) as avg_market_share,
  MAX(strategy_score) as highest_score
FROM simulations_enhanced
WHERE status = 'completed'
GROUP BY industry;

-- User statistics view
DROP VIEW IF EXISTS user_statistics;
CREATE VIEW user_statistics AS
SELECT 
  user_id,
  COUNT(*) as total_simulations,
  AVG(strategy_score) as avg_score,
  MAX(strategy_score) as best_score,
  COUNT(CASE WHEN grade IN ('A+', 'A') THEN 1 END) as a_grades,
  AVG(completion_time_minutes) as avg_completion_time
FROM simulations_enhanced
WHERE status = 'completed'
GROUP BY user_id;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to calculate percentile for a simulation
DROP FUNCTION IF EXISTS calculate_percentile(UUID);
CREATE OR REPLACE FUNCTION calculate_percentile(sim_id UUID)
RETURNS INTEGER AS $$
DECLARE
  sim_score INTEGER;
  total_sims INTEGER;
  lower_scores INTEGER;
  percentile INTEGER;
BEGIN
  -- Get the score for this simulation
  SELECT strategy_score INTO sim_score
  FROM simulations_enhanced
  WHERE id = sim_id;
  
  -- Count total completed simulations
  SELECT COUNT(*) INTO total_sims
  FROM simulations_enhanced
  WHERE status = 'completed';
  
  -- Count simulations with lower scores
  SELECT COUNT(*) INTO lower_scores
  FROM simulations_enhanced
  WHERE status = 'completed' AND strategy_score < sim_score;
  
  -- Calculate percentile
  IF total_sims > 0 THEN
    percentile := ROUND((lower_scores::DECIMAL / total_sims) * 100);
  ELSE
    percentile := 0;
  END IF;
  
  RETURN percentile;
END;
$$ LANGUAGE plpgsql;

-- Function to update simulation percentile after completion
DROP FUNCTION IF EXISTS update_simulation_percentile();
CREATE OR REPLACE FUNCTION update_simulation_percentile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.percentile := calculate_percentile(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate percentile on completion
DROP TRIGGER IF EXISTS trigger_update_percentile ON simulations_enhanced;
CREATE TRIGGER trigger_update_percentile
  BEFORE UPDATE ON simulations_enhanced
  FOR EACH ROW
  EXECUTE FUNCTION update_simulation_percentile();

-- ============================================================================
-- SEED DATA (Optional - for testing)
-- ============================================================================

-- Insert sample achievements (if achievements table exists)
-- This would integrate with the existing achievements system

COMMENT ON TABLE simulations_enhanced IS 'Enhanced simulations table with full Phase 0 variables and scoring';
COMMENT ON TABLE decision_points IS 'Tracks every strategic decision made during simulation for debrief analysis';
COMMENT ON TABLE quarterly_results IS 'Stores performance metrics for each quarter';
COMMENT ON TABLE wildcard_events IS 'Records wildcard events and player responses';
