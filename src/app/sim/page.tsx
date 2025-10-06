'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSimulation } from '@/hooks/useSimulation';

export default function SimulationIndexPage() {
  const router = useRouter();
  const { isIdle, isInStrategySession, getCurrentQuarter, isInDebrief, isCompleted } = useSimulation();

  useEffect(() => {
    // Redirect to appropriate simulation phase
    if (isIdle) {
      router.push('/sim/strategy');
    } else if (isInStrategySession) {
      router.push('/sim/strategy');
    } else if (isInDebrief) {
      router.push('/sim/debrief');
    } else if (isCompleted) {
      router.push('/sim/debrief');
    } else {
      const quarter = getCurrentQuarter();
      if (quarter) {
        router.push(`/sim/${quarter.toLowerCase()}`);
      } else {
        router.push('/sim/strategy');
      }
    }
  }, [isIdle, isInStrategySession, getCurrentQuarter, isInDebrief, isCompleted, router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
