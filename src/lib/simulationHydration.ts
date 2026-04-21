import type { HydrationPatch, SimulationContext } from "@/lib/simMachine";
import type { Industry } from "@/types";
import type { Channel, MarketConditions, SimulationOutput, SimulationState } from "@/types/engine";

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function coerceDate(value: unknown): Date | undefined {
  if (value instanceof Date) return value;
  if (typeof value !== "string") return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) return undefined;
  return parsed;
}

function mergeAdstock(
  base: Record<Channel, number>,
  patch: unknown,
): Record<Channel, number> {
  if (!isRecord(patch)) return base;

  const merged = { ...base } as Record<Channel, number>;
  for (const channel of Object.keys(base) as Channel[]) {
    const maybe = patch[channel];
    if (typeof maybe === "number" && Number.isFinite(maybe)) merged[channel] = maybe;
  }
  return merged;
}

function mergeMarketConditions(
  base: MarketConditions,
  patch: unknown,
): MarketConditions {
  if (!isRecord(patch)) return base;

  const competitorSpend = isRecord(patch.competitorSpend)
    ? mergeAdstock(base.competitorSpend, patch.competitorSpend)
    : base.competitorSpend;

  return {
    ...base,
    ...(typeof patch.seasonalityIndex === "number" ? { seasonalityIndex: patch.seasonalityIndex } : null),
    ...(typeof patch.economicIndex === "number" ? { economicIndex: patch.economicIndex } : null),
    competitorSpend,
  };
}

function mergeSimulationOutput(
  base: SimulationOutput,
  patch: unknown,
): SimulationOutput {
  if (!isRecord(patch)) return base;

  const channelContributions = isRecord(patch.channelContributions)
    ? mergeAdstock(base.channelContributions, patch.channelContributions)
    : base.channelContributions;

  const channelRoi = isRecord(patch.channelRoi)
    ? mergeAdstock(base.channelRoi, patch.channelRoi)
    : base.channelRoi;

  return {
    ...base,
    ...(typeof patch.totalSales === "number" ? { totalSales: patch.totalSales } : null),
    ...(typeof patch.baseSales === "number" ? { baseSales: patch.baseSales } : null),
    ...(typeof patch.incrementalSales === "number" ? { incrementalSales: patch.incrementalSales } : null),
    ...(typeof patch.traffic === "number" ? { traffic: patch.traffic } : null),
    ...(typeof patch.leads === "number" ? { leads: patch.leads } : null),
    ...(typeof patch.conversions === "number" ? { conversions: patch.conversions } : null),
    channelContributions,
    channelRoi,
  };
}

function normalizeIndustry(value: unknown): Industry | undefined {
  if (typeof value !== "string") return undefined;
  // Keep this list in sync with `src/types/index.ts` (Industry union).
  const allowed = new Set<Industry>([
    "healthcare",
    "legal",
    "ecommerce",
    "saas",
    "fintech",
    "education",
    "real-estate",
    "food-delivery",
    "fitness",
    "automotive",
    "travel",
    "gaming",
    "fashion",
    "construction",
    "energy",
    "agritech",
    "manufacturing",
    "nonprofit",
    "music",
    "sports",
    "pet-care",
    "home-services",
    "cannabis",
    "space",
  ]);

  if (allowed.has(value as Industry)) return value as Industry;
  return undefined;
}

function mergeEngineState(
  base: SimulationState,
  patch: unknown,
  derivedIndustry: Industry | undefined,
): SimulationState {
  if (!isRecord(patch)) {
    return derivedIndustry ? { ...base, industry: derivedIndustry } : base;
  }

  const patchIndustry = normalizeIndustry(patch.industry);
  const industry = patchIndustry ?? derivedIndustry ?? base.industry;

  const marketConditions = patch.marketConditions
    ? mergeMarketConditions(base.marketConditions, patch.marketConditions)
    : base.marketConditions;

  const adstock = patch.adstock ? mergeAdstock(base.adstock, patch.adstock) : base.adstock;

  const results = patch.results ? mergeSimulationOutput(base.results, patch.results) : base.results;

  const stressMeters = isRecord(patch.stressMeters)
    ? {
        ceo: typeof patch.stressMeters.ceo === "number" ? patch.stressMeters.ceo : base.stressMeters?.ceo ?? 75,
        cfo: typeof patch.stressMeters.cfo === "number" ? patch.stressMeters.cfo : base.stressMeters?.cfo ?? 75,
        cmo: typeof patch.stressMeters.cmo === "number" ? patch.stressMeters.cmo : base.stressMeters?.cmo ?? 75,
      }
    : base.stressMeters;

  const brandPosition = isRecord(patch.brandPosition)
    ? {
        x: typeof patch.brandPosition.x === "number" ? patch.brandPosition.x : base.brandPosition?.x ?? 50,
        y: typeof patch.brandPosition.y === "number" ? patch.brandPosition.y : base.brandPosition?.y ?? 50,
      }
    : base.brandPosition;

  return {
    ...base,
    ...(typeof patch.tick === "number" ? { tick: patch.tick } : null),
    marketConditions,
    adstock,
    results,
    stressMeters,
    brandPosition,
    ...(typeof patch.trustMultiplier === "number" ? { trustMultiplier: patch.trustMultiplier } : null),
    ...(typeof patch.flowState === "number" ? { flowState: patch.flowState } : null),
    ...(industry ? { industry } : null),
  };
}

export function mergeSimulationContext(
  base: SimulationContext,
  patch: HydrationPatch,
): SimulationContext {
  const strategy = {
    ...base.strategy,
    ...(patch.strategy ?? {}),
  };

  const derivedIndustry = normalizeIndustry((patch.strategy as { industry?: unknown } | undefined)?.industry);

  const quartersPatch = patch.quarters;
  const quarters = quartersPatch
    ? {
        Q1: { ...base.quarters.Q1, ...(quartersPatch.Q1 ?? {}) },
        Q2: { ...base.quarters.Q2, ...(quartersPatch.Q2 ?? {}) },
        Q3: { ...base.quarters.Q3, ...(quartersPatch.Q3 ?? {}) },
        Q4: { ...base.quarters.Q4, ...(quartersPatch.Q4 ?? {}) },
      }
    : base.quarters;

  return {
    ...base,
    ...patch,
    startedAt: coerceDate(patch.startedAt) ?? base.startedAt,
    strategy,
    quarters,
    kpis: { ...base.kpis, ...(patch.kpis ?? {}) },
    engineState: mergeEngineState(base.engineState, patch.engineState as unknown, derivedIndustry),
    wildcards: patch.wildcards ?? base.wildcards,
    hiredTalent: patch.hiredTalent ?? base.hiredTalent,
  };
}
