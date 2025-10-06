import { useActor } from '@xstate/react';
import { createActor } from 'xstate';
import { simulationMachine, type SimulationEvent, type SimulationContext } from '@/lib/simMachine';
import { useMemo } from 'react';

// Hook to manage simulation state
export function useSimulation() {
  const actor = useMemo(() => createActor(simulationMachine), []);
  const [state, send] = useActor(actor);

  return {
    // Current state information
    currentPhase: state.value as string,
    context: state.context,
    canTransition: state.can,
    
    // State checks
    isIdle: state.matches('idle'),
    isInStrategySession: state.matches('strategySession'),
    isInQ1: state.matches('Q1'),
    isInQ2: state.matches('Q2'),
    isInQ3: state.matches('Q3'),
    isInQ4: state.matches('Q4'),
    isInDebrief: state.matches('debrief'),
    isCompleted: state.matches('completed'),
    
    // Current quarter helper
    getCurrentQuarter: () => {
      if (state.matches('Q1')) return 'Q1';
      if (state.matches('Q2')) return 'Q2';
      if (state.matches('Q3')) return 'Q3';
      if (state.matches('Q4')) return 'Q4';
      return null;
    },
    
    // Actions
    send,
    
    // Convenience methods
    startSimulation: (userId: string) => 
      send({ type: 'START_SIMULATION', userId }),
    
    setStrategy: (strategy: Partial<SimulationContext['strategy']>) =>
      send({ type: 'SET_STRATEGY', strategy }),
    
    completeStrategySession: () =>
      send({ type: 'COMPLETE_STRATEGY_SESSION' }),
    
    addTactic: (quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4', tactic: any) =>
      send({ type: 'ADD_TACTIC', quarter, tactic }),
    
    removeTactic: (quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4', tacticId: string) =>
      send({ type: 'REMOVE_TACTIC', quarter, tacticId }),
    
    triggerWildcard: (quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4', wildcard: any) =>
      send({ type: 'TRIGGER_WILDCARD', quarter, wildcard }),
    
    respondToWildcard: (wildcardId: string, choiceId: string) =>
      send({ type: 'RESPOND_TO_WILDCARD', wildcardId, choiceId }),
    
    completeQuarter: (quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4') =>
      send({ type: 'COMPLETE_QUARTER', quarter }),
    
    completeDebrief: () =>
      send({ type: 'COMPLETE_DEBRIEF' }),
    
    saveSimulation: () =>
      send({ type: 'SAVE_SIMULATION' }),
    
    restartSimulation: () =>
      send({ type: 'RESTART_SIMULATION' }),
  };
}
