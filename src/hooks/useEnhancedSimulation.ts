/**
 * Enhanced Simulation Hook
 * Provides easy access to simulation state and actions
 */

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  SimulationConfig,
  SimulationState,
  QuarterlyDecisions,
  initializeSimulation,
  processQuarter,
  finalizeSimulation,
  generateQuarterlyWildcard,
  validateDecisions,
  QuarterPerformance,
  ABTest,
  SimulationDebrief,
  TacticUsage,
  WildcardEvent
} from '@/lib/simulationEngine';
import { createClient } from '@/lib/supabase/client';
import { TacticUsage, WildcardEvent, SimulationDebrief } from '@/lib/scoringEngine';

const STORAGE_KEY = 'cmo-sim-state';

export function useEnhancedSimulation() {
  const router = useRouter();
  const [state, setState] = useState<SimulationState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setState(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored simulation state', e);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (state) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  /**
   * Start a new simulation
   */
  const startSimulation = useCallback((config: SimulationConfig) => {
    const newState = initializeSimulation(config);
    setState(newState);
    return newState;
  }, []);

  /**
   * Process quarter decisions
   */
  const submitQuarterDecisions = useCallback(
    async (decisions: QuarterlyDecisions) => {
      if (!state) {
        setError('No active simulation');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Validate decisions
        const validation = validateDecisions(state, decisions);
        if (!validation.valid) {
          setError(validation.errors.join(', '));
          setIsLoading(false);
          return null;
        }

        // Process quarter
        const newState = processQuarter(state, decisions);
        setState(newState);

        // Save to database
        await saveQuarterToDatabase(newState, decisions);

        setIsLoading(false);
        return newState;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to process quarter');
        setIsLoading(false);
        return null;
      }
    },
    [state]
  );

  /**
   * Complete simulation and calculate final score
   */
  const completeSimulation = useCallback(async () => {
    if (!state) {
      setError('No active simulation');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const finalScore = finalizeSimulation(state);
      
      // Save to database
      const simulationId = await saveSimulationToDatabase(state, finalScore);

      setIsLoading(false);
      
      // Navigate to results
      router.push(`/sim/debrief/${simulationId}`);
      
      return { finalScore, simulationId };
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to complete simulation');
      setIsLoading(false);
      return null;
    }
  }, [state, router]);

  /**
   * Generate wildcard event for current quarter
   */
  const getWildcardEvent = useCallback(() => {
    if (!state) return null;
    return generateQuarterlyWildcard(state, state.currentQuarter as string);
  }, [state]);

  /**
   * Reset simulation
   */
  const resetSimulation = useCallback(() => {
    setState(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  /**
   * Get current quarter data
   */
  const getCurrentQuarterData = useCallback(() => {
    if (!state) return null;
    
    const quarterIndex = ['Q1', 'Q2', 'Q3', 'Q4'].indexOf(state.currentQuarter as string);
    if (quarterIndex === -1) return null;

    return {
      quarter: state.currentQuarter,
      quarterNumber: quarterIndex + 1,
      budgetRemaining: state.budgetRemaining,
      currentMarketShare: state.currentMarketShare,
      brandEquity: state.brandEquity,
      teamMorale: state.teamMorale,
      previousResults: state.quarterlyResults[quarterIndex - 1] || null
    };
  }, [state]);

  return {
    // State
    state,
    isLoading,
    error,
    
    // Actions
    startSimulation,
    submitQuarterDecisions,
    completeSimulation,
    resetSimulation,
    
    // Utilities
    getWildcardEvent,
    getCurrentQuarterData,
    
    // Computed
    isSimulationActive: state !== null,
    isSimulationComplete: state?.currentQuarter === 'completed',
    currentQuarter: state?.currentQuarter || null,
    progress: state ? ((['Q1', 'Q2', 'Q3', 'Q4'].indexOf(state.currentQuarter as string) + 1) / 4) * 100 : 0
  };
}

/**
 * Save quarter results to Supabase
 */
async function saveQuarterToDatabase(state: SimulationState, decisions: QuarterlyDecisions) {
  const supabase = createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // In production, save to quarterly_results, decision_points, tactics_used, etc.
  // For now, just log
  console.log('Saving quarter to database:', { state, decisions });
}

/**
 * Save completed simulation to Supabase
 */
async function saveSimulationToDatabase(state: SimulationState, finalScore: any): Promise<string> {
  const supabase = createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Calculate completion time
  const completionTime = 45; // Mock - in production, track actual time

  // Insert simulation
  const { data: simulation, error } = await supabase
    .from('simulations_enhanced')
    .insert({
      user_id: user.id,
      company_name: state.config.companyName,
      time_horizon: state.config.timeHorizon,
      industry: state.config.industry,
      company_profile: state.config.companyProfile,
      market_landscape: state.config.marketLandscape,
      budget_brand_awareness: state.config.budgetAllocation.brandAwareness,
      budget_lead_generation: state.config.budgetAllocation.leadGeneration,
      budget_conversion_optimization: state.config.budgetAllocation.conversionOptimization,
      total_budget: state.totalBudget,
      budget_spent: state.totalBudget - state.budgetRemaining,
      total_revenue: state.totalRevenue,
      total_profit: state.totalProfit,
      brand_equity: state.brandEquity,
      team_morale: state.teamMorale,
      final_market_share: state.currentMarketShare,
      roi_percentage: finalScore.finalKPIs.roi,
      strategy_score: finalScore.strategyScore,
      grade: finalScore.grade,
      current_quarter: 'completed',
      status: 'completed',
      completed_at: new Date().toISOString(),
      completion_time_minutes: completionTime
    })
    .select()
    .single();

  if (error) throw error;
  if (!simulation) throw new Error('Failed to create simulation');

  // Save quarterly results
  for (const quarter of state.quarterlyResults) {
    await supabase.from('quarterly_results').insert({
      simulation_id: simulation.id,
      quarter: quarter.quarter,
      budget_spent: quarter.budgetSpent,
      team_hours_used: quarter.timeSpent,
      revenue: quarter.results.revenue,
      profit: quarter.results.profit,
      leads: quarter.leads,
      conversions: quarter.conversions,
      market_share: quarter.results.marketShare,
      traffic_organic: quarter.trafficSources.organic,
      traffic_paid: quarter.trafficSources.paid,
      traffic_social: quarter.trafficSources.social,
      traffic_referral: quarter.trafficSources.referral
    });
  }

  // Save decision points (for debrief)
  let decisionOrder = 0;
  for (const decision of state.decisions) {
    // Save main decision
    await supabase.from('decision_points').insert({
      simulation_id: simulation.id,
      quarter: decision.quarter,
      decision_type: 'tactic-selection',
      decision_description: `Selected ${decision.tactics.length} tactics`,
      outcome: 'positive',
      decision_order: decisionOrder++
    });

    // Save A/B test if present
    if (decision.abTestResult) {
      await supabase.from('ab_test_results').insert({
        simulation_id: simulation.id,
        quarter: decision.quarter,
        test_id: 'test-1',
        selected_ad: 'A',
        correct_ad: decision.abTestResult.selectedCorrectly ? 'A' : 'B',
        selected_correctly: decision.abTestResult.selectedCorrectly,
        cpa_change_percentage: decision.abTestResult.cpaImpact,
        conversion_change_percentage: decision.abTestResult.conversionImpact
      });
    }
  }

  return simulation.id;
}

/**
 * Hook for loading a completed simulation for debrief
 */
export function useSimulationDebrief(simulationId: string) {
  const [debrief, setDebrief] = useState<SimulationDebrief | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDebrief() {
      const supabase = createClient();
      
      try {
        // Load simulation
        const { data: simulation, error: simError } = await supabase
          .from('simulations_enhanced')
          .select('*')
          .eq('id', simulationId)
          .single();

        if (simError) throw simError;

        // Load quarterly results
        const { data: quarters, error: quartersError } = await supabase
          .from('quarterly_results')
          .select('*')
          .eq('simulation_id', simulationId)
          .order('quarter');

        if (quartersError) throw quartersError;

        // Load decision points
        const { data: decisions, error: decisionsError } = await supabase
          .from('decision_points')
          .select('*')
          .eq('simulation_id', simulationId)
          .order('quarter, decision_order');

        if (decisionsError) throw decisionsError;

        // Combine into debrief object
        setDebrief({
          simulation,
          quarters,
          decisions
        });
        
        setIsLoading(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load debrief');
        setIsLoading(false);
      }
    }

    loadDebrief();
  }, [simulationId]);

  return { debrief, isLoading, error };
}

export interface QuarterPerformance {
  tacticsUsed: TacticUsage[];
  budgetSpent: number;
  timeSpent: number;
  wildcardEvents: WildcardEvent[];
  results: {
    revenue: number;
    profit: number;
    marketShare: number;
    customerSatisfaction: number;
    brandAwareness: number;
  };
}
