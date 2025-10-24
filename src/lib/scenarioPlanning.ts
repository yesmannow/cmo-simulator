/**
 * Scenario Planning System
 * "What-if" analysis for marketing decisions
 */

import { Channel, Scenario, ScenarioOutcome, WhatIfAnalysis, WhatIfResult, QuarterlyResults } from '@/types';
import { InsightContext } from './aiInsights';

// ============================================================================
// SCENARIO TYPES
// ============================================================================

export interface ScenarioComparison {
  baseline: ScenarioOutcome;
  scenarios: Array<{
    scenario: Scenario;
    outcome: ScenarioOutcome;
    difference: {
      revenue: number;
      roi: number;
      market_share: number;
    };
  }>;
  recommendation: string;
}

export interface OptimizationResult {
  optimal_allocation: Record<Channel, number>;
  expected_revenue: number;
  expected_roi: number;
  improvement_over_current: number;
  confidence: number;
}

// ============================================================================
// SCENARIO PLANNING SERVICE
// ============================================================================

export class ScenarioPlanningService {
  private static instance: ScenarioPlanningService;
  private scenarios: Map<string, Scenario> = new Map();

  private constructor() {}

  static getInstance(): ScenarioPlanningService {
    if (!ScenarioPlanningService.instance) {
      ScenarioPlanningService.instance = new ScenarioPlanningService();
    }
    return ScenarioPlanningService.instance;
  }

  /**
   * Create a new scenario
   */
  createScenario(
    name: string,
    description: string,
    baseSimulationId: string,
    channelSpends: Record<Channel, number>,
    context: InsightContext
  ): Scenario {
    const scenario: Scenario = {
      id: crypto.randomUUID(),
      name,
      description,
      base_simulation_id: baseSimulationId,
      channel_spends: channelSpends,
      predicted_outcomes: this.predictOutcome(channelSpends, context),
      created_at: new Date().toISOString()
    };

    this.scenarios.set(scenario.id, scenario);
    return scenario;
  }

  /**
   * Predict outcome for a scenario
   */
  predictOutcome(
    channelSpends: Record<Channel, number>,
    context: InsightContext
  ): ScenarioOutcome {
    // Calculate total spend
    const totalSpend = Object.values(channelSpends).reduce((sum, spend) => sum + spend, 0);

    // Calculate expected revenue based on channel ROI
    let expectedRevenue = 0;
    for (const [channel, spend] of Object.entries(channelSpends)) {
      const performance = context.quarterlyResults.channel_performance[channel as Channel];
      if (performance) {
        const roi = performance.roi / 100;
        expectedRevenue += spend * roi;
      } else {
        // Use industry average if no data
        expectedRevenue += spend * 1.5; // 150% ROI assumption
      }
    }

    // Calculate ROI
    const roi = totalSpend > 0 ? (expectedRevenue / totalSpend) * 100 : 0;

    // Estimate market share impact
    const spendIncrease = (totalSpend - context.totalBudget) / context.totalBudget;
    const marketShareChange = spendIncrease * 5; // 5% market share per 100% spend increase
    const newMarketShare = Math.max(0, Math.min(100, context.marketShare + marketShareChange));

    // Calculate confidence interval (±20%)
    const confidenceLow = expectedRevenue * 0.8;
    const confidenceHigh = expectedRevenue * 1.2;

    // Identify risks and opportunities
    const risks: string[] = [];
    const opportunities: string[] = [];

    // Check for over-concentration
    const maxChannelSpend = Math.max(...Object.values(channelSpends));
    if (maxChannelSpend > totalSpend * 0.5) {
      risks.push('Over-concentration in single channel increases risk');
    }

    // Check for budget increase
    if (totalSpend > context.totalBudget * 1.2) {
      risks.push('Significant budget increase may strain resources');
    }

    // Check for high-ROI channels
    for (const [channel, spend] of Object.entries(channelSpends)) {
      const performance = context.quarterlyResults.channel_performance[channel as Channel];
      if (performance && performance.roi > 200 && spend > 0) {
        opportunities.push(`${channel} has high ROI - consider increasing investment`);
      }
    }

    return {
      revenue: expectedRevenue,
      roi,
      market_share: newMarketShare,
      confidence_interval: {
        low: confidenceLow,
        high: confidenceHigh
      },
      risks,
      opportunities
    };
  }

