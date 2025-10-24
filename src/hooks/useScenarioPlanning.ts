/**
 * React Hooks for Scenario Planning
 * Easy integration of what-if analysis in React components
 */

import { useState, useCallback, useMemo } from 'react';
import {
  scenarioPlanning,
  ScenarioComparison,
  OptimizationResult,
  generateTemplateScenarios,
  compareScenarios,
  runWhatIfAnalysis,
  findOptimalAllocation
} from '@/lib/scenarioPlanning';
import { Scenario, Channel, WhatIfAnalysis } from '@/types';
import { InsightContext } from '@/lib/aiInsights';

/**
 * Hook to manage scenarios
 */
export function useScenarios(context: InsightContext | null, baseSimulationId: string) {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadTemplates = useCallback(() => {
    if (!context) return;

    setIsLoading(true);
    const templates = generateTemplateScenarios(baseSimulationId, context);
    setScenarios(templates);
    setIsLoading(false);
  }, [context, baseSimulationId]);

  const createCustomScenario = useCallback((
    name: string,
    description: string,
    channelSpends: Record<Channel, number>
  ) => {
    if (!context) return;

    const scenario = scenarioPlanning.createScenario(
      name,
      description,
      baseSimulationId,
      channelSpends,
      context
    );

    setScenarios(prev => [...prev, scenario]);
    return scenario;
  }, [context, baseSimulationId]);

  const deleteScenario = useCallback((id: string) => {
    scenarioPlanning.deleteScenario(id);
    setScenarios(prev => prev.filter(s => s.id !== id));
  }, []);

  const clearScenarios = useCallback(() => {
    setScenarios([]);
  }, []);

  return {
    scenarios,
    isLoading,
    loadTemplates,
    createCustomScenario,
    deleteScenario,
    clearScenarios
  };
}

/**
 * Hook to compare scenarios
 */
export function useScenarioComparison(
  baselineSpends: Record<Channel, number> | null,
  scenarios: Scenario[],
  context: InsightContext | null
) {
  const comparison = useMemo<ScenarioComparison | null>(() => {
    if (!baselineSpends || !context || scenarios.length === 0) return null;

    return compareScenarios(baselineSpends, scenarios, context);
  }, [baselineSpends, scenarios, context]);

  const bestScenario = useMemo(() => {
    if (!comparison) return null;

    return comparison.scenarios.reduce((best, current) =>
      current.outcome.revenue > best.outcome.revenue ? current : best
    );
  }, [comparison]);

  const worstScenario = useMemo(() => {
    if (!comparison) return null;

    return comparison.scenarios.reduce((worst, current) =>
      current.outcome.revenue < worst.outcome.revenue ? current : worst
    );
  }, [comparison]);

  return {
    comparison,
    bestScenario,
    worstScenario
  };
}

/**
 * Hook for what-if analysis
 */
export function useWhatIfAnalysis(
  baseSpends: Record<Channel, number> | null,
  context: InsightContext | null
) {
  const [analysis, setAnalysis] = useState<WhatIfAnalysis | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const runAnalysis = useCallback((
    parameter: 'total_budget' | 'channel_spend',
    channel: Channel | null,
    testValues: number[]
  ) => {
    if (!baseSpends || !context) return;

    setIsCalculating(true);
    const result = runWhatIfAnalysis(parameter, channel, testValues, baseSpends, context);
    setAnalysis(result);
    setIsCalculating(false);
  }, [baseSpends, context]);

  const runBudgetAnalysis = useCallback((testBudgets: number[]) => {
    runAnalysis('total_budget', null, testBudgets);
  }, [runAnalysis]);

  const runChannelAnalysis = useCallback((channel: Channel, testSpends: number[]) => {
    runAnalysis('channel_spend', channel, testSpends);
  }, [runAnalysis]);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
  }, []);

  return {
    analysis,
    isCalculating,
    runBudgetAnalysis,
    runChannelAnalysis,
    clearAnalysis
  };
}

/**
 * Hook for budget optimization
 */
export function useBudgetOptimization(
  totalBudget: number,
  context: InsightContext | null
) {
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const optimize = useCallback((constraints?: {
    min_per_channel?: number;
    max_per_channel?: number;
    required_channels?: Channel[];
  }) => {
    if (!context) return;

    setIsOptimizing(true);
    const result = findOptimalAllocation(totalBudget, context, constraints);
    setOptimization(result);
    setIsOptimizing(false);
  }, [totalBudget, context]);

  const applyOptimization = useCallback(() => {
    if (!optimization) return null;
    return optimization.optimal_allocation;
  }, [optimization]);

  return {
    optimization,
    isOptimizing,
    optimize,
    applyOptimization
  };
}

/**
 * Hook to predict scenario outcome
 */
export function useScenarioPrediction(context: InsightContext | null) {
  const predictOutcome = useCallback((channelSpends: Record<Channel, number>) => {
    if (!context) return null;

    return scenarioPlanning.predictOutcome(channelSpends, context);
  }, [context]);

  return { predictOutcome };
}

/**
 * Hook for scenario builder (step-by-step scenario creation)
 */
export function useScenarioBuilder(
  baseSimulationId: string,
  context: InsightContext | null
) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [channelSpends, setChannelSpends] = useState<Record<Channel, number>>({} as Record<Channel, number>);
  const [preview, setPreview] = useState<Scenario | null>(null);

  const updateChannelSpend = useCallback((channel: Channel, spend: number) => {
    setChannelSpends(prev => ({ ...prev, [channel]: spend }));
  }, []);

  const updateAllSpends = useCallback((spends: Record<Channel, number>) => {
    setChannelSpends(spends);
  }, []);

  const generatePreview = useCallback(() => {
    if (!context || !name) return;

    const scenario = scenarioPlanning.createScenario(
      name,
      description,
      baseSimulationId,
      channelSpends,
      context
    );

    setPreview(scenario);
  }, [name, description, baseSimulationId, channelSpends, context]);

  const saveScenario = useCallback(() => {
    if (!preview) return null;

    // Scenario is already created, just return it
    return preview;
  }, [preview]);

  const reset = useCallback(() => {
    setName('');
    setDescription('');
    setChannelSpends({} as Record<Channel, number>);
    setPreview(null);
  }, []);

  const totalSpend = useMemo(() => {
    return Object.values(channelSpends).reduce((sum, spend) => sum + spend, 0);
  }, [channelSpends]);

  return {
    name,
    setName,
    description,
    setDescription,
    channelSpends,
    updateChannelSpend,
    updateAllSpends,
    preview,
    generatePreview,
    saveScenario,
    reset,
    totalSpend
  };
}
