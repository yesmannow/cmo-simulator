import type { SimulationContext } from '@/lib/simMachine';

export type SimulatorProgressRoute =
  | '/sim/setup'
  | '/sim/strategy'
  | '/sim/q1'
  | '/sim/q2'
  | '/sim/q3'
  | '/sim/q4'
  | '/sim/debrief';

const INITIAL_QUARTER_RESULTS = {
  revenue: 0,
  profit: 0,
  marketShare: 10,
  customerSatisfaction: 70,
  brandAwareness: 30,
} as const;

export function isStrategyReady(context: SimulationContext) {
  return Boolean(
    context.strategy.targetAudience
      && context.strategy.brandPositioning
      && context.strategy.primaryChannels?.length,
  );
}

export function isSetupReady(context: SimulationContext) {
  return Boolean(
    context.scenarioId
      && context.strategy.companyName?.trim()
      && context.strategy.logoStyle
      && context.strategy.budgetAllocation,
  );
}

export function isQuarterFinalized(context: SimulationContext, quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4') {
  const results = context.quarters[quarter].results;
  return (
    results.revenue !== INITIAL_QUARTER_RESULTS.revenue
    || results.profit !== INITIAL_QUARTER_RESULTS.profit
    || results.marketShare !== INITIAL_QUARTER_RESULTS.marketShare
    || results.customerSatisfaction !== INITIAL_QUARTER_RESULTS.customerSatisfaction
    || results.brandAwareness !== INITIAL_QUARTER_RESULTS.brandAwareness
  );
}

export function resolveProgressRoute(context: SimulationContext): SimulatorProgressRoute {
  if (!isSetupReady(context)) return '/sim/setup';
  if (!isStrategyReady(context)) return '/sim/strategy';
  if (!isQuarterFinalized(context, 'Q1')) return '/sim/q1';
  if (!isQuarterFinalized(context, 'Q2')) return '/sim/q2';
  if (!isQuarterFinalized(context, 'Q3')) return '/sim/q3';
  if (!isQuarterFinalized(context, 'Q4')) return '/sim/q4';
  return '/sim/debrief';
}

export function isGuardedSimulatorRoute(pathname: string) {
  return (
    pathname.startsWith('/sim/setup')
    || pathname.startsWith('/sim/strategy')
    || pathname.startsWith('/sim/q1')
    || pathname.startsWith('/sim/q2')
    || pathname.startsWith('/sim/q3')
    || pathname.startsWith('/sim/q4')
    || pathname.startsWith('/sim/debrief')
  );
}

export function isAllowedProgressRoute(pathname: string, route: SimulatorProgressRoute) {
  if (route === '/sim/setup') return pathname.startsWith('/sim/setup');
  if (route === '/sim/strategy') return pathname.startsWith('/sim/strategy');
  if (route === '/sim/debrief') return pathname.startsWith('/sim/debrief');
  return pathname.startsWith(route);
}