  /**
   * Compare multiple scenarios
   */
  compareScenarios(
    baselineSpends: Record<Channel, number>,
    scenarios: Scenario[],
    context: InsightContext
  ): ScenarioComparison {
    const baseline = this.predictOutcome(baselineSpends, context);

    const comparisons = scenarios.map(scenario => {
      const outcome = scenario.predicted_outcomes;
      return {
        scenario,
        outcome,
        difference: {
          revenue: outcome.revenue - baseline.revenue,
          roi: outcome.roi - baseline.roi,
          market_share: outcome.market_share - baseline.market_share
        }
      };
    });

    // Find best scenario
    const bestScenario = comparisons.reduce((best, current) => 
      current.outcome.revenue > best.outcome.revenue ? current : best
    );

    const recommendation = `Scenario "${bestScenario.scenario.name}" shows the highest potential with $${bestScenario.outcome.revenue.toLocaleString()} expected revenue (${bestScenario.difference.revenue > 0 ? '+' : ''}$${bestScenario.difference.revenue.toLocaleString()} vs baseline).`;

    return {
      baseline,
      scenarios: comparisons,
      recommendation
    };
  }

  /**
   * Run what-if analysis on a specific parameter
   */
  runWhatIfAnalysis(
    parameter: 'total_budget' | 'channel_spend',
    channel: Channel | null,
    testValues: number[],
    baseSpends: Record<Channel, number>,
    context: InsightContext
  ): WhatIfAnalysis {
    const results: WhatIfResult[] = [];

    for (const value of testValues) {
      let testSpends = { ...baseSpends };

      if (parameter === 'total_budget') {
        // Scale all channels proportionally
        const currentTotal = Object.values(baseSpends).reduce((sum, spend) => sum + spend, 0);
        const scaleFactor = value / currentTotal;
        testSpends = Object.fromEntries(
          Object.entries(baseSpends).map(([ch, spend]) => [ch, spend * scaleFactor])
        ) as Record<Channel, number>;
      } else if (parameter === 'channel_spend' && channel) {
        // Change specific channel
        testSpends[channel] = value;
      }

      const outcome = this.predictOutcome(testSpends, context);
      results.push({
        value,
        revenue: outcome.revenue,
        roi: outcome.roi,
        market_share: outcome.market_share
      });
    }

    return {
      parameter: parameter === 'total_budget' ? 'Total Budget' : `${channel} Spend`,
      current_value: parameter === 'total_budget' 
        ? Object.values(baseSpends).reduce((sum, spend) => sum + spend, 0)
        : (channel ? baseSpends[channel] : 0),
      test_values: testValues,
      results
    };
  }

  /**
   * Find optimal budget allocation
   */
  findOptimalAllocation(
    totalBudget: number,
    context: InsightContext,
    constraints?: {
      min_per_channel?: number;
      max_per_channel?: number;
      required_channels?: Channel[];
    }
  ): OptimizationResult {
    // Get channel performance data
    const channelROIs = Object.entries(context.quarterlyResults.channel_performance)
      .map(([channel, perf]) => ({
        channel: channel as Channel,
        roi: perf.roi,
        current_spend: context.channelSpends[channel as Channel] || 0
      }))
      .sort((a, b) => b.roi - a.roi);

    // Simple greedy allocation (prioritize high ROI channels)
    const allocation: Record<Channel, number> = {} as Record<Channel, number>;
    let remainingBudget = totalBudget;

    // Initialize all channels to minimum
    const minPerChannel = constraints?.min_per_channel || 0;
    for (const { channel } of channelROIs) {
      allocation[channel] = minPerChannel;
      remainingBudget -= minPerChannel;
    }

    // Allocate remaining budget to high-ROI channels
    const maxPerChannel = constraints?.max_per_channel || totalBudget * 0.4;
    for (const { channel, roi } of channelROIs) {
      if (remainingBudget <= 0) break;

      const additionalAllocation = Math.min(
        remainingBudget,
        maxPerChannel - allocation[channel]
      );

      allocation[channel] += additionalAllocation;
      remainingBudget -= additionalAllocation;
    }

    // Distribute any remaining budget
    if (remainingBudget > 0) {
      const channelsToBoost = channelROIs.filter(({ channel }) => 
        allocation[channel] < maxPerChannel
      );
      const perChannelBoost = remainingBudget / channelsToBoost.length;
      
      for (const { channel } of channelsToBoost) {
        allocation[channel] += perChannelBoost;
      }
    }

    // Calculate expected outcome
    const outcome = this.predictOutcome(allocation, context);
    const currentRevenue = context.quarterlyResults.revenue;
    const improvement = ((outcome.revenue - currentRevenue) / currentRevenue) * 100;

    return {
      optimal_allocation: allocation,
      expected_revenue: outcome.revenue,
      expected_roi: outcome.roi,
      improvement_over_current: improvement,
      confidence: 75
    };
  }

