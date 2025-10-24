/**
 * React Hooks for Performance Monitoring
 * Track component render times, API calls, and user interactions
 */

import { useEffect, useRef, useCallback } from 'react';
import { performanceMonitor, measureAsync } from '@/lib/performance';

/**
 * Hook to track component render performance
 */
export function useRenderPerformance(componentName: string) {
  const renderCount = useRef(0);
  const mountTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current++;
    const renderTime = performance.now() - mountTime.current;
    
    performanceMonitor.trackRender(componentName, renderTime);
    
    // Reset for next render
    mountTime.current = performance.now();
  });

  return renderCount.current;
}

/**
 * Hook to track API call performance
 */
export function useAPIPerformance() {
  const trackCall = useCallback(async <T,>(
    endpoint: string,
    apiCall: () => Promise<T>
  ): Promise<T> => {
    return measureAsync(endpoint, apiCall);
  }, []);

  return { trackCall };
}

/**
 * Hook to track interaction performance
 */
export function useInteractionPerformance() {
  const trackInteraction = useCallback((
    interactionName: string,
    callback: () => void
  ) => {
    const start = performance.now();
    callback();
    const duration = performance.now() - start;
    performanceMonitor.trackInteraction(interactionName, duration);
  }, []);

  const trackAsyncInteraction = useCallback(async (
    interactionName: string,
    callback: () => Promise<void>
  ) => {
    const start = performance.now();
    await callback();
    const duration = performance.now() - start;
    performanceMonitor.trackInteraction(interactionName, duration);
  }, []);

  return {
    trackInteraction,
    trackAsyncInteraction
  };
}

/**
 * Hook to track component mount/unmount time
 */
export function useComponentLifecycle(componentName: string) {
  const mountTime = useRef<number>(0);

  useEffect(() => {
    mountTime.current = performance.now();

    return () => {
      const lifetime = performance.now() - mountTime.current;
      performanceMonitor.trackInteraction(`${componentName}_lifetime`, lifetime);
    };
  }, [componentName]);
}

/**
 * Hook to track lazy loading performance
 */
export function useLazyLoadPerformance(componentName: string) {
  const loadStart = useRef<number>(performance.now());
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!hasLoaded.current) {
      const loadTime = performance.now() - loadStart.current;
      performanceMonitor.trackRender(`${componentName}_lazy_load`, loadTime);
      hasLoaded.current = true;
    }
  }, [componentName]);
}

/**
 * Hook to get current performance metrics
 */
export function usePerformanceMetrics() {
  const getMetrics = useCallback(() => {
    return performanceMonitor.getSummary();
  }, []);

  const isGood = useCallback(() => {
    return performanceMonitor.isPerformanceGood();
  }, []);

  return {
    getMetrics,
    isGood
  };
}

/**
 * Hook to track form submission performance
 */
export function useFormPerformance(formName: string) {
  const startTime = useRef<number>(0);

  const startTracking = useCallback(() => {
    startTime.current = performance.now();
  }, []);

  const endTracking = useCallback((success: boolean) => {
    const duration = performance.now() - startTime.current;
    performanceMonitor.trackInteraction(
      `${formName}_submit_${success ? 'success' : 'error'}`,
      duration
    );
  }, [formName]);

  return {
    startTracking,
    endTracking
  };
}
