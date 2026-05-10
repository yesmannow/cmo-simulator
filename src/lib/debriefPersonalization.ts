/**
 * One-line personalization for debrief from saved profile (no new taxonomy).
 */
export function buildDebriefProfileHint(profile: Record<string, unknown> | null): string {
  if (!profile) return "";

  const parts: string[] = [];
  const maturity =
    typeof profile.marketing_maturity === "string" && profile.marketing_maturity.trim().length > 0
      ? profile.marketing_maturity.trim()
      : null;
  if (maturity) {
    parts.push(`This debrief reflects the maturity level you chose (${maturity}).`);
  }

  const goals = Array.isArray(profile.selected_goals)
    ? profile.selected_goals.filter((g): g is string => typeof g === "string" && g.trim().length > 0)
    : [];
  if (goals.length > 0) {
    const shown = goals.slice(0, 3).join(", ");
    const suffix = goals.length > 3 ? "…" : "";
    parts.push(`Goals you prioritized: ${shown}${suffix}`);
  }

  return parts.join(" ");
}
