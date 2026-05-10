"use client";

import { notFound, useRouter } from 'next/navigation';
import { EndOfQuarterDebrief } from '@/components/simulation/EndOfQuarterDebrief';
import { useSimulation } from '@/hooks/useSimulation';
import { saveSimulationSnapshot } from '@/lib/saveSimulationSnapshot';
import { recordSimulationEvent } from '@/lib/simulationTelemetry';

const QUARTER_ROUTE_CONFIG = {
  q1: { quarter: 'Q1', nextRoute: '/sim/q2', saveStatus: 'in_progress' },
  q2: { quarter: 'Q2', nextRoute: '/sim/q3', saveStatus: 'in_progress' },
  q3: { quarter: 'Q3', nextRoute: '/sim/q4', saveStatus: 'in_progress' },
  q4: { quarter: 'Q4', nextRoute: '/sim/debrief', saveStatus: 'completed' },
} as const;

type QuarterRouteSlug = keyof typeof QUARTER_ROUTE_CONFIG;

export function QuarterDebriefClient({ quarterSlug }: { quarterSlug: string }) {
  const router = useRouter();
  const { context, completeQuarter } = useSimulation();

  const routeConfig = QUARTER_ROUTE_CONFIG[quarterSlug as QuarterRouteSlug];
  if (!routeConfig) {
    notFound();
  }

  const { quarter, nextRoute, saveStatus } = routeConfig;
  const selectedTactics = context.quarters[quarter].tactics || [];
  const quarterBudget = Math.floor((context.totalBudget || 500000) / 4);
  const usedBudget = selectedTactics.reduce((sum, tactic) => sum + (tactic.cost || 0), 0);
  const remainingBudget = quarterBudget - usedBudget;

  return (
    <div className="min-h-[calc(100vh-11rem)] px-1 py-1 md:px-2 md:py-2">
      <EndOfQuarterDebrief
        mode="page"
        context={context}
        quarter={quarter}
        selectedTactics={selectedTactics}
        onBack={() => router.push(`/sim/${quarterSlug}`)}
        onConfirm={() => {
          void saveSimulationSnapshot(context, quarter, saveStatus);
          void recordSimulationEvent({
            runId: context.simulationId ?? '',
            eventType: 'quarter_completed',
            phase: quarter,
            payload: {
              quarter,
              tacticCount: selectedTactics.length,
              usedBudget,
              ...(quarter === 'Q2' || quarter === 'Q3' ? { remainingBudget } : {}),
              ...(quarter === 'Q3' ? { bigBetSelected: Boolean(context.quarters.Q3.bigBetMade) } : {}),
            },
          });
          completeQuarter(quarter);
          router.push(nextRoute);
        }}
      />
    </div>
  );
}
