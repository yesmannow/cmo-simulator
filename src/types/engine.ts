import type { DifficultyLevel, Industry } from "./index";

export type Channel = 'tv' | 'radio' | 'print' | 'digital' | 'social' | 'seo' | 'events' | 'pr';

/** Optional tick overlay — keeps `PlayerInput` stable for saves and tooling. */
export interface EngineTickContext {
  difficulty: DifficultyLevel;
  targetAudience?: string;
  quarterTacticIds: string[];
}

/** Latest-tick diagnostics for debrief, exports, and QA (deterministic). */
export interface SimulationRuntimeMetrics {
  difficultyLevel: DifficultyLevel;
  audienceArchetype: string;
  blendedShareOfVoice: number;
  /** Channels where player spent > 0 this tick */
  shareOfVoiceByChannel: Partial<Record<Channel, number>>;
  competitiveDragMultiplier: number;
  audienceFitMultiplier: number;
  tacticFatigueMultiplier: number;
  combinedTrafficMultiplier: number;
}

export interface PlayerInput {
  channelBudgets: Record<Channel, number>;
  promotions: Promotion[];
}

export interface Promotion {
  type: string;
  discount: number;
  duration: number;
}

export interface MarketConditions {
  seasonalityIndex: number;
  competitorSpend: Record<Channel, number>;
  economicIndex: number;
}

export interface SimulationState {
  tick: number;
  industry?: Industry;
  marketConditions: MarketConditions;
  adstock: Record<Channel, number>;
  /** Prior completed-quarter tactic deployments for repeat-fatigue (by catalog tactic id). */
  tacticLifetimeUses?: Record<string, number>;
  results: SimulationOutput;
  stressMeters?: {
    ceo: number; // 0-100
    cfo: number; // 0-100
    cmo: number; // 0-100
  };
  brandPosition?: {
    x: number; // e.g. Price
    y: number; // e.g. Performance
  };
  trustMultiplier?: number;
  flowState?: number;
}

export interface SimulationOutput {
  totalSales: number;
  baseSales: number;
  incrementalSales: number;
  traffic: number;
  leads: number;
  conversions: number;
  channelContributions: Record<Channel, number>;
  channelRoi: Record<Channel, number>;
  runtimeMetrics?: SimulationRuntimeMetrics;
}
