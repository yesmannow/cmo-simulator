export interface Simulation {
  id: string
  user_id: string
  
  // Phase 0: Company Setup
  company_name: string
  time_horizon: '1-year' | '3-year' | '5-year'
  industry: 'healthcare' | 'legal' | 'ecommerce'
  company_profile: 'startup' | 'enterprise'
  market_landscape: 'disruptor' | 'crowded' | 'frontier'
  
  // Budget Allocation (percentages, must sum to 100)
  budget_brand_awareness: number
  budget_lead_generation: number
  budget_conversion_optimization: number
  
  // Financial Data
  total_budget: number
  budget_spent: number
  total_revenue: number
  total_profit: number
  
  // Hidden Metrics (not directly shown to player)
  brand_equity: number
  team_morale: number
  
  // Final KPIs
  final_market_share: number
  customer_satisfaction: number
  brand_awareness: number
  roi_percentage: number
  
  // Scoring
  strategy_score: number
  grade: string | null
  percentile: number | null
  
  // Simulation State
  current_quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'completed'
  status: 'in_progress' | 'completed' | 'abandoned'
  
  // Metadata
  created_at: string
  started_at: string | null
  completed_at: string | null
  completion_time_minutes: number | null
}
