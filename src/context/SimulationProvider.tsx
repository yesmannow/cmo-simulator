'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { createActor, type ActorRefFrom } from 'xstate';
import { simulationMachine } from '@/lib/simMachine';

const SimulationActorContext = createContext<ActorRefFrom<typeof simulationMachine> | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [actor] = useState(() => {
    const actorRef = createActor(simulationMachine);
    actorRef.start();
    return actorRef;
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

export function useSimulationActor() {
  const actor = useContext(SimulationActorContext);
  if (!actor) {
    throw new Error('useSimulationActor must be used within a SimulationProvider');
  }
  return actor;
}