  /**
   * Generate pre-built scenario templates
   */
  generateTemplateScenarios(
    baseSimulationId: string,
    context: InsightContext
  ): Scenario[] {
    const totalBudget = context.totalBudget;
    const templates: Scenario[] = [];

    // 1. Conservative scenario (reduce spend by 20%)
    const conservativeSpends = Object.fromEntries(
      Object.entries(context.channelSpends).map(([ch, spend]) => [ch, spend * 0.8])
    ) as Record<Channel, number>;

    templates.push(this.createScenario(
      'Conservative Approach',
      'Reduce overall spending by 20% while maintaining channel mix',
      baseSimulationId,
      conservativeSpends,
      context
    ));

    // 2. Aggressive scenario (increase spend by 50%)
    const aggressiveSpends = Object.fromEntries(
      Object.entries(context.channelSpends).map(([ch, spend]) => [ch, spend * 1.5])
    ) as Record<Channel, number>;

    templates.push(this.createScenario(
      'Aggressive Growth',
      'Increase spending by 50% to accelerate growth',
      baseSimulationId,
      aggressiveSpends,
      context
    ));

    // 3. Digital-first scenario
    const digitalChannels: Channel[] = ['digital', 'social', 'seo'];
    const digitalSpends = { ...context.channelSpends };
    const digitalBudget = totalBudget * 0.7;
    const traditionalBudget = totalBudget * 0.3;

    digitalChannels.forEach(ch => {
      digitalSpends[ch] = digitalBudget / digitalChannels.length;
    });

    const traditionalChannels = Object.keys(context.channelSpends).filter(
      ch => !digitalChannels.includes(ch as Channel)
    ) as Channel[];
    traditionalChannels.forEach(ch => {
      digitalSpends[ch] = traditionalBudget / traditionalChannels.length;
    });

    templates.push(this.createScenario(
      'Digital-First Strategy',
      'Allocate 70% of budget to digital channels',
      baseSimulationId,
      digitalSpends,
      context
    ));

    // 4. Balanced scenario
    const channelCount = Object.keys(context.channelSpends).length;
    const balancedSpends = Object.fromEntries(
      Object.keys(context.channelSpends).map(ch => [ch, totalBudget / channelCount])
    ) as Record<Channel, number>;

    templates.push(this.createScenario(
      'Balanced Approach',
      'Distribute budget equally across all channels',
      baseSimulationId,
      balancedSpends,
      context
    ));

    // 5. Optimized scenario (based on ROI)
    const optimized = this.findOptimalAllocation(totalBudget, context);
    templates.push(this.createScenario(
      'AI-Optimized',
      'Budget allocation optimized for maximum ROI',
      baseSimulationId,
      optimized.optimal_allocation,
      context
    ));

    return templates;
  }

  /**
   * Get all scenarios
   */
  getAllScenarios(): Scenario[] {
    return Array.from(this.scenarios.values());
  }

  /**
   * Get scenario by ID
   */
  getScenario(id: string): Scenario | undefined {
    return this.scenarios.get(id);
  }

  /**
   * Delete scenario
   */
  deleteScenario(id: string): boolean {
    return this.scenarios.delete(id);
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

export const scenarioPlanning = ScenarioPlanningService.getInstance();

export const createScenario = (
  name: string,
  description: string,
  baseSimulationId: string,
  channelSpends: Record<Channel, number>,
  context: InsightContext
) => scenarioPlanning.createScenario(name, description, baseSimulationId, channelSpends, context);

export const compareScenarios = (
  baselineSpends: Record<Channel, number>,
  scenarios: Scenario[],
  context: InsightContext
) => scenarioPlanning.compareScenarios(baselineSpends, scenarios, context);

export const runWhatIfAnalysis = (
  parameter: 'total_budget' | 'channel_spend',
  channel: Channel | null,
  testValues: number[],
  baseSpends: Record<Channel, number>,
  context: InsightContext
) => scenarioPlanning.runWhatIfAnalysis(parameter, channel, testValues, baseSpends, context);

export const findOptimalAllocation = (
  totalBudget: number,
  context: InsightContext,
  constraints?: {
    min_per_channel?: number;
    max_per_channel?: number;
    required_channels?: Channel[];
  }
) => scenarioPlanning.findOptimalAllocation(totalBudget, context, constraints);

export const generateTemplateScenarios = (
  baseSimulationId: string,
  context: InsightContext
) => scenarioPlanning.generateTemplateScenarios(baseSimulationId, context);
