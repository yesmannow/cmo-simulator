import type { Industry, MarketLandscape } from "@/types";
import type { Channel, MarketConditions } from "@/types/engine";

export type QuarterKey = "Q1" | "Q2" | "Q3" | "Q4";

export interface ScenarioMarketTuning {
  baselineEconomicIndex: number;
  baseCompetitorSpend: Record<Channel, number>;
  seasonalityByQuarter: Record<QuarterKey, number>;
}

const DEFAULT_COMPETITOR_SPEND: Record<Channel, number> = {
  tv: 50000,
  radio: 30000,
  print: 20000,
  digital: 80000,
  social: 40000,
  seo: 20000,
  events: 10000,
  pr: 15000,
};

const DEFAULT_SEASONALITY: Record<QuarterKey, number> = {
  Q1: 0.95,
  Q2: 1.0,
  Q3: 1.0,
  Q4: 1.1,
};

function scaleCompetitorSpend(
  spend: Record<Channel, number>,
  multiplier: number,
): Record<Channel, number> {
  return {
    tv: spend.tv * multiplier,
    radio: spend.radio * multiplier,
    print: spend.print * multiplier,
    digital: spend.digital * multiplier,
    social: spend.social * multiplier,
    seo: spend.seo * multiplier,
    events: spend.events * multiplier,
    pr: spend.pr * multiplier,
  };
}

function getScenarioMarketTuning(scenarioId: string | undefined): ScenarioMarketTuning | null {
  if (!scenarioId) return null;

  // Keep this keyed to the IDs in `src/app/sim/setup/page.tsx`.
  if (scenarioId === "turnaround") {
    return {
      baselineEconomicIndex: 0.95,
      baseCompetitorSpend: {
        ...DEFAULT_COMPETITOR_SPEND,
        digital: 65000,
        social: 35000,
        seo: 25000,
        pr: 20000,
        tv: 45000,
      },
      seasonalityByQuarter: {
        // Legacy retail/ecom dynamics: weak Q1, strong Q4.
        Q1: 0.85,
        Q2: 0.95,
        Q3: 1.0,
        Q4: 1.25,
      },
    };
  }

  if (scenarioId === "hyper-growth") {
    return {
      baselineEconomicIndex: 1.05,
      baseCompetitorSpend: {
        ...DEFAULT_COMPETITOR_SPEND,
        digital: 140000,
        social: 90000,
        seo: 45000,
        pr: 35000,
        events: 25000,
      },
      seasonalityByQuarter: {
        // SaaS growth environments: steadier demand, higher execution tempo.
        Q1: 1.0,
        Q2: 1.05,
        Q3: 1.05,
        Q4: 1.0,
      },
    };
  }

  if (scenarioId === "challenger") {
    return {
      baselineEconomicIndex: 0.98,
      baseCompetitorSpend: {
        ...DEFAULT_COMPETITOR_SPEND,
        tv: 85000,
        radio: 45000,
        print: 30000,
        digital: 95000,
        pr: 30000,
      },
      seasonalityByQuarter: {
        // Challenger brand: momentum matters; later quarters become harder.
        Q1: 1.0,
        Q2: 1.0,
        Q3: 0.95,
        Q4: 0.9,
      },
    };
  }

  return null;
}

function seasonalityFromIndustry(industry: Industry | undefined, quarter: QuarterKey): number {
  // Light-touch, high-signal only. The engine also applies an industry seasonality factor.
  if (!industry) return 1.0;

  if (industry === "ecommerce" || industry === "fashion") {
    if (quarter === "Q4") return 1.15;
    if (quarter === "Q1") return 0.92;
  }

  if (industry === "travel") {
    if (quarter === "Q2" || quarter === "Q3") return 1.15;
    if (quarter === "Q1") return 0.9;
  }

  if (industry === "education") {
    if (quarter === "Q3") return 1.2;
    if (quarter === "Q4") return 0.9;
  }

  return 1.0;
}

export function buildQuarterMarketConditions(options: {
  scenarioId?: string;
  quarter: QuarterKey;
  industry?: Industry;
  marketLandscape?: MarketLandscape;
  previous?: MarketConditions;
}): MarketConditions {
  const tuning = getScenarioMarketTuning(options.scenarioId);

  const baseCompetitorSpend = tuning?.baseCompetitorSpend ?? options.previous?.competitorSpend ?? DEFAULT_COMPETITOR_SPEND;
  const baselineEconomicIndex = tuning?.baselineEconomicIndex ?? options.previous?.economicIndex ?? 1.0;

  const scenarioSeasonality = tuning?.seasonalityByQuarter?.[options.quarter] ?? DEFAULT_SEASONALITY[options.quarter];
  const industrySeasonality = seasonalityFromIndustry(options.industry, options.quarter);

  let competitorSpend = baseCompetitorSpend;
  let economicIndex = baselineEconomicIndex;

  if (options.marketLandscape === "disruptor") economicIndex *= 0.9;
  if (options.marketLandscape === "frontier") economicIndex *= 1.05;
  if (options.marketLandscape === "crowded") competitorSpend = scaleCompetitorSpend(competitorSpend, 1.5);

  // Keep it deterministic: seasonality is purely derived from scenario + industry + quarter.
  const seasonalityIndex = scenarioSeasonality * industrySeasonality;

  return {
    seasonalityIndex,
    economicIndex,
    competitorSpend,
  };
}

