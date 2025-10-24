/**
 * React Hooks for A/B Testing
 * Easy integration of experiments in React components
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { abTesting, Variant, getVariant, trackExperimentConversion } from '@/lib/abTesting';
import { UUID } from '@/types';

/**
 * Hook to get variant for an experiment
 */
export function useExperiment(experimentId: string, userId?: UUID) {
  const [variant, setVariant] = useState<Variant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const assignedVariant = getVariant(experimentId, userId);
    setVariant(assignedVariant);
    setIsLoading(false);
  }, [experimentId, userId]);

  const trackConversion = useCallback((metric: string, value?: number) => {
    trackExperimentConversion(experimentId, metric, value);
  }, [experimentId]);

  const isVariant = useCallback((variantId: string) => {
    return variant?.id === variantId;
  }, [variant]);

  const getConfig = useCallback(<T = any>(key: string, defaultValue?: T): T => {
    return variant?.config[key] ?? defaultValue;
  }, [variant]);

  return {
    variant,
    isLoading,
    isVariant,
    trackConversion,
    getConfig
  };
}

/**
 * Hook for feature flags (simple on/off experiments)
 */
export function useFeatureFlag(flagName: string, userId?: UUID): boolean {
  const { variant, isLoading } = useExperiment(flagName, userId);
  
  if (isLoading) {
    return false; // Default to off while loading
  }

  return variant?.id === 'enabled';
}

/**
 * Hook to track experiment conversion on mount
 */
export function useExperimentConversion(
  experimentId: string,
  metric: string,
  value?: number
) {
  useEffect(() => {
    trackExperimentConversion(experimentId, metric, value);
  }, [experimentId, metric, value]);
}

/**
 * Hook to conditionally render based on variant
 */
export function useVariantComponent<T extends Record<string, React.ComponentType<any>>>(
  experimentId: string,
  components: T,
  userId?: UUID
): React.ComponentType<any> | null {
  const { variant, isLoading } = useExperiment(experimentId, userId);

  if (isLoading || !variant) {
    return components.control || null;
  }

  return components[variant.id] || components.control || null;
}

/**
 * Hook to get variant config with type safety
 */
export function useVariantConfig<T extends Record<string, any>>(
  experimentId: string,
  defaultConfig: T,
  userId?: UUID
): T {
  const { variant } = useExperiment(experimentId, userId);

  return useMemo(() => {
    if (!variant) return defaultConfig;
    return { ...defaultConfig, ...variant.config };
  }, [variant, defaultConfig]);
}

/**
 * Hook for multivariate testing (multiple experiments)
 */
export function useMultipleExperiments(
  experimentIds: string[],
  userId?: UUID
): Record<string, Variant | null> {
  const [variants, setVariants] = useState<Record<string, Variant | null>>({});

  useEffect(() => {
    const newVariants: Record<string, Variant | null> = {};
    experimentIds.forEach(id => {
      newVariants[id] = getVariant(id, userId);
    });
    setVariants(newVariants);
  }, [experimentIds, userId]);

  return variants;
}

/**
 * Hook to track experiment goal completion
 */
export function useExperimentGoal(experimentId: string) {
  const trackGoal = useCallback((goalName: string, value?: number) => {
    trackExperimentConversion(experimentId, `goal_${goalName}`, value);
  }, [experimentId]);

  return { trackGoal };
}
