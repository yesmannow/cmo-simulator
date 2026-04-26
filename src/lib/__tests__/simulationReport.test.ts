import { createInitialSimulationContext } from '@/lib/simMachine';
import { buildSimulationDebriefReport } from '@/lib/simulationReport';
import { SAMPLE_TACTICS } from '@/lib/tactics';

describe('buildSimulationDebriefReport', () => {
  test('includes score, grade, quarterly rows, and next move', () => {
    const context = createInitialSimulationContext();

    context.quarters.Q1.tactics = [SAMPLE_TACTICS[0]];
    context.quarters.Q2.tactics = [SAMPLE_TACTICS[3]];
    context.quarters.Q1.results = {
      revenue: 150000,
      profit: 45000,
      marketShare: 12,
      customerSatisfaction: 73,
      brandAwareness: 38,
    };
    context.quarters.Q2.results = {
      revenue: 210000,
      profit: 70000,
      marketShare: 15,
      customerSatisfaction: 75,
      brandAwareness: 42,
    };
    context.kpis = {
      revenue: 360000,
      profit: 115000,
      marketShare: 15,
      customerSatisfaction: 75,
      brandAwareness: 42,
    };

    const report = buildSimulationDebriefReport(context, { email: 'test@example.com', name: 'Test User' });

    expect(report.score).toBeGreaterThan(0);
    expect(report.grade).toBeDefined();
    expect(report.quarterRows).toHaveLength(4);
    expect(report.quarterRows[0].tactics).toContain(SAMPLE_TACTICS[0].name);
    expect(report.nextMove).toBeTruthy();
    expect(report.topRisk).toBeTruthy();
    expect(report.user?.email).toBe('test@example.com');
  });
});
