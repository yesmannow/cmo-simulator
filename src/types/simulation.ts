export interface Simulation {
  id: string
  user_id: string
  name: string
  status: 'running' | 'completed' | 'failed'
  revenue: number
  profit: number
  market_share: number
  customer_satisfaction: number
  brand_awareness: number
  duration_weeks: number
  budget: number
  target_market: string
  created_at: string
  completed_at: string | null
  updated_at: string
}
