"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSimulation } from '@/hooks/useSimulation';
import { SAMPLE_TACTICS } from '@/lib/tactics';
import type { Tactic } from '@/lib/simMachine';
import { ImmersiveLayout } from '@/components/simulation/ImmersiveLayout';
import { QuarterOperatingConsole } from '@/components/simulation/QuarterOperatingConsole';
import { EndOfQuarterDebrief } from '@/components/simulation/EndOfQuarterDebrief';
import { saveSimulationSnapshot } from '@/lib/saveSimulationSnapshot';

export default function Q1Page() {
  const router = useRouter();
  const { context, addTactic, removeTactic, completeQuarter } = useSimulation();
  const [selectedTactics, setSelectedTactics] = useState<Tactic[]>(context.quarters.Q1.tactics || []);
  const [showDebrief, setShowDebrief] = useState(false);

  const quarterBudget = Math.floor((context.totalBudget || 500000) / 4);
  const usedBudget = selectedTactics.reduce((sum, tactic) => sum + (tactic.cost || 0), 0);
  const canComplete = selectedTactics.length > 0 && usedBudget <= quarterBudget;

  const handleAddTactic = (tactic: Tactic) => {
    if (selectedTactics.some((selected) => selected.id === tactic.id)) return;
    setSelectedTactics((current) => [...current, tactic]);
    addTactic('Q1', tactic);
  };

  const handleRemoveTactic = (tacticId: string) => {
    setSelectedTactics((current) => current.filter((tactic) => tactic.id !== tacticId));
    removeTactic('Q1', tacticId);
  };

  return (
    <ImmersiveLayout title="Q1 Operating Plan" subtitle="Set the first quarter foundation." quarter="Quarter 1">
      <QuarterOperatingConsole
        context={context}
        quarter="Q1"
        title="Set the first-quarter growth foundation"
        subtitle="Choose a focused mix that can create early signal while preserving enough budget for learning and course correction."
        availableTactics={SAMPLE_TACTICS.slice(0, 6)}
        selectedTactics={selectedTactics}
        onAddTactic={handleAddTactic}
        onRemoveTactic={handleRemoveTactic}
        onCompleteQuarter={() => setShowDebrief(true)}
        canComplete={canComplete}
        completeLabel="Finalize Q1 plan"
      />

      <EndOfQuarterDebrief
        isOpen={showDebrief}
        context={context}
        quarter="Q1"
        selectedTactics={selectedTactics}
        onConfirm={() => {
          void saveSimulationSnapshot(context, 'Q1', 'in_progress');
          setShowDebrief(false);
          completeQuarter('Q1');
          router.push('/sim/q2');
        }}
      />
    </ImmersiveLayout>
  );
}

