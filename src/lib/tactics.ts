import type { Tactic, WildcardEvent } from "@/lib/simMachine";
import {
  type EnrichedTactic,
  getTacticById as getTacticByIdFromCatalog,
  getTacticsAvailableInQuarter,
  getTacticsByCategory as getTacticsByCategoryFromCatalog,
  getRandomWildcard as getRandomWildcardFromCatalog,
  getWildcardById as getWildcardByIdFromCatalog,
  QUARTER_TACTIC_IDS,
  SAMPLE_WILDCARDS,
  TACTIC_CATALOG,
  type SimulationPlayQuarter,
} from "@/lib/config/tacticCatalog";

export type { EnrichedTactic, SimulationPlayQuarter } from "@/lib/config/tacticCatalog";

/** @deprecated Prefer importing {@link TACTIC_CATALOG} from `@/lib/config/tacticCatalog` — alias preserved for incremental migration. */
export const SAMPLE_TACTICS = TACTIC_CATALOG;

export { SAMPLE_WILDCARDS, QUARTER_TACTIC_IDS };

export function getTacticsByCategory(category: Tactic["category"]): EnrichedTactic[] {
  return getTacticsByCategoryFromCatalog(category);
}

export function getTacticsForQuarter(quarter: SimulationPlayQuarter): EnrichedTactic[] {
  return getTacticsAvailableInQuarter(quarter);
}

export function getRandomWildcard(): WildcardEvent {
  return getRandomWildcardFromCatalog();
}

export function getTacticById(id: string): EnrichedTactic | undefined {
  return getTacticByIdFromCatalog(id);
}

export function getWildcardById(id: string): WildcardEvent | undefined {
  return getWildcardByIdFromCatalog(id);
}
