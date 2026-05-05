export interface SimulationEventInput {
  runId: string;
  eventType: string;
  phase: string;
  payload?: Record<string, unknown>;
}

export async function recordSimulationEvent(input: SimulationEventInput): Promise<void> {
  if (!input.runId) return;

  try {
    await fetch("/api/simulation-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      keepalive: true,
    });
  } catch {
    // Fire-and-forget telemetry must never block gameplay.
  }
}

