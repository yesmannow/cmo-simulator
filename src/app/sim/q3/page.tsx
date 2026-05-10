"use client";

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Target } from 'lucide-react';
import { useSimulation } from '@/hooks/useSimulation';
import { getTacticsForQuarter } from '@/lib/tactics';
import type { Tactic } from '@/lib/simMachine';
import { calculateEnhancedWildcardImpact, type EnhancedWildcardEvent } from '@/lib/enhancedWildcards';
import { getEnhancedWildcardForQuarter } from '@/lib/wildcardHelpers';
import { calculateBigBetOutcome, getRandomBigBets, type BigBetOption } from '@/lib/talentMarket';
import { ImmersiveLayout } from '@/components/simulation/ImmersiveLayout';
import { QuarterOperatingConsole } from '@/components/simulation/QuarterOperatingConsole';
import { WildcardModal } from '@/components/simulation/WildcardModal';
import { BigBetModal } from '@/components/simulation/BigBetModal';
import { Button } from '@/components/ui/button';

export default function Q3Page() {
  const router = useRouter();
  const { context, addTactic, removeTactic, triggerWildcard, respondToWildcard, makeBigBet } = useSimulation();
  const [selectedTactics, setSelectedTactics] = useState<Tactic[]>(context.quarters.Q3.tactics || []);
  const [currentWildcard, setCurrentWildcard] = useState<EnhancedWildcardEvent | null>(null);
  const [showWildcardModal, setShowWildcardModal] = useState(false);
  const [availableBigBets, setAvailableBigBets] = useState<BigBetOption[]>([]);
  const [showBigBetModal, setShowBigBetModal] = useState(false);

  const quarterBudget = Math.floor((context.totalBudget || 500000) / 4);
  const usedBudget = selectedTactics.reduce((sum, tactic) => sum + (tactic.cost || 0), 0);
  const remainingBudget = quarterBudget - usedBudget;
  const canComplete = selectedTactics.length > 0 && usedBudget <= quarterBudget;

  const handleTriggerWildcard = useCallback(() => {
    const wildcard = getEnhancedWildcardForQuarter(context, 'Q3');
    if (!wildcard) return;
    setCurrentWildcard(wildcard);
    setShowWildcardModal(true);
    triggerWildcard('Q3', wildcard);
  }, [context, triggerWildcard]);

  useEffect(() => {
    setAvailableBigBets(getRandomBigBets(3));
  }, []);

  useEffect(() => {
    if (!showWildcardModal && !currentWildcard && Math.random() > 0.8) {
      handleTriggerWildcard();
    }
  }, [currentWildcard, handleTriggerWildcard, showWildcardModal]);

  const handleAddTactic = (tactic: Tactic) => {
    if (selectedTactics.some((selected) => selected.id === tactic.id)) return;
    setSelectedTactics((current) => [...current, tactic]);
    addTactic('Q3', tactic);
  };

  const handleRemoveTactic = (tacticId: string) => {
    setSelectedTactics((current) => current.filter((tactic) => tactic.id !== tacticId));
    removeTactic('Q3', tacticId);
  };

  const specialActions = (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Quarter options</h2>
      <div className="mt-3 grid gap-2">
        <Button
          type="button"
          variant="outline"
          className="justify-start rounded-md border-slate-300 bg-white text-slate-800"
          onClick={handleTriggerWildcard}
          disabled={showWildcardModal}
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Review market risk
        </Button>
        <Button
          type="button"
          variant="outline"
          className="justify-start rounded-md border-slate-300 bg-white text-slate-800"
          onClick={() => setShowBigBetModal(true)}
          disabled={!!context.quarters.Q3.bigBetMade}
        >
          <Target className="mr-2 h-4 w-4" />
          {context.quarters.Q3.bigBetMade ? 'Strategic bet selected' : 'Evaluate strategic bet'}
        </Button>
      </div>
    </section>
  );

  const focusSelectedPlan = () => {
    document.getElementById('selected-plan')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <ImmersiveLayout title="Q3 Operating Plan" subtitle="Optimize from real signals." quarter="Quarter 3" hideHeader>
      <QuarterOperatingConsole
        context={context}
        quarter="Q3"
        title="Rebalance the mix before the final push"
        subtitle="Use the third quarter to double down, correct saturation, or make a bigger strategic bet before the year closes."
        availableTactics={getTacticsForQuarter('Q3')}
        selectedTactics={selectedTactics}
        onAddTactic={handleAddTactic}
        onRemoveTactic={handleRemoveTactic}
        onCompleteQuarter={() => router.push('/sim/q3/debrief')}
        canComplete={canComplete}
        completeLabel="Finalize Q3 plan"
        specialActions={specialActions}
      />

      {showWildcardModal && currentWildcard && (
        <WildcardModal
          wildcard={currentWildcard}
          isOpen={showWildcardModal}
          onChoose={(choiceId) => {
            const impact = calculateEnhancedWildcardImpact(currentWildcard, choiceId);
            respondToWildcard('Q3', currentWildcard, choiceId, impact);
            setShowWildcardModal(false);
            focusSelectedPlan();
          }}
          onClose={() => {
            setShowWildcardModal(false);
            focusSelectedPlan();
          }}
        />
      )}

      {showBigBetModal && (
        <BigBetModal
          bigBets={availableBigBets}
          isOpen={showBigBetModal}
          onClose={() => setShowBigBetModal(false)}
          onSelect={(bet) => {
            const outcome = calculateBigBetOutcome(bet, context, false);
            makeBigBet('Q3', bet, { success: outcome.success, actualImpact: outcome.actualImpact });
            setShowBigBetModal(false);
            focusSelectedPlan();
          }}
          availableBudget={remainingBudget}
          currentKPIs={context.kpis}
        />
      )}

    </ImmersiveLayout>
  );
}
