'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNewSimulation } from '@/hooks/useNewSimulation';

export default function SimulationIndexPage() {
  const router = useRouter();
  const {
    state,
    isLoading,
    error
  } = useNewSimulation();

  useEffect(() => {
    if (isLoading) return; // Still loading

    if (error) {
      console.error('Simulation error:', error);
      // Could redirect to dashboard or show error
      router.push('/dashboard');
      return;
    }

    if (!state) {
      // No simulation state - go to setup
      router.push('/sim/setup');
      return;
    }

    // Route based on simulation state
    switch (state.status) {
      case 'not_started':
        // No simulation started - go to setup
        router.push('/sim/setup');
        break;

      case 'in_progress':
        // Simulation in progress - check current phase
        switch (state.currentQuarter) {
          case 'setup':
            router.push('/sim/setup');
            break;
          case 'strategy':
            router.push('/sim/strategy');
            break;
          case 'Q1':
            router.push('/sim/q1');
            break;
          case 'Q2':
            router.push('/sim/q2');
            break;
          case 'Q3':
            router.push('/sim/q3');
            break;
          case 'Q4':
            router.push('/sim/q4');
            break;
          default:
            router.push('/sim/strategy');
        }
        break;

      case 'completed':
        // Simulation completed - go to debrief
        router.push(`/sim/debrief/${state.simulationId}`);
        break;

      default:
        // Fallback to setup
        router.push('/sim/setup');
    }
  }, [state, isLoading, error, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Simulation Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
