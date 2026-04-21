"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';
import { simulationMachine, SimulationEvent, HydrationPatch } from '@/lib/simMachine';
import { StateFrom } from 'xstate';
import { logger } from '@/lib/logger';

type SimulationMachineState = StateFrom<typeof simulationMachine>;

interface SimulationContextValue {
  state: SimulationMachineState;
  send: (event: SimulationEvent) => void;
  isReady: boolean;
}

const SimulationReactContext = createContext<SimulationContextValue | null>(null);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  // Use a state to hold the hydrated context
  const [hydratedContext, setHydratedContext] = useState<HydrationPatch | null>(null);
  const [hydrationError, setHydrationError] = useState<string | null>(null);

  useEffect(() => {
    // Load state from local storage on mount
    const saved = localStorage.getItem('cmo-sim-state-v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          setHydratedContext(parsed);
          setHydrationError(null);
        } else {
          setHydrationError('Saved simulation state is invalid.');
          setHydratedContext({});
        }
      } catch (e) {
        logger.error("Failed to parse saved simulation state", e);
        setHydrationError('Saved simulation state is corrupted.');
        setHydratedContext({});
      }
    } else {
       // If no saved state, use an empty object so the machine uses its defaults
       setHydratedContext({});
    }
  }, []);

  if (hydrationError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white px-4">
        <div className="w-full max-w-xl p-6 rounded-2xl border border-red-500/30 bg-red-950/20">
          <h2 className="text-xl font-bold mb-3">Saved Session Issue Detected</h2>
          <p className="text-red-100/80 mb-5">{hydrationError}</p>
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-400 text-white font-semibold"
            onClick={() => {
              localStorage.removeItem('cmo-sim-state-v2');
              window.location.reload();
            }}
          >
            Reset Local Session
          </button>
        </div>
      </div>
    );
  }

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
  hydratedContext: HydrationPatch;
}) {
  const [state, send] = useMachine(simulationMachine);

  // Hydrate context on mount if the machine is still in 'idle'
  useEffect(() => {
    if (Object.keys(hydratedContext).length > 0 && state.matches('idle')) {
      send({ type: 'HYDRATE_CONTEXT', context: hydratedContext });
    }
  }, [hydratedContext, send, state]);

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
