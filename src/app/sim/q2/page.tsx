"use client";

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Users } from 'lucide-react';
import { useSimulation } from '@/hooks/useSimulation';
import { SAMPLE_TACTICS } from '@/lib/tactics';
import type { Tactic } from '@/lib/simMachine';
import { calculateEnhancedWildcardImpact, type EnhancedWildcardEvent } from '@/lib/enhancedWildcards';
import { getEnhancedWildcardForQuarter } from '@/lib/wildcardHelpers';
import { getRandomTalentPool, type TalentCandidate } from '@/lib/talentMarket';
import { ImmersiveLayout } from '@/components/simulation/ImmersiveLayout';
import { QuarterOperatingConsole } from '@/components/simulation/QuarterOperatingConsole';
import { EndOfQuarterDebrief } from '@/components/simulation/EndOfQuarterDebrief';
import { TalentMarketModal } from '@/components/simulation/TalentMarketModal';
import { WildcardModal } from '@/components/simulation/WildcardModal';
import { Button } from '@/components/ui/button';
import { saveSimulationSnapshot } from '@/lib/saveSimulationSnapshot';

export default function Q2Page() {
  const router = useRouter();
  const { context, addTactic, removeTactic, triggerWildcard, respondToWildcard, completeQuarter } = useSimulation();
  const [selectedTactics, setSelectedTactics] = useState<Tactic[]>(context.quarters.Q2.tactics || []);
  const [showDebrief, setShowDebrief] = useState(false);
  const [currentWildcard, setCurrentWildcard] = useState<EnhancedWildcardEvent | null>(null);
  const [showWildcardModal, setShowWildcardModal] = useState(false);
  const [talentCandidates, setTalentCandidates] = useState<TalentCandidate[]>([]);
  const [showTalentMarket, setShowTalentMarket] = useState(false);
  const [hasTriggeredTalentMarket, setHasTriggeredTalentMarket] = useState(false);

  const quarterBudget = Math.floor((context.totalBudget || 500000) / 4);
  const usedBudget = selectedTactics.reduce((sum, tactic) => sum + (tactic.cost || 0), 0);
  const remainingBudget = quarterBudget - usedBudget;
  const canComplete = selectedTactics.length > 0 && usedBudget <= quarterBudget;

  const handleTriggerWildcard = useCallback(() => {
    const wildcard = getEnhancedWildcardForQuarter(context, 'Q2');
    if (!wildcard) return;
    setCurrentWildcard(wildcard);
    setShowWildcardModal(true);
    triggerWildcard('Q2', wildcard);
  }, [context, triggerWildcard]);

  useEffect(() => {
    if (!showWildcardModal && !currentWildcard && Math.random() > 0.7) {
      handleTriggerWildcard();
    }
  }, [currentWildcard, handleTriggerWildcard, showWildcardModal]);

  const handleAddTactic = (tactic: Tactic) => {
    if (selectedTactics.some((selected) => selected.id === tactic.id)) return;
    setSelectedTactics((current) => [...current, tactic]);
    addTactic('Q2', tactic);
  };

  const handleRemoveTactic = (tacticId: string) => {
    setSelectedTactics((current) => current.filter((tactic) => tactic.id !== tacticId));
    removeTactic('Q2', tacticId);
  };

  const specialActions = (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Quarter options</h2>
      <div className="mt-3 grid gap-2">
        <Button
          type="button"
          variant="outline"
          className="justify-start rounded-md border-slate-300 bg-white text-slate-800"
          onClick={() => {
            setTalentCandidates(getRandomTalentPool(3));
            setShowTalentMarket(true);
            setHasTriggeredTalentMarket(true);
          }}
          disabled={hasTriggeredTalentMarket}
        >
          <Users className="mr-2 h-4 w-4" />
          Review talent options
        </Button>
        <Button
          type="button"
          variant="outline"
          className="justify-start rounded-md border-slate-300 bg-white text-slate-800"
          onClick={handleTriggerWildcard}
          disabled={showWildcardModal}
        >
          <Briefcase className="mr-2 h-4 w-4" />
          Open market briefing
        </Button>
      </div>
    </section>
  );

  return (
    <ImmersiveLayout title="Q2 Operating Plan" subtitle="Scale with discipline." quarter="Quarter 2" hideHeader>
      <QuarterOperatingConsole
        context={context}
        quarter="Q2"
        title="Scale what is working without losing control"
        subtitle="Use second-quarter budget to increase reach, handle market pressure, and avoid overcommitting the team."
        availableTactics={SAMPLE_TACTICS.slice(4, 10)}
        selectedTactics={selectedTactics}
        onAddTactic={handleAddTactic}
        onRemoveTactic={handleRemoveTactic}
        onCompleteQuarter={() => setShowDebrief(true)}
        canComplete={canComplete}
        completeLabel="Finalize Q2 plan"
        specialActions={specialActions}
      />

      {showWildcardModal && currentWildcard && (
        <WildcardModal
          wildcard={currentWildcard}
          isOpen={showWildcardModal}
          onChoose={(choiceId) => {
            const impact = calculateEnhancedWildcardImpact(currentWildcard, choiceId);
            respondToWildcard('Q2', currentWildcard, choiceId, impact);
            setShowWildcardModal(false);
          }}
          onClose={() => setShowWildcardModal(false)}
        />
      )}

      {showTalentMarket && (
        <TalentMarketModal
          candidates={talentCandidates}
          isOpen={showTalentMarket}
          onHire={() => setShowTalentMarket(false)}
          availableBudget={remainingBudget}
          onClose={() => setShowTalentMarket(false)}
        />
      )}

      <EndOfQuarterDebrief
        isOpen={showDebrief}
        context={context}
        quarter="Q2"
        selectedTactics={selectedTactics}
        onConfirm={() => {
          void saveSimulationSnapshot(context, 'Q2', 'in_progress');
          setShowDebrief(false);
          completeQuarter('Q2');
          router.push('/sim/q3');
        }}
      />
    </ImmersiveLayout>
  );
}
