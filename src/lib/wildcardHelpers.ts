import type { SimulationContext } from './simMachine';
import { selectRandomWildcard, type EnhancedWildcardEvent } from './enhancedWildcards';

export function getEnhancedWildcardForQuarter(
  context: SimulationContext,
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4',
): EnhancedWildcardEvent | null {
  const hasHiredTalent = Boolean(context.hiredTalent?.length || context.quarters[quarter].talentHired?.length);
  return selectRandomWildcard(
    quarter,
    context.kpis,
    hasHiredTalent,
    context.strategy,
  );
}
