"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';
import { simulationMachine, SimulationContext, SimulationEvent } from '@/lib/simMachine';
import { StateFrom } from 'xstate';

type SimulationMachineState = StateFrom<typeof simulationMachine>;

interface SimulationContextValue {
  state: SimulationMachineState;
  send: (event: SimulationEvent) => void;
  isReady: boolean;
}

const SimulationReactContext = createContext<SimulationContextValue | null>(null);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  // Use a state to hold the hydrated context
  const [hydratedContext, setHydratedContext] = useState<Partial<SimulationContext> | null>(null);

  useEffect(() => {
    // Load state from local storage on mount
    const saved = localStorage.getItem('cmo-sim-state-v2');
    if (saved) {
      try {
        setHydratedContext(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved simulation state", e);
        setHydratedContext({});
      }
    } else {
       // If no saved state, use an empty object so the machine uses its defaults
       setHydratedContext({});
    }
  }, []);

  if (!hydratedContext) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <SimulationMachineProvider hydratedContext={hydratedContext}>
      {children}
    </SimulationMachineProvider>
  );
}

function SimulationMachineProvider({
  children,
  hydratedContext
}: {
  children: React.ReactNode;
  hydratedContext: Partial<SimulationContext>;
}) {
  const [state, send] = useMachine(simulationMachine);

  // Hydrate context on mount if the machine is still in 'idle'
  useEffect(() => {
    if (Object.keys(hydratedContext).length > 0 && state.matches('idle')) {
      send({ type: 'HYDRATE_CONTEXT', context: hydratedContext });
    }
  }, []);

  // Automatically save state changes to localStorage
  useEffect(() => {
    localStorage.setItem('cmo-sim-state-v2', JSON.stringify(state.context));
  }, [state.context]);

  return (
    <SimulationReactContext.Provider value={{ state, send, isReady: true }}>
      {children}
    </SimulationReactContext.Provider>
  );
}

export function useSimulationContext() {
  const context = useContext(SimulationReactContext);
  if (!context) {
    throw new Error('useSimulationContext must be used within a SimulationProvider');
  }
  return context;
}
