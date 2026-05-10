import { runSimulationTick, initializeSimulationState } from "./index";
import type { Channel, MarketConditions, PlayerInput } from "@/types/engine";

const CHANNEL_ZERO = (): Record<Channel, number> => ({
  tv: 0,
  radio: 0,
  print: 0,
  digital: 0,
  social: 0,
  seo: 0,
  events: 0,
  pr: 0,
});

function marketHeavyDigitalCompetition(extraDigitalCompetitor: number): MarketConditions {
  const baseCompetitor: Record<Channel, number> = {
    tv: 50000,
    radio: 30000,
    print: 20000,
    digital: 80000 + extraDigitalCompetitor,
    social: 40000,
    seo: 20000,
    events: 10000,
    pr: 15000,
  };
  return {
    seasonalityIndex: 1.0,
    economicIndex: 1.0,
    competitorSpend: baseCompetitor,
  };
}

describe("runSimulationTick realism extensions", () => {
  const playerInputs: PlayerInput = {
    channelBudgets: {
      ...CHANNEL_ZERO(),
      digital: 250000,
      social: 120000,
      seo: 80000,
    },
    promotions: [],
  };

  const basePrevious = initializeSimulationState({ industry: "healthcare" });

  it("orders beginner traffic above advanced for identical inputs", () => {
    const mc = marketHeavyDigitalCompetition(0);
    const ctx = {
      quarterTacticIds: [] as string[],
      targetAudience: "Young Professionals (25-35)",
    };
    const beginner = runSimulationTick(
      { ...basePrevious, tick: 1 },
      playerInputs,
      mc,
      { difficulty: "beginner", ...ctx },
    );
    const advanced = runSimulationTick(
      { ...basePrevious, tick: 1 },
      playerInputs,
      mc,
      { difficulty: "advanced", ...ctx },
    );
    expect(beginner.results.traffic).toBeGreaterThan(advanced.results.traffic);
    expect(beginner.results.incrementalSales).toBeGreaterThan(advanced.results.incrementalSales);
  });

  it("reduces traffic when competitor pressure rises", () => {
    const mcLow = marketHeavyDigitalCompetition(0);
    const mcHigh = marketHeavyDigitalCompetition(350000);
    const tc = {
      difficulty: "intermediate" as const,
      quarterTacticIds: [] as string[],
      targetAudience: "Families with Children",
    };
    const lowPressure = runSimulationTick({ ...basePrevious, tick: 2 }, playerInputs, mcLow, tc);
    const highPressure = runSimulationTick({ ...basePrevious, tick: 2 }, playerInputs, mcHigh, tc);
    expect(highPressure.results.traffic).toBeLessThan(lowPressure.results.traffic);
    expect(highPressure.results.runtimeMetrics!.blendedShareOfVoice).toBeLessThan(
      lowPressure.results.runtimeMetrics!.blendedShareOfVoice,
    );
  });

  it("differentiates audience presets for downstream totals", () => {
    const mc = marketHeavyDigitalCompetition(0);
    const young = runSimulationTick(
      { ...basePrevious, tick: 3 },
      playerInputs,
      mc,
      {
        difficulty: "intermediate",
        quarterTacticIds: [],
        targetAudience: "Young Professionals (25-35)",
      },
    );
    const smb = runSimulationTick(
      { ...basePrevious, tick: 3 },
      playerInputs,
      mc,
      {
        difficulty: "intermediate",
        quarterTacticIds: [],
        targetAudience: "Small Business Owners",
      },
    );
    expect(young.results.runtimeMetrics!.audienceFitMultiplier).not.toBeCloseTo(
      smb.results.runtimeMetrics!.audienceFitMultiplier,
      5,
    );
    expect(young.results.incrementalSales).not.toBe(smb.results.incrementalSales);
  });

  it("applies repeat-tactic fatigue across ticks", () => {
    const mc = marketHeavyDigitalCompetition(0);
    const tc = {
      difficulty: "intermediate" as const,
      quarterTacticIds: ["repeat-heavy-tactic"],
      targetAudience: "Tech-Savvy Millennials",
    };
    const fresh = runSimulationTick({ ...basePrevious, tick: 4, tacticLifetimeUses: {} }, playerInputs, mc, tc);
    const fatigued = runSimulationTick(
      {
        ...basePrevious,
        tick: 4,
        tacticLifetimeUses: { "repeat-heavy-tactic": 4 },
      },
      playerInputs,
      mc,
      tc,
    );
    expect(fatigued.results.traffic).toBeLessThan(fresh.results.traffic);
    expect(fatigued.results.runtimeMetrics!.tacticFatigueMultiplier).toBeLessThan(
      fresh.results.runtimeMetrics!.tacticFatigueMultiplier,
    );
    expect(fatigued.tacticLifetimeUses!["repeat-heavy-tactic"]).toBe(5);
    expect(fresh.tacticLifetimeUses!["repeat-heavy-tactic"]).toBe(1);
  });
});
