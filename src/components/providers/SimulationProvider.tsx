'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { createActor, type ActorRefFrom } from 'xstate';
import { simulationMachine } from '@/lib/simMachine';

export type SimulationActorRef = ActorRefFrom<typeof simulationMachine>;

const SimulationActorContext = createContext<SimulationActorRef | null>(null);

export function useSimulationActor() {
  const actor = useContext(SimulationActorContext);

  if (!actor) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }

  return actor;
}

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [actor] = useState<SimulationActorRef>(() => {
    const instance = createActor(simulationMachine);
    instance.start();
    return instance;
  });

  useEffect(() => {
    return () => {
      actor.stop();
    };
  }, [actor]);

  return (
    <SimulationActorContext.Provider value={actor}>
      {children}
    </SimulationActorContext.Provider>
  );
}
