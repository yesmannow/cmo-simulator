export const PROFILE_ROLE_OPTIONS = [
  { value: "cmo", label: "CMO" },
  { value: "founder", label: "Founder" },
  { value: "marketing_lead", label: "Marketing Lead" },
  { value: "growth_operator", label: "Growth Operator" },
  { value: "consultant", label: "Consultant" },
] as const;

export const MARKETING_MATURITY_OPTIONS = [
  { value: "nascent", label: "Nascent" },
  { value: "developing", label: "Developing" },
  { value: "scaling", label: "Scaling" },
  { value: "mature", label: "Mature" },
] as const;

export const SIMULATION_GOAL_OPTIONS = [
  { value: "brand-awareness", label: "Brand awareness" },
  { value: "pipeline", label: "Pipeline" },
  { value: "conversion", label: "Conversion" },
  { value: "retention", label: "Retention" },
  { value: "efficiency", label: "Efficiency" },
] as const;

export const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
] as const;

export type ProfileRole = (typeof PROFILE_ROLE_OPTIONS)[number]["value"];
export type MarketingMaturity = (typeof MARKETING_MATURITY_OPTIONS)[number]["value"];
export type SimulationGoal = (typeof SIMULATION_GOAL_OPTIONS)[number]["value"];
export type PreferredDifficulty = (typeof DIFFICULTY_OPTIONS)[number]["value"];

export interface UserProfileFormState {
  fullName: string;
  companyName: string;
  role: ProfileRole;
  marketingMaturity: MarketingMaturity;
  selectedGoals: SimulationGoal[];
  preferredDifficulty: PreferredDifficulty;
}

export function createDefaultUserProfileFormState(): UserProfileFormState {
  return {
    fullName: "",
    companyName: "",
    role: "cmo",
    marketingMaturity: "developing",
    selectedGoals: ["pipeline"],
    preferredDifficulty: "medium",
  };
}

export function toggleGoal(selectedGoals: SimulationGoal[], goal: SimulationGoal): SimulationGoal[] {
  return selectedGoals.includes(goal)
    ? selectedGoals.filter((entry) => entry !== goal)
    : [...selectedGoals, goal];
}

