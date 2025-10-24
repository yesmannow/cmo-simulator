export type Channel = 'tv' | 'radio' | 'print' | 'digital' | 'social' | 'seo' | 'events' | 'pr';

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
  marketConditions: MarketConditions;
  adstock: Record<Channel, number>;
  results: SimulationOutput;
}

export interface SimulationOutput {
  totalSales: number;
  baseSales: number;
  incrementalSales: number;
  channelContributions: Record<Channel, number>;
  channelRoi: Record<Channel, number>;
}
