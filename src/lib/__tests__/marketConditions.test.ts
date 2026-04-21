import { describe, it, expect } from "@jest/globals";
import { buildQuarterMarketConditions } from "../marketConditions";

describe("buildQuarterMarketConditions", () => {
  it("produces scenario-differentiated seasonality in Q4", () => {
    const turnaround = buildQuarterMarketConditions({
      scenarioId: "turnaround",
      quarter: "Q4",
      industry: "ecommerce",
      marketLandscape: "disruptor",
    });

    const hyperGrowth = buildQuarterMarketConditions({
      scenarioId: "hyper-growth",
      quarter: "Q4",
      industry: "saas",
      marketLandscape: "crowded",
    });

    const challenger = buildQuarterMarketConditions({
      scenarioId: "challenger",
      quarter: "Q4",
      industry: "fintech",
      marketLandscape: "disruptor",
    });

    expect(turnaround.seasonalityIndex).toBeGreaterThan(hyperGrowth.seasonalityIndex);
    expect(challenger.seasonalityIndex).toBeLessThan(hyperGrowth.seasonalityIndex);
  });

  it("amplifies competitor spend for crowded landscapes", () => {
    const normal = buildQuarterMarketConditions({
      scenarioId: "hyper-growth",
      quarter: "Q2",
      industry: "saas",
      marketLandscape: "frontier",
    });

    const crowded = buildQuarterMarketConditions({
      scenarioId: "hyper-growth",
      quarter: "Q2",
      industry: "saas",
      marketLandscape: "crowded",
    });

    expect(crowded.competitorSpend.digital).toBeCloseTo(normal.competitorSpend.digital * 1.5, 5);
    expect(crowded.competitorSpend.tv).toBeCloseTo(normal.competitorSpend.tv * 1.5, 5);
  });
});

