/**
 * Analytics & Event Tracking System
 * Tracks user behavior, performance, and business metrics
 */

import { UUID, Timestamp, Channel, Industry, DifficultyLevel } from '@/types';

// ============================================================================
// EVENT TYPES
// ============================================================================

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
  // User Events
  SIGNUP = 'signup',
  LOGIN = 'login',
  LOGOUT = 'logout',
  PROFILE_UPDATE = 'profile_update',
  
  // Simulation Events
  SIMULATION_START = 'simulation_start',
  SIMULATION_PAUSE = 'simulation_pause',
  SIMULATION_RESUME = 'simulation_resume',
  SIMULATION_COMPLETE = 'simulation_complete',
  SIMULATION_ABANDON = 'simulation_abandon',
  
  // Decision Events
  CHANNEL_ALLOCATION = 'channel_allocation',
  BUDGET_ADJUSTMENT = 'budget_adjustment',
  CAMPAIGN_LAUNCH = 'campaign_launch',
  CRISIS_RESPONSE = 'crisis_response',
  
  // Performance Events
  QUARTER_COMPLETE = 'quarter_complete',
  ACHIEVEMENT_UNLOCK = 'achievement_unlock',
  MILESTONE_REACH = 'milestone_reach',
  
  // Engagement Events
  PAGE_VIEW = 'page_view',
  BUTTON_CLICK = 'button_click',
  TOOLTIP_VIEW = 'tooltip_view',
  TUTORIAL_START = 'tutorial_start',
  TUTORIAL_COMPLETE = 'tutorial_complete',
  
  // Error Events
  ERROR_OCCURRED = 'error_occurred',
  ERROR_RECOVERED = 'error_recovered',
  
  // Conversion Events
  UPGRADE_INITIATED = 'upgrade_initiated',
  UPGRADE_COMPLETED = 'upgrade_completed',
  TRIAL_STARTED = 'trial_started'
}

export interface AnalyticsEvent {
  id: UUID;
  category: EventCategory;
  action: EventAction;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
  user_id?: UUID;
  session_id?: string;
  timestamp: Timestamp;
  page_url?: string;
  referrer?: string;
  user_agent?: string;
  device_type?: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  os?: string;
}

// ============================================================================
// ANALYTICS SERVICE
// ============================================================================

export class AnalyticsService {
  private static instance: AnalyticsService;
  private sessionId: string;
  private userId?: UUID;
  private enabled: boolean;
  private queue: AnalyticsEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.enabled = typeof window !== 'undefined' && process.env.NODE_ENV === 'production';
    
    if (this.enabled) {
      this.startAutoFlush();
    }
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Set the current user ID
   */
  setUserId(userId: UUID | undefined) {
    this.userId = userId;
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
    const event: AnalyticsEvent = {
      id: crypto.randomUUID(),
      category,
      action,
      label,
      value,
      properties,
      user_id: this.userId,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      page_url: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof window !== 'undefined' ? document.referrer : undefined,
      user_agent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
      device_type: this.getDeviceType(),
      browser: this.getBrowser(),
      os: this.getOS()
    };

    // Add to queue
    this.queue.push(event);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event);
    }

    // Flush if queue is large
    if (this.queue.length >= 10) {
      this.flush();
    }
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
    channelSpends?: Record<Channel, number>;
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

  /**
   * Flush events to backend
   */
  private async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      // Send to backend
      if (this.enabled) {
        await fetch('/api/analytics/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ events })
        });
      }

      // Also send to third-party analytics (PostHog, Mixpanel, etc.)
      this.sendToThirdParty(events);
    } catch (error) {
      console.error('[Analytics] Failed to flush events:', error);
      // Re-add events to queue
      this.queue.unshift(...events);
    }
  }

  /**
   * Send events to third-party analytics services
   */
  private sendToThirdParty(events: AnalyticsEvent[]): void {
    // PostHog
    if (typeof window !== 'undefined' && (window as any).posthog) {
      events.forEach(event => {
        (window as any).posthog.capture(event.action, {
          category: event.category,
          label: event.label,
          value: event.value,
          ...event.properties
        });
      });
    }

    // Mixpanel
    if (typeof window !== 'undefined' && (window as any).mixpanel) {
      events.forEach(event => {
        (window as any).mixpanel.track(event.action, {
          category: event.category,
          label: event.label,
          value: event.value,
          ...event.properties
        });
      });
    }

    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      events.forEach(event => {
        (window as any).gtag('event', event.action, {
          event_category: event.category,
          event_label: event.label,
          value: event.value,
          ...event.properties
        });
      });
    }
  }

  /**
   * Start auto-flush timer
   */
  private startAutoFlush(): void {
    this.flushInterval = setInterval(() => {
      this.flush();
    }, 30000); // Flush every 30 seconds
  }

  /**
   * Stop auto-flush timer
   */
  private stopAutoFlush(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get device type
   */
  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' | undefined {
    if (typeof window === 'undefined') return undefined;
    
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  /**
   * Get browser name
   */
  private getBrowser(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Other';
  }

  /**
   * Get OS name
   */
  private getOS(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    
    const ua = navigator.userAgent;
    if (ua.includes('Win')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Other';
  }

  /**
   * Cleanup on unmount
   */
  destroy(): void {
    this.stopAutoFlush();
    this.flush(); // Final flush
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Get analytics instance
 */
export const analytics = AnalyticsService.getInstance();

/**
 * Track event (shorthand)
 */
export const trackEvent = (
  category: EventCategory,
  action: EventAction,
  label?: string,
  value?: number,
  properties?: Record<string, any>
) => analytics.track(category, action, label, value, properties);

/**
 * Track page view (shorthand)
 */
export const trackPageView = (pageName: string, properties?: Record<string, any>) =>
  analytics.pageView(pageName, properties);
