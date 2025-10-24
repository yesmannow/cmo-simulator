/**
 * A/B Testing Framework
 * Run experiments to optimize user experience
 */

import { UUID } from '@/types';
import { analytics, EventCategory, EventAction } from './analytics';

// ============================================================================
// EXPERIMENT TYPES
// ============================================================================

export interface Experiment {
  id: string;
  name: string;
  description: string;
  variants: Variant[];
  status: 'draft' | 'running' | 'paused' | 'completed';
  traffic_allocation: number; // 0-100, percentage of users in experiment
  start_date?: string;
  end_date?: string;
  winner?: string; // variant id
  created_at: string;
}

export interface Variant {
  id: string;
  name: string;
  description?: string;
  allocation: number; // 0-100, percentage of experiment traffic
  config: Record<string, any>; // Variant-specific configuration
}

export interface ExperimentAssignment {
  experiment_id: string;
  variant_id: string;
  user_id?: UUID;
  session_id: string;
  assigned_at: string;
}

export interface ExperimentResult {
  experiment_id: string;
  variant_id: string;
  metric: string;
  value: number;
  count: number;
  timestamp: string;
}

// ============================================================================
// A/B TESTING SERVICE
// ============================================================================

export class ABTestingService {
  private static instance: ABTestingService;
  private experiments: Map<string, Experiment> = new Map();
  private assignments: Map<string, ExperimentAssignment> = new Map();
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.loadExperiments();
  }

  static getInstance(): ABTestingService {
    if (!ABTestingService.instance) {
      ABTestingService.instance = new ABTestingService();
    }
    return ABTestingService.instance;
  }

  /**
   * Load experiments from backend or config
   */
  private loadExperiments(): void {
    // In production, load from backend
    // For now, use predefined experiments
    const defaultExperiments: Experiment[] = [
      {
        id: 'onboarding_flow',
        name: 'Onboarding Flow Optimization',
        description: 'Test different onboarding flows',
        variants: [
          {
            id: 'control',
            name: 'Current Flow',
            allocation: 50,
            config: { steps: 4, showTutorial: true }
          },
          {
            id: 'simplified',
            name: 'Simplified Flow',
            allocation: 50,
            config: { steps: 2, showTutorial: false }
          }
        ],
        status: 'running',
        traffic_allocation: 100,
        created_at: new Date().toISOString()
      },
      {
        id: 'dashboard_layout',
        name: 'Dashboard Layout',
        description: 'Test different dashboard layouts',
        variants: [
          {
            id: 'control',
            name: 'Grid Layout',
            allocation: 50,
            config: { layout: 'grid', columns: 3 }
          },
          {
            id: 'list',
            name: 'List Layout',
            allocation: 50,
            config: { layout: 'list', columns: 1 }
          }
        ],
        status: 'running',
        traffic_allocation: 50,
        created_at: new Date().toISOString()
      },
      {
        id: 'cta_button_color',
        name: 'CTA Button Color',
        description: 'Test button colors for conversion',
        variants: [
          {
            id: 'control',
            name: 'Blue Button',
            allocation: 33,
            config: { color: 'blue' }
          },
          {
            id: 'green',
            name: 'Green Button',
            allocation: 33,
            config: { color: 'green' }
          },
          {
            id: 'orange',
            name: 'Orange Button',
            allocation: 34,
            config: { color: 'orange' }
          }
        ],
        status: 'running',
        traffic_allocation: 100,
        created_at: new Date().toISOString()
      }
    ];

    defaultExperiments.forEach(exp => {
      this.experiments.set(exp.id, exp);
    });
  }

  /**
   * Get variant for an experiment
   */
  getVariant(experimentId: string, userId?: UUID): Variant | null {
    const experiment = this.experiments.get(experimentId);
    
    if (!experiment || experiment.status !== 'running') {
      return null;
    }

    // Check if user should be in experiment
    if (!this.shouldIncludeInExperiment(experiment)) {
      return null;
    }

    // Check existing assignment
    const assignmentKey = `${experimentId}_${userId || this.sessionId}`;
    const existingAssignment = this.assignments.get(assignmentKey);
    
    if (existingAssignment) {
      const variant = experiment.variants.find(v => v.id === existingAssignment.variant_id);
      return variant || null;
    }

    // Assign new variant
    const variant = this.assignVariant(experiment, userId);
    
    if (variant) {
      const assignment: ExperimentAssignment = {
        experiment_id: experimentId,
        variant_id: variant.id,
        user_id: userId,
        session_id: this.sessionId,
        assigned_at: new Date().toISOString()
      };
      
      this.assignments.set(assignmentKey, assignment);
      
      // Track assignment
      analytics.track(
        EventCategory.ENGAGEMENT,
        EventAction.PAGE_VIEW,
        `experiment_${experimentId}_assigned`,
        undefined,
        {
          experiment_id: experimentId,
          variant_id: variant.id,
          variant_name: variant.name
        }
      );
    }

    return variant;
  }

  /**
   * Check if user should be included in experiment
   */
  private shouldIncludeInExperiment(experiment: Experiment): boolean {
    // Random allocation based on traffic percentage
    const random = Math.random() * 100;
    return random < experiment.traffic_allocation;
  }

  /**
   * Assign variant based on allocation percentages
   */
  private assignVariant(experiment: Experiment, userId?: UUID): Variant | null {
    const seed = userId || this.sessionId;
    const hash = this.hashString(seed + experiment.id);
    const random = (hash % 100) / 100; // 0-1
    
    let cumulative = 0;
    for (const variant of experiment.variants) {
      cumulative += variant.allocation / 100;
      if (random < cumulative) {
        return variant;
      }
    }

    return experiment.variants[0]; // Fallback to first variant
  }

  /**
   * Simple hash function for consistent assignment
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Track experiment conversion
   */
  trackConversion(
    experimentId: string,
    metric: string,
    value: number = 1
  ): void {
    const assignment = Array.from(this.assignments.values()).find(
      a => a.experiment_id === experimentId
    );

    if (!assignment) return;

    analytics.track(
      EventCategory.CONVERSION,
      EventAction.UPGRADE_COMPLETED,
      `experiment_${experimentId}_${metric}`,
      value,
      {
        experiment_id: experimentId,
        variant_id: assignment.variant_id,
        metric
      }
    );
  }

  /**
   * Get all active experiments
   */
  getActiveExperiments(): Experiment[] {
    return Array.from(this.experiments.values()).filter(
      exp => exp.status === 'running'
    );
  }

  /**
   * Get experiment by ID
   */
  getExperiment(experimentId: string): Experiment | undefined {
    return this.experiments.get(experimentId);
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Get A/B testing instance
 */
export const abTesting = ABTestingService.getInstance();

/**
 * Get variant for experiment (shorthand)
 */
export const getVariant = (experimentId: string, userId?: UUID) =>
  abTesting.getVariant(experimentId, userId);

/**
 * Track experiment conversion (shorthand)
 */
export const trackExperimentConversion = (
  experimentId: string,
  metric: string,
  value?: number
) => abTesting.trackConversion(experimentId, metric, value);

/**
 * Check if user is in variant
 */
export const isInVariant = (
  experimentId: string,
  variantId: string,
  userId?: UUID
): boolean => {
  const variant = getVariant(experimentId, userId);
  return variant?.id === variantId;
};
