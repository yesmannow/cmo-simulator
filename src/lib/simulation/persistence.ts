import { supabase } from '@/lib/supabase/client';
import { LeaderboardService } from '@/lib/database/leaderboard';
import { SimulationContext, QuarterData } from '@/lib/simMachine';
import type { LeaderboardEntry } from '@/lib/database/types';

type QuarterKey = 'Q1' | 'Q2' | 'Q3' | 'Q4';

interface AggregatedQuarterMetric {
  quarter: QuarterKey;
  revenue: number;
  profit: number;
  marketShare: number;
  satisfaction: number;
  awareness: number;
  budgetSpent: number;
}

interface SimulationPersistenceSuccess {
  success: true;
  leaderboardEntry: LeaderboardEntry | null;
  aggregatedMetrics: {
    quarterly: AggregatedQuarterMetric[];
    totalRevenue: number;
    totalProfit: number;
    totalBudgetSpent: number;
    roiPercentage: number;
  };
}

interface SimulationPersistenceFailure {
  success: false;
  error: string;
}

export type SimulationPersistenceResult =
  | SimulationPersistenceSuccess
  | SimulationPersistenceFailure;

function buildQuarterMetrics(quarter: QuarterKey, data: QuarterData): AggregatedQuarterMetric {
  return {
    quarter,
    revenue: data.results.revenue,
    profit: data.results.profit,
    marketShare: data.results.marketShare,
    satisfaction: data.results.customerSatisfaction,
    awareness: data.results.brandAwareness,
    budgetSpent: data.budgetSpent,
  };
}

function calculateAggregatedMetrics(context: SimulationContext) {
  const quarters: QuarterKey[] = ['Q1', 'Q2', 'Q3', 'Q4'];
  const quarterly = quarters.map(quarter => buildQuarterMetrics(quarter, context.quarters[quarter]));

  const totalRevenue = quarterly.reduce((sum, q) => sum + q.revenue, 0);
  const totalProfit = quarterly.reduce((sum, q) => sum + q.profit, 0);
  const totalBudgetSpent = quarterly.reduce((sum, q) => sum + q.budgetSpent, 0);
  const roiPercentage = totalBudgetSpent > 0
    ? ((totalRevenue - totalBudgetSpent) / totalBudgetSpent) * 100
    : 0;

  return {
    quarterly,
    totalRevenue,
    totalProfit,
    totalBudgetSpent,
    roiPercentage,
  };
}

export async function persistSimulationAndSubmit(
  context: SimulationContext
): Promise<SimulationPersistenceResult> {
  if (!context.finalResults) {
    return {
      success: false,
      error: 'Simulation results are not ready to be saved yet.',
    };
  }

  const [{ data: userData, error: authError }] = await Promise.all([
    supabase.auth.getUser(),
  ]);

  if (authError) {
    console.error('Error retrieving Supabase user:', authError);
    return {
      success: false,
      error: 'We could not verify your session. Please sign in and try again.',
    };
  }

  const user = userData.user;
  if (!user) {
    return {
      success: false,
      error: 'You need to be signed in to save your simulation results.',
    };
  }

  try {
    const aggregatedMetrics = calculateAggregatedMetrics(context);
    const finalKPIs = context.finalResults.finalKPIs;

    const simulationName = context.strategy.brandPositioning
      ? `${context.strategy.brandPositioning} Strategy`
      : 'Marketing Simulation';

    const { error: insertError } = await supabase
      .from('simulations')
      .insert({
        user_id: user.id,
        name: simulationName,
        status: 'completed',
        revenue: finalKPIs.revenue,
        profit: finalKPIs.profit,
        market_share: finalKPIs.marketShare,
        customer_satisfaction: finalKPIs.customerSatisfaction,
        brand_awareness: finalKPIs.brandAwareness,
        duration_weeks: 52,
        budget: context.totalBudget,
        target_market: context.strategy.targetAudience || '',
        completed_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Error inserting simulation record:', insertError);
      return {
        success: false,
        error: 'Unable to save your simulation right now. Please try again later.',
      };
    }

    const username =
      user.email ||
      (typeof user.user_metadata?.username === 'string'
        ? user.user_metadata.username
        : undefined) ||
      (typeof user.user_metadata?.full_name === 'string'
        ? user.user_metadata.full_name
        : undefined) ||
      'Anonymous';

    const enrichedContext: SimulationContext = {
      ...context,
      strategy: {
        ...context.strategy,
        companyName:
          context.strategy.companyName ||
          context.strategy.brandPositioning ||
          'Anonymous Company',
        industry: context.strategy.industry || 'Technology',
        strategyType: context.strategy.strategyType || 'Growth',
      },
      aggregatedMetrics,
    };

    const leaderboardEntry = await LeaderboardService.submitScore(
      enrichedContext,
      user.id,
      username
    );

    if (!leaderboardEntry) {
      return {
        success: false,
        error: 'Your simulation was saved, but we could not submit it to the leaderboard.',
      };
    }

    return {
      success: true,
      leaderboardEntry,
      aggregatedMetrics,
    };
  } catch (error) {
    console.error('Unexpected error during simulation persistence:', error);
    return {
      success: false,
      error: 'Something went wrong while saving your results. Please try again.',
    };
  }
}
