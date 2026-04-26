import { createInitialSimulationContext } from '@/lib/simMachine';
import { buildSimulationForecast } from '@/lib/simulationForecast';
import { SAMPLE_TACTICS } from '@/lib/tactics';

describe('buildSimulationForecast', () => {
  test('orders upside above downside for the same plan', () => {
    const context = createInitialSimulationContext();
    const selectedTactics = [SAMPLE_TACTICS[0], SAMPLE_TACTICS[3], SAMPLE_TACTICS[8]];

    const forecast = buildSimulationForecast(context, 'Q1', selectedTactics);
    const downside = forecast.scenarios.find((scenario) => scenario.key === 'downside');
    const base = forecast.scenarios.find((scenario) => scenario.key === 'base');
    const upside = forecast.scenarios.find((scenario) => scenario.key === 'upside');

    expect(downside).toBeDefined();
    expect(base).toBeDefined();
    expect(upside).toBeDefined();
    expect((upside?.projectedKpis.revenue ?? 0)).toBeGreaterThanOrEqual(base?.projectedKpis.revenue ?? 0);
    expect((base?.projectedKpis.revenue ?? 0)).toBeGreaterThanOrEqual(downside?.projectedKpis.revenue ?? 0);
    expect((upside?.projectedKpis.marketShare ?? 0)).toBeGreaterThanOrEqual(downside?.projectedKpis.marketShare ?? 0);
  });

  test('budget overrun increases forecast risk severity', () => {
    const context = createInitialSimulationContext();
    const safePlan = [SAMPLE_TACTICS[0], SAMPLE_TACTICS[3]];
    const overBudgetPlan = [SAMPLE_TACTICS[4], SAMPLE_TACTICS[6], SAMPLE_TACTICS[9], SAMPLE_TACTICS[10], SAMPLE_TACTICS[13]];

    const safeForecast = buildSimulationForecast(context, 'Q1', safePlan);
    const overBudgetForecast = buildSimulationForecast(context, 'Q1', overBudgetPlan);

    expect(overBudgetForecast.budgetSummary.remainingBudget).toBeLessThan(0);
    expect(overBudgetForecast.topRisk).not.toEqual(safeForecast.topRisk);
    expect(overBudgetForecast.scenarioSpread.profit).toBeGreaterThanOrEqual(safeForecast.scenarioSpread.profit);
  });

  test('concentrated spend increases downside pressure', () => {
    const context = createInitialSimulationContext();
    const concentratedPlan = [SAMPLE_TACTICS[0], SAMPLE_TACTICS[1], SAMPLE_TACTICS[11]];
    const diversifiedPlan = [SAMPLE_TACTICS[0], SAMPLE_TACTICS[3], SAMPLE_TACTICS[8]];

    const concentratedForecast = buildSimulationForecast(context, 'Q1', concentratedPlan);
    const diversifiedForecast = buildSimulationForecast(context, 'Q1', diversifiedPlan);
    const concentratedDownside = concentratedForecast.scenarios.find((scenario) => scenario.key === 'downside');
    const concentratedBase = concentratedForecast.scenarios.find((scenario) => scenario.key === 'base');
    const diversifiedDownside = diversifiedForecast.scenarios.find((scenario) => scenario.key === 'downside');
    const diversifiedBase = diversifiedForecast.scenarios.find((scenario) => scenario.key === 'base');

    const concentratedRatio = (concentratedDownside?.projectedKpis.revenue ?? 0) / Math.max(concentratedBase?.projectedKpis.revenue ?? 1, 1);
    const diversifiedRatio = (diversifiedDownside?.projectedKpis.revenue ?? 0) / Math.max(diversifiedBase?.projectedKpis.revenue ?? 1, 1);

    expect(concentratedRatio).toBeLessThan(diversifiedRatio);
  });
});
