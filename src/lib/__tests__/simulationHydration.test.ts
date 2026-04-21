import { createInitialSimulationContext } from "../simMachine";
import { mergeSimulationContext } from "../simulationHydration";

describe("mergeSimulationContext", () => {
  test("deep-merges engine state and preserves defaults", () => {
    const base = createInitialSimulationContext();

    const merged = mergeSimulationContext(base, {
      startedAt: "2026-04-21T12:34:56.000Z",
      strategy: {
        companyName: "Acme Co",
        industry: "saas",
      },
      engineState: {
        marketConditions: {
          competitorSpend: {
            tv: base.engineState.marketConditions.competitorSpend.tv,
            radio: base.engineState.marketConditions.competitorSpend.radio,
            print: base.engineState.marketConditions.competitorSpend.print,
            digital: 99999,
            social: base.engineState.marketConditions.competitorSpend.social,
            seo: base.engineState.marketConditions.competitorSpend.seo,
            events: base.engineState.marketConditions.competitorSpend.events,
            pr: base.engineState.marketConditions.competitorSpend.pr,
          },
        },
      },
    });

    expect(merged.startedAt).toBeInstanceOf(Date);
    expect(merged.strategy.companyName).toBe("Acme Co");
    expect(merged.strategy.industry).toBe("saas");

    // Industry should propagate into the engine state even if the patch didn't include it there.
    expect(merged.engineState.industry).toBe("saas");

    // Patch applies, but defaults remain intact for non-patched channels.
    expect(merged.engineState.marketConditions.competitorSpend.digital).toBe(99999);
    expect(merged.engineState.marketConditions.competitorSpend.tv).toBe(
      base.engineState.marketConditions.competitorSpend.tv,
    );
  });
});
