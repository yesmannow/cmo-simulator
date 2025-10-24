/**
 * New Simulation Hook using Zustand Store
 * Replaces useEnhancedSimulation with the new architecture
 */

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { PlayerInput, MarketConditions } from '@/types/engine';

export function useNewSimulation() {
  const router = useRouter();

  // Select state from store
  const simulationState = useGameStore(state => state.simulationState);
  const status = useGameStore(state => state.status);
  const currentQuarter = useGameStore(state => state.currentQuarter);
  const isRunning = useGameStore(state => state.isRunning);
  const simulationId = useGameStore(state => state.simulationId);

  // Actions
  const advanceTick = useGameStore(state => state.advanceTick);
  const reset = useGameStore(state => state.reset);
  const play = useGameStore(state => state.play);
  const pause = useGameStore(state => state.pause);

  // Input actions
  const setBudget = useGameStore(state => state.setBudget);
  const clearInputs = useGameStore(state => state.clearInputs);

  // UI actions
  const setActiveTab = useGameStore(state => state.setActiveTab);

  // Create a state object compatible with old interface
  const state = {
    status,
    currentQuarter,
    simulationId,
    // Add other properties as needed
    ...simulationState
  };

  // Routing logic similar to old hook
  useEffect(() => {
    if (!state) {
      router.push('/sim/setup');
      return;
    }

    switch (state.status) {
      case 'not_started':
        router.push('/sim/setup');
        break;
      case 'in_progress':
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
        router.push(`/sim/debrief/${state.simulationId}`);
        break;
      default:
        router.push('/sim/setup');
    }
  }, [state, router]);

  /**
   * Start simulation (initialize)
   */
  const startSimulation = useCallback(() => {
    reset();
    play();
  }, [reset, play]);

  /**
   * Submit quarter decisions
   */
  const submitQuarterDecisions = useCallback(async (decisions: any) => {
    // Convert old decisions to new format
    const playerInputs: PlayerInput = {
      channelBudgets: decisions.tactics?.reduce((acc: any, t: any) => {
        // Map tactic categories to channels (simplified)
        const channel = mapTacticToChannel(t.tacticId);
        acc[channel] = (acc[channel] || 0) + t.budgetAllocated;
        return acc;
      }, {}) || {},
      promotions: [] // TODO: handle promotions
    };

    const marketConditions: MarketConditions = {
      seasonalityIndex: 1.0, // TODO: dynamic
      competitorSpend: { tv: 50000, radio: 30000, print: 20000, digital: 80000, social: 40000, seo: 20000, events: 10000, pr: 15000 },
      economicIndex: 1.0
    };

    advanceTick(playerInputs, marketConditions);
  }, [advanceTick]);

  return {
    state,
    isLoading: false, // TODO: add loading state
    error: null, // TODO: add error handling
    startSimulation,
    submitQuarterDecisions,
    reset,
    // Expose store actions
    setBudget,
    clearInputs,
    setActiveTab
  };
}

// Helper function to map old tactics to new channels
function mapTacticToChannel(tacticId: string): string {
  // Simplified mapping - in real implementation, use tactic data
  if (tacticId.includes('tv') || tacticId.includes('traditional')) return 'tv';
  if (tacticId.includes('radio')) return 'radio';
  if (tacticId.includes('print')) return 'print';
  if (tacticId.includes('digital') || tacticId.includes('paid')) return 'digital';
  if (tacticId.includes('social')) return 'social';
  if (tacticId.includes('seo') || tacticId.includes('content')) return 'seo';
  if (tacticId.includes('events')) return 'events';
  if (tacticId.includes('pr')) return 'pr';
  return 'digital'; // default
}
