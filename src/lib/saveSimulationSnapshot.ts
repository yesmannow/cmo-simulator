import type { SimulationContext } from "@/lib/simMachine";
import { getSimAuthSession } from "@/lib/simAuth";
import { toPersistedRunPayload } from "@/lib/simulationPersistence";

export async function saveSimulationSnapshot(
  context: SimulationContext,
  phase: string,
  status: "in_progress" | "completed",
): Promise<void> {
  const session = getSimAuthSession();
  if (!session) return;

  const payload = toPersistedRunPayload(
    context,
    { userId: session.userId, email: session.email, name: session.name },
    { phase, status },
  );

  await fetch("/api/simulations/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

