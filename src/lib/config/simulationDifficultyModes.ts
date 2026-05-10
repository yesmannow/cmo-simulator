import type { DifficultyLevel } from "@/types";

/**
 * Learner preference captured on setup / profile — **not** yet driving engine math directly.
 * Maps to `DifficultyLevel` for future integration with `src/lib/difficultySystem.ts`.
 */
export const PROFILE_DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
] as const;

export type SimulationProfileDifficulty = (typeof PROFILE_DIFFICULTY_OPTIONS)[number]["value"];

/** Bridge table for upcoming wiring into `difficultyConfigs` (beginner / intermediate / advanced). */
export const PROFILE_DIFFICULTY_TO_ENGINE_LEVEL: Record<SimulationProfileDifficulty, DifficultyLevel> = {
  easy: "beginner",
  medium: "intermediate",
  hard: "advanced",
};
