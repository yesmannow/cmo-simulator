/**
 * Analytics & Event Tracking System
 * Tracks user behavior and performance locally without persistent identity.
 */

import { UUID, Timestamp, Channel, Industry, DifficultyLevel } from '@/types';
import { logger } from './logger';

export enum EventCategory {
  USER = 'user',
  SIMULATION = 'simulation',
  DECISION = 'decision',
  PERFORMANCE = 'performance',
  ENGAGEMENT = 'engagement',
  ERROR = 'error',
  CONVERSION = 'conversion'
}

export enum EventAction {
  SIGNUP = 'signup',
  LOGIN = 'login',
  LOGOUT = 'logout',
  PROFILE_UPDATE = 'profile_update',
  SIMULATION_START = 'simulation_start',
  SIMULATION_PAUSE = 'simulation_pause',
  SIMULATION_RESUME = 'simulation_resume',
  SIMULATION_COMPLETE = 'simulation_complete',
  SIMULATION_ABANDON = 'simulation_abandon',
  CHANNEL_ALLOCATION = 'channel_allocation',
  BUDGET_ADJUSTMENT = 'budget_adjustment',
  CAMPAIGN_LAUNCH = 'campaign_launch',
  CRISIS_RESPONSE = 'crisis_response',
  QUARTER_COMPLETE = 'quarter_complete',
  ACHIEVEMENT_UNLOCK = 'achievement_unlock',
  MILESTONE_REACH = 'milestone_reach',
  PAGE_VIEW = 'page_view',
  BUTTON_CLICK = 'button_click',
  TOOLTIP_VIEW = 'tooltip_view',
  TUTORIAL_START = 'tutorial_start',
  TUTORIAL_COMPLETE = 'tutorial_complete',
  ERROR_OCCURRED = 'error_occurred',
  ERROR_RECOVERED = 'error_recovered',
  UPGRADE_INITIATED = 'upgrade_initiated',
  UPGRADE_COMPLETED = 'upgrade_completed',
  TRIAL_STARTED = 'trial_started'
}

export interface AnalyticsEvent {
  id: string;
  category: EventCategory;
  action: EventAction;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
  session_id?: string;
  timestamp: string;
  page_url?: string;
  referrer?: string;
  user_agent?: string;
  device_type?: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  os?: string;
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private sessionId: string;
  private enabled: boolean;
  private queue: AnalyticsEvent[] = [];

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.enabled = typeof window !== 'undefined';
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Track an event
   */
  track(
    category: EventCategory,
    action: EventAction,
    label?: string,
    value?: number,
    properties?: Record<string, any>
  ): void {
    if (!this.enabled) return;

    const event: AnalyticsEvent = {
      id: crypto.randomUUID(),
      category,
      action,
      label,
      value,
      properties,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      device_type: this.getDeviceType(),
      browser: this.getBrowser(),
      os: this.getOS()
    };

    // Log in development
    logger.debug('[Analytics] Event tracked', { event });

    // In a pure local build, we don't flush to a backend.
    // We can still push to third-party providers if they are initialized.
    this.sendToThirdParty([event]);
  }

  /**
   * Track page view
   */
  pageView(pageName: string, properties?: Record<string, any>): void {
    this.track(
      EventCategory.ENGAGEMENT,
      EventAction.PAGE_VIEW,
      pageName,
      undefined,
      properties
    );
  }

  /**
   * Track simulation start
   */
  simulationStart(config: {
    industry: Industry;
    difficulty: DifficultyLevel;
    timeHorizon: string;
    totalBudget: number;
  }): void {
    this.track(
      EventCategory.SIMULATION,
      EventAction.SIMULATION_START,
      config.industry,
      config.totalBudget,
      config
    );
  }

  /**
   * Track simulation completion
   */
  simulationComplete(results: {
    finalScore: number;
    totalRevenue: number;
    roi: number;
    duration: number;
  }): void {
    this.track(
      EventCategory.SIMULATION,
      EventAction.SIMULATION_COMPLETE,
      undefined,
      results.finalScore,
      results
    );
  }

  /**
   * Track decision made
   */
  decisionMade(decision: {
    type: string;
    channelSpends?: Record<string, number>;
    totalSpend?: number;
  }): void {
    this.track(
      EventCategory.DECISION,
      EventAction.CHANNEL_ALLOCATION,
      decision.type,
      decision.totalSpend,
      decision
    );
  }

  /**
   * Track achievement unlock
   */
  achievementUnlock(achievement: {
    id: string;
    name: string;
    rarity: string;
    points: number;
  }): void {
    this.track(
      EventCategory.PERFORMANCE,
      EventAction.ACHIEVEMENT_UNLOCK,
      achievement.name,
      achievement.points,
      achievement
    );
  }

  /**
   * Track error
   */
  trackError(error: {
    code: string;
    message: string;
    stack?: string;
    context?: Record<string, any>;
  }): void {
    this.track(
      EventCategory.ERROR,
      EventAction.ERROR_OCCURRED,
      error.code,
      undefined,
      error
    );
  }

  /**
   * Track conversion event
   */
  trackConversion(event: {
    type: 'upgrade' | 'trial' | 'purchase';
    value: number;
    plan?: string;
  }): void {
    this.track(
      EventCategory.CONVERSION,
      event.type === 'upgrade' ? EventAction.UPGRADE_COMPLETED : EventAction.TRIAL_STARTED,
      event.plan,
      event.value,
      event
    );
  }

  private sendToThirdParty(events: AnalyticsEvent[]): void {
    // Shims for third-party trackers remain available but disabled
    if (typeof window === 'undefined') return;
    
    // Example: (window as any).gtag?.('event', ...)
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Other';
  }

  private getOS(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Win')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Other';
  }

  destroy(): void {
    this.queue = [];
  }
}

export const analytics = AnalyticsService.getInstance();

export const trackEvent = (
  category: EventCategory,
  action: EventAction,
  label?: string,
  value?: number,
  properties?: Record<string, any>
) => analytics.track(category, action, label, value, properties);

export const trackPageView = (pageName: string, properties?: Record<string, any>) =>
  analytics.pageView(pageName, properties);
