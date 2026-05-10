'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSimulation } from '@/hooks/useSimulation';
import { resolveProgressRoute } from '@/lib/simulationProgress';

export default function SimulationIndexPage() {
  const router = useRouter();
  const { context, isReady } = useSimulation();

  useEffect(() => {
    if (!isReady) return;
    router.replace(resolveProgressRoute(context));
  }, [context, isReady, router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
