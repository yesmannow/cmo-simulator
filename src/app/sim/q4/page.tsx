"use client";

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { useSimulation } from '@/hooks/useSimulation';
import { SAMPLE_TACTICS } from '@/lib/tactics';
import type { Tactic } from '@/lib/simMachine';
import { calculateEnhancedWildcardImpact, type EnhancedWildcardEvent } from '@/lib/enhancedWildcards';
import { getEnhancedWildcardForQuarter } from '@/lib/wildcardHelpers';
import { ImmersiveLayout } from '@/components/simulation/ImmersiveLayout';
import { QuarterOperatingConsole } from '@/components/simulation/QuarterOperatingConsole';
import { EndOfQuarterDebrief } from '@/components/simulation/EndOfQuarterDebrief';
import { WildcardModal } from '@/components/simulation/WildcardModal';
import { Button } from '@/components/ui/button';
import { saveSimulationSnapshot } from '@/lib/saveSimulationSnapshot';

export default function Q4Page() {
  const router = useRouter();
  const { context, addTactic, removeTactic, triggerWildcard, respondToWildcard, completeQuarter } = useSimulation();
  const [selectedTactics, setSelectedTactics] = useState<Tactic[]>(context.quarters.Q4.tactics || []);
  const [showDebrief, setShowDebrief] = useState(false);
  const [currentWildcard, setCurrentWildcard] = useState<EnhancedWildcardEvent | null>(null);
  const [showWildcardModal, setShowWildcardModal] = useState(false);

  const quarterBudget = Math.floor((context.totalBudget || 500000) / 4);
  const usedBudget = selectedTactics.reduce((sum, tactic) => sum + (tactic.cost || 0), 0);
  const canComplete = selectedTactics.length > 0 && usedBudget <= quarterBudget;

  const handleTriggerWildcard = useCallback(() => {
    const wildcard = getEnhancedWildcardForQuarter(context, 'Q4');
    if (!wildcard) return;
    setCurrentWildcard(wildcard);
    setShowWildcardModal(true);
    triggerWildcard('Q4', wildcard);
  }, [context, triggerWildcard]);

  useEffect(() => {
    if (!showWildcardModal && !currentWildcard && Math.random() > 0.6) {
      handleTriggerWildcard();
    }
  }, [currentWildcard, handleTriggerWildcard, showWildcardModal]);

  const handleAddTactic = (tactic: Tactic) => {
    if (selectedTactics.some((selected) => selected.id === tactic.id)) return;
    setSelectedTactics((current) => [...current, tactic]);
    addTactic('Q4', tactic);
  };

  const handleRemoveTactic = (tacticId: string) => {
    setSelectedTactics((current) => current.filter((tactic) => tactic.id !== tacticId));
    removeTactic('Q4', tacticId);
  };

  const specialActions = (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Quarter options</h2>
      <Button
        type="button"
        variant="outline"
        className="mt-3 w-full justify-start rounded-md border-slate-300 bg-white text-slate-800"
        onClick={handleTriggerWildcard}
        disabled={showWildcardModal}
      >
        <AlertTriangle className="mr-2 h-4 w-4" />
        Run final risk check
      </Button>
    </section>
  );

  return (
    <ImmersiveLayout title="Q4 Operating Plan" subtitle="Close the year with a defensible scorecard." quarter="Quarter 4">
      <QuarterOperatingConsole
        context={context}
        quarter="Q4"
        title="Make the final quarter count"
        subtitle="Prioritize the moves that strengthen the annual result, explain the tradeoff, and produce a useful final debrief."
        availableTactics={SAMPLE_TACTICS.slice(12, 18)}
        selectedTactics={selectedTactics}
        onAddTactic={handleAddTactic}
        onRemoveTactic={handleRemoveTactic}
        onCompleteQuarter={() => setShowDebrief(true)}
        canComplete={canComplete}
        completeLabel="Finalize annual plan"
        specialActions={specialActions}
      />

      {showWildcardModal && currentWildcard && (
        <WildcardModal
          wildcard={currentWildcard}
          isOpen={showWildcardModal}
          onChoose={(choiceId) => {
            const impact = calculateEnhancedWildcardImpact(currentWildcard, choiceId);
            respondToWildcard('Q4', currentWildcard, choiceId, impact);
            setShowWildcardModal(false);
          }}
          onClose={() => setShowWildcardModal(false)}
        />
      )}

      <EndOfQuarterDebrief
        isOpen={showDebrief}
        context={context}
        quarter="Q4"
        selectedTactics={selectedTactics}
        onConfirm={() => {
          void saveSimulationSnapshot(context, 'Q4', 'completed');
          setShowDebrief(false);
          completeQuarter('Q4');
          router.push('/sim/debrief');
        }}
      />
    </ImmersiveLayout>
  );
}

