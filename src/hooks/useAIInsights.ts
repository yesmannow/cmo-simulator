/**
 * React Hooks for AI Insights
 * Easy integration of AI recommendations in React components
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  aiInsights, 
  InsightContext, 
  OptimizationSuggestion 
} from '@/lib/aiInsights';
import { AIRecommendation, MarketInsight, Channel } from '@/types';

/**
 * Hook to get AI recommendations
 */
export function useAIRecommendations(context: InsightContext | null) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    if (!context) return;

    setIsLoading(true);
    setError(null);

    try {
      const recs = await aiInsights.generateRecommendations(context);
      setRecommendations(recs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate recommendations');
    } finally {
      setIsLoading(false);
    }
  }, [context]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const dismissRecommendation = useCallback((id: string) => {
    setRecommendations(prev => 
      prev.map(rec => rec.id === id ? { ...rec, dismissed: true } : rec)
    );
  }, []);

  const activeRecommendations = recommendations.filter(rec => !rec.dismissed);

  return {
    recommendations: activeRecommendations,
    allRecommendations: recommendations,
    isLoading,
    error,
    refresh: fetchRecommendations,
    dismissRecommendation
  };
}

/**
 * Hook to analyze channel performance
 */
export function useChannelOptimization(context: InsightContext | null) {
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!context) return;

    setIsLoading(true);
    aiInsights.analyzeChannelPerformance(context)
      .then(setSuggestions)
      .finally(() => setIsLoading(false));
  }, [context]);

  return {
    suggestions,
    isLoading
  };
}

/**
 * Hook to predict impact of changes
 */
export function useImpactPrediction(context: InsightContext | null) {
  const [isCalculating, setIsCalculating] = useState(false);

  const predictImpact = useCallback(async (
    proposedChanges: Record<Channel, number>
  ) => {
    if (!context) return null;

    setIsCalculating(true);
    try {
      const impact = await aiInsights.predictImpact(context, proposedChanges);
      return impact;
    } finally {
      setIsCalculating(false);
    }
  }, [context]);

  return {
    predictImpact,
    isCalculating
  };
}

/**
 * Hook to get market insights
 */
export function useMarketInsights(context: InsightContext | null) {
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!context) return;

    setIsLoading(true);
    aiInsights.generateMarketInsights(context)
      .then(setInsights)
      .finally(() => setIsLoading(false));
  }, [context]);

  return {
    insights,
    isLoading
  };
}

/**
 * Hook to explain metrics in natural language
 */
export function useMetricExplanation() {
  const [isExplaining, setIsExplaining] = useState(false);

  const explainMetric = useCallback(async (
    metricName: string,
    value: number,
    context: InsightContext
  ): Promise<string> => {
    setIsExplaining(true);
    try {
      return await aiInsights.explainMetric(metricName, value, context);
    } finally {
      setIsExplaining(false);
    }
  }, []);

  return {
    explainMetric,
    isExplaining
  };
}

/**
 * Hook to get prioritized recommendations
 */
export function usePrioritizedRecommendations(context: InsightContext | null) {
  const { recommendations, isLoading, error, dismissRecommendation } = useAIRecommendations(context);

  const prioritized = recommendations.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const critical = prioritized.filter(r => r.priority === 'critical');
  const high = prioritized.filter(r => r.priority === 'high');
  const medium = prioritized.filter(r => r.priority === 'medium');
  const low = prioritized.filter(r => r.priority === 'low');

  return {
    all: prioritized,
    critical,
    high,
    medium,
    low,
    isLoading,
    error,
    dismissRecommendation
  };
}

/**
 * Hook to track recommendation actions
 */
export function useRecommendationTracking() {
  const trackView = useCallback((recommendationId: string) => {
    // Track that user viewed this recommendation
    console.log('[AI Insights] Viewed recommendation:', recommendationId);
  }, []);

  const trackAction = useCallback((recommendationId: string, action: 'accepted' | 'dismissed' | 'modified') => {
    // Track user action on recommendation
    console.log('[AI Insights] Action on recommendation:', recommendationId, action);
  }, []);

  return {
    trackView,
    trackAction
  };
}
