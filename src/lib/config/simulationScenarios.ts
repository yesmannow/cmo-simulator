import type { SimulationKpiSnapshot } from "@/lib/simulationContracts";
import type { CompanyProfile, Industry, MarketLandscape, TimeHorizon } from "@/types";

export type SimulationScenarioId = "turnaround" | "hyper-growth" | "challenger";

/** Lucide icon key resolved in the setup UI — keeps this module free of React. */
export type SimulationScenarioIconKey = "target" | "rocket" | "zap";

export interface SimulationScenarioDefinition {
  id: SimulationScenarioId;
  name: string;
  description: string;
  iconKey: SimulationScenarioIconKey;
  /** Tailwind utility bundle for scenario cards */
  color: string;
  timeHorizon: TimeHorizon;
  industry: Industry;
  companyProfile: CompanyProfile;
  marketLandscape: MarketLandscape;
  /** Display label only — distinct from `DifficultyLevel` in global types */
  difficulty: string;
  budget: number;
  startingKPIs: SimulationKpiSnapshot;
  executiveMandate: string;
}

export const SIMULATION_SCENARIOS: SimulationScenarioDefinition[] = [
  {
    id: "turnaround",
    name: "The Turnaround",
    description:
      "A legacy brand steadily losing market share. Your job is to stop the bleeding and revitalize the brand before cash runs out.",
    iconKey: "target",
    color: "text-amber-300 bg-amber-500/10 border-amber-400/20",
    timeHorizon: "1-year",
    industry: "ecommerce",
    companyProfile: "enterprise",
    marketLandscape: "disruptor",
    difficulty: "Hard",
    budget: 1_500_000,
    startingKPIs: {
      revenue: 5_000_000,
      profit: 0,
      marketShare: 15,
      brandAwareness: 60,
      customerSatisfaction: 35,
    },
    executiveMandate: "Immediate stabilization and return to profitability.",
  },
  {
    id: "hyper-growth",
    name: "Hyper-Growth SaaS",
    description:
      "A heavily funded Series B startup. The board demands aggressive acquisition at all costs to hit unicorn valuation.",
    iconKey: "rocket",
    color: "text-violet-300 bg-violet-500/10 border-violet-400/20",
    timeHorizon: "3-year",
    industry: "saas",
    companyProfile: "startup",
    marketLandscape: "crowded",
    difficulty: "Very Hard",
    budget: 3_500_000,
    startingKPIs: {
      revenue: 1_200_000,
      profit: 0,
      marketShare: 2,
      brandAwareness: 10,
      customerSatisfaction: 85,
    },
    executiveMandate: "Triple-digit YoY growth. Unit economics secondary.",
  },
  {
    id: "challenger",
    name: "The Challenger Brand",
    description:
      "A lean startup trying to disrupt a massive incumbent. You must be resourceful, loud, and strategic to survive.",
    iconKey: "zap",
    color: "text-emerald-300 bg-emerald-500/10 border-emerald-400/20",
    timeHorizon: "5-year",
    industry: "fintech",
    companyProfile: "startup",
    marketLandscape: "disruptor",
    difficulty: "Medium",
    budget: 500_000,
    startingKPIs: {
      revenue: 250_000,
      profit: 0,
      marketShare: 1,
      brandAwareness: 5,
      customerSatisfaction: 90,
    },
    executiveMandate: "Build an obsessed cult-following over 5 years.",
  },
];

export function getSimulationScenarioById(
  id: string | null | undefined,
): SimulationScenarioDefinition | undefined {
  if (!id) return undefined;
  return SIMULATION_SCENARIOS.find((scenario) => scenario.id === id);
}

export function isSimulationScenarioId(value: string | undefined): value is SimulationScenarioId {
  return value === "turnaround" || value === "hyper-growth" || value === "challenger";
}
