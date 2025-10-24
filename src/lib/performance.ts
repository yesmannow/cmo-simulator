/**
 * Performance Monitoring System
 * Tracks app performance, load times, and user experience metrics
 */

import { analytics, EventCategory, EventAction } from './analytics';

// ============================================================================
// PERFORMANCE METRICS
// ============================================================================

export interface PerformanceMetrics {
  // Core Web Vitals
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  
  // Custom Metrics
  pageLoadTime?: number;
  apiResponseTime?: number;
  renderTime?: number;
  interactionTime?: number;
  
  // Resource Metrics
  jsSize?: number;
  cssSize?: number;
  imageSize?: number;
  totalSize?: number;
  
  // Navigation Timing
  domContentLoaded?: number;
  domInteractive?: number;
  domComplete?: number;
}

export interface PerformanceEntry {
  metric: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  page: string;
}

// ============================================================================
// PERFORMANCE THRESHOLDS (Core Web Vitals)
// ============================================================================

const THRESHOLDS = {
  fcp: { good: 1800, poor: 3000 },
  lcp: { good: 2500, poor: 4000 },
  fid: { good: 100, poor: 300 },
  cls: { good: 0.1, poor: 0.25 },
  ttfb: { good: 800, poor: 1800 }
};

// ============================================================================
// PERFORMANCE MONITOR
// ============================================================================

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceEntry> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
      this.trackNavigationTiming();
    }
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Initialize performance observers
   */
  private initializeObservers(): void {
    // Largest Contentful Paint (LCP)
    this.observeMetric('largest-contentful-paint', (entry: any) => {
      this.recordMetric('lcp', entry.renderTime || entry.loadTime);
    });

    // First Input Delay (FID)
    this.observeMetric('first-input', (entry: any) => {
      this.recordMetric('fid', entry.processingStart - entry.startTime);
    });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    this.observeMetric('layout-shift', (entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        this.recordMetric('cls', clsValue);
      }
    });

    // Navigation Timing
    this.observeMetric('navigation', (entry: any) => {
      this.recordMetric('ttfb', entry.responseStart - entry.requestStart);
      this.recordMetric('domContentLoaded', entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart);
      this.recordMetric('domInteractive', entry.domInteractive - entry.fetchStart);
      this.recordMetric('domComplete', entry.domComplete - entry.fetchStart);
    });

    // Resource Timing
    this.observeMetric('resource', (entry: any) => {
      this.trackResourceSize(entry);
    });

    // Paint Timing
    this.observeMetric('paint', (entry: any) => {
      if (entry.name === 'first-contentful-paint') {
        this.recordMetric('fcp', entry.startTime);
      }
    });
  }

  /**
   * Observe a specific performance metric
   */
  private observeMetric(type: string, callback: (entry: any) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          callback(entry);
        }
      });

      observer.observe({ type, buffered: true });
      this.observers.set(type, observer);
    } catch (error) {
      console.warn(`Failed to observe ${type}:`, error);
    }
  }

  /**
   * Record a performance metric
   */
  private recordMetric(metric: string, value: number): void {
    const rating = this.getRating(metric, value);
    const entry: PerformanceEntry = {
      metric,
      value,
      rating,
      timestamp: Date.now(),
      page: typeof window !== 'undefined' ? window.location.pathname : ''
    };

    this.metrics.set(metric, entry);

    // Send to analytics
    analytics.track(
      EventCategory.PERFORMANCE,
      EventAction.PAGE_VIEW,
      `performance_${metric}`,
      value,
      { rating, page: entry.page }
    );

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${metric}:`, value, rating);
    }
  }

  /**
   * Get rating for a metric
   */
  private getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = THRESHOLDS[metric as keyof typeof THRESHOLDS];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Track navigation timing
   */
  private trackNavigationTiming(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        this.recordMetric('pageLoadTime', pageLoadTime);
      }, 0);
    });
  }

  /**
   * Track resource sizes
   */
  private trackResourceSize(entry: any): void {
    const size = entry.transferSize || 0;
    const type = this.getResourceType(entry.name);

    if (type === 'script') {
      const current = this.metrics.get('jsSize')?.value || 0;
      this.recordMetric('jsSize', current + size);
    } else if (type === 'stylesheet') {
      const current = this.metrics.get('cssSize')?.value || 0;
      this.recordMetric('cssSize', current + size);
    } else if (type === 'image') {
      const current = this.metrics.get('imageSize')?.value || 0;
      this.recordMetric('imageSize', current + size);
    }

    const totalSize = this.metrics.get('totalSize')?.value || 0;
    this.recordMetric('totalSize', totalSize + size);
  }

  /**
   * Get resource type from URL
   */
  private getResourceType(url: string): string {
    if (url.endsWith('.js')) return 'script';
    if (url.endsWith('.css')) return 'stylesheet';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
    return 'other';
  }

  /**
   * Track API response time
   */
  trackAPICall(endpoint: string, duration: number): void {
    this.recordMetric(`api_${endpoint}`, duration);
  }

  /**
   * Track component render time
   */
  trackRender(componentName: string, duration: number): void {
    this.recordMetric(`render_${componentName}`, duration);
  }

  /**
   * Track user interaction time
   */
  trackInteraction(interactionName: string, duration: number): void {
    this.recordMetric(`interaction_${interactionName}`, duration);
  }

  /**
   * Get all metrics
   */
  getMetrics(): Map<string, PerformanceEntry> {
    return new Map(this.metrics);
  }

  /**
   * Get specific metric
   */
  getMetric(metric: string): PerformanceEntry | undefined {
    return this.metrics.get(metric);
  }

  /**
   * Get performance summary
   */
  getSummary(): PerformanceMetrics {
    return {
      fcp: this.metrics.get('fcp')?.value,
      lcp: this.metrics.get('lcp')?.value,
      fid: this.metrics.get('fid')?.value,
      cls: this.metrics.get('cls')?.value,
      ttfb: this.metrics.get('ttfb')?.value,
      pageLoadTime: this.metrics.get('pageLoadTime')?.value,
      jsSize: this.metrics.get('jsSize')?.value,
      cssSize: this.metrics.get('cssSize')?.value,
      imageSize: this.metrics.get('imageSize')?.value,
      totalSize: this.metrics.get('totalSize')?.value,
      domContentLoaded: this.metrics.get('domContentLoaded')?.value,
      domInteractive: this.metrics.get('domInteractive')?.value,
      domComplete: this.metrics.get('domComplete')?.value
    };
  }

  /**
   * Check if performance is good
   */
  isPerformanceGood(): boolean {
    const coreMetrics = ['lcp', 'fid', 'cls'];
    return coreMetrics.every(metric => {
      const entry = this.metrics.get(metric);
      return !entry || entry.rating === 'good';
    });
  }

  /**
   * Cleanup observers
   */
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.metrics.clear();
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Get performance monitor instance
 */
export const performanceMonitor = PerformanceMonitor.getInstance();

/**
 * Track API call performance
 */
export const trackAPIPerformance = (endpoint: string, duration: number) =>
  performanceMonitor.trackAPICall(endpoint, duration);

/**
 * Track component render performance
 */
export const trackRenderPerformance = (componentName: string, duration: number) =>
  performanceMonitor.trackRender(componentName, duration);

/**
 * Measure async function performance
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    performanceMonitor.trackInteraction(name, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    performanceMonitor.trackInteraction(`${name}_error`, duration);
    throw error;
  }
}

/**
 * Measure sync function performance
 */
export function measureSync<T>(name: string, fn: () => T): T {
  const start = performance.now();
  try {
    const result = fn();
    const duration = performance.now() - start;
    performanceMonitor.trackInteraction(name, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    performanceMonitor.trackInteraction(`${name}_error`, duration);
    throw error;
  }
}
