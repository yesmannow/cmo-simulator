/**
 * React Hooks for Analytics
 * Easy-to-use hooks for tracking events in React components
 */

import { useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { analytics, EventCategory, EventAction } from '@/lib/analytics';
import { Channel, Industry, DifficultyLevel } from '@/types';

/**
 * Hook to track page views automatically
 */
export function usePageTracking() {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    // Don't track on initial mount
    if (previousPathname.current === null) {
      previousPathname.current = pathname;
      return;
    }

    // Track page view when pathname changes
    if (pathname !== previousPathname.current) {
      analytics.pageView(pathname, {
        previous_page: previousPathname.current
      });
      previousPathname.current = pathname;
    }
  }, [pathname]);
}

/**
 * Hook to track simulation events
 */
export function useSimulationTracking() {
  const trackStart = useCallback((config: {
    industry: Industry;
    difficulty: DifficultyLevel;
    timeHorizon: string;
    totalBudget: number;
  }) => {
    analytics.simulationStart(config);
  }, []);

  const trackComplete = useCallback((results: {
    finalScore: number;
    totalRevenue: number;
    roi: number;
    duration: number;
  }) => {
    analytics.simulationComplete(results);
  }, []);

  const trackPause = useCallback(() => {
    analytics.track(
      EventCategory.SIMULATION,
      EventAction.SIMULATION_PAUSE
    );
  }, []);

  const trackResume = useCallback(() => {
    analytics.track(
      EventCategory.SIMULATION,
      EventAction.SIMULATION_RESUME
    );
  }, []);

  const trackAbandon = useCallback((reason?: string) => {
    analytics.track(
      EventCategory.SIMULATION,
      EventAction.SIMULATION_ABANDON,
      reason
    );
  }, []);

  return {
    trackStart,
    trackComplete,
    trackPause,
    trackResume,
    trackAbandon
  };
}

/**
 * Hook to track decision events
 */
export function useDecisionTracking() {
  const trackDecision = useCallback((decision: {
    type: string;
    channelSpends?: Record<Channel, number>;
    totalSpend?: number;
    expectedImpact?: any;
  }) => {
    analytics.decisionMade(decision);
  }, []);

  const trackChannelAllocation = useCallback((
    channelSpends: Record<Channel, number>,
    totalBudget: number
  ) => {
    analytics.track(
      EventCategory.DECISION,
      EventAction.CHANNEL_ALLOCATION,
      undefined,
      totalBudget,
      { channelSpends }
    );
  }, []);

  const trackBudgetAdjustment = useCallback((
    oldBudget: number,
    newBudget: number,
    reason?: string
  ) => {
    analytics.track(
      EventCategory.DECISION,
      EventAction.BUDGET_ADJUSTMENT,
      reason,
      newBudget,
      { oldBudget, newBudget, change: newBudget - oldBudget }
    );
  }, []);

  return {
    trackDecision,
    trackChannelAllocation,
    trackBudgetAdjustment
  };
}

/**
 * Hook to track achievement unlocks
 */
export function useAchievementTracking() {
  const trackUnlock = useCallback((achievement: {
    id: string;
    name: string;
    rarity: string;
    points: number;
  }) => {
    analytics.achievementUnlock(achievement);
  }, []);

  return { trackUnlock };
}

/**
 * Hook to track user interactions
 */
export function useInteractionTracking() {
  const trackClick = useCallback((
    elementName: string,
    properties?: Record<string, any>
  ) => {
    analytics.track(
      EventCategory.ENGAGEMENT,
      EventAction.BUTTON_CLICK,
      elementName,
      undefined,
      properties
    );
  }, []);

  const trackTooltipView = useCallback((tooltipName: string) => {
    analytics.track(
      EventCategory.ENGAGEMENT,
      EventAction.TOOLTIP_VIEW,
      tooltipName
    );
  }, []);

  const trackTutorialStart = useCallback(() => {
    analytics.track(
      EventCategory.ENGAGEMENT,
      EventAction.TUTORIAL_START
    );
  }, []);

  const trackTutorialComplete = useCallback((duration: number) => {
    analytics.track(
      EventCategory.ENGAGEMENT,
      EventAction.TUTORIAL_COMPLETE,
      undefined,
      duration
    );
  }, []);

  return {
    trackClick,
    trackTooltipView,
    trackTutorialStart,
    trackTutorialComplete
  };
}

/**
 * Hook to track errors
 */
export function useErrorTracking() {
  const trackError = useCallback((error: {
    code: string;
    message: string;
    stack?: string;
    context?: Record<string, any>;
  }) => {
    analytics.trackError(error);
  }, []);

  const trackRecovery = useCallback((errorCode: string) => {
    analytics.track(
      EventCategory.ERROR,
      EventAction.ERROR_RECOVERED,
      errorCode
    );
  }, []);

  return {
    trackError,
    trackRecovery
  };
}

/**
 * Hook to track conversion events
 */
export function useConversionTracking() {
  const trackUpgradeInitiated = useCallback((plan: string) => {
    analytics.track(
      EventCategory.CONVERSION,
      EventAction.UPGRADE_INITIATED,
      plan
    );
  }, []);

  const trackUpgradeCompleted = useCallback((plan: string, value: number) => {
    analytics.trackConversion({
      type: 'upgrade',
      value,
      plan
    });
  }, []);

  const trackTrialStarted = useCallback((plan: string) => {
    analytics.trackConversion({
      type: 'trial',
      value: 0,
      plan
    });
  }, []);

  return {
    trackUpgradeInitiated,
    trackUpgradeCompleted,
    trackTrialStarted
  };
}

/**
 * Hook to track time spent on page
 */
export function useTimeTracking(pageName: string) {
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    startTime.current = Date.now();

    return () => {
      const duration = Date.now() - startTime.current;
      analytics.track(
        EventCategory.ENGAGEMENT,
        EventAction.PAGE_VIEW,
        `${pageName}_duration`,
        duration
      );
    };
  }, [pageName]);
}

/**
 * Hook to track element visibility (for lazy loading analytics)
 */
export function useVisibilityTracking(
  elementName: string,
  threshold: number = 0.5
) {
  const elementRef = useRef<HTMLElement | null>(null);
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!elementRef.current || hasTracked.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTracked.current) {
            analytics.track(
              EventCategory.ENGAGEMENT,
              EventAction.PAGE_VIEW,
              `${elementName}_visible`
            );
            hasTracked.current = true;
          }
        });
      },
      { threshold }
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [elementName, threshold]);

  return elementRef;
}

/**
 * Hook to track form interactions
 */
export function useFormTracking(formName: string) {
  const trackFieldFocus = useCallback((fieldName: string) => {
    analytics.track(
      EventCategory.ENGAGEMENT,
      EventAction.BUTTON_CLICK,
      `${formName}_${fieldName}_focus`
    );
  }, [formName]);

  const trackFieldBlur = useCallback((fieldName: string, hasValue: boolean) => {
    analytics.track(
      EventCategory.ENGAGEMENT,
      EventAction.BUTTON_CLICK,
      `${formName}_${fieldName}_blur`,
      hasValue ? 1 : 0
    );
  }, [formName]);

  const trackSubmit = useCallback((success: boolean, errors?: string[]) => {
    analytics.track(
      EventCategory.ENGAGEMENT,
      EventAction.BUTTON_CLICK,
      `${formName}_submit`,
      success ? 1 : 0,
      { errors }
    );
  }, [formName]);

  return {
    trackFieldFocus,
    trackFieldBlur,
    trackSubmit
  };
}
