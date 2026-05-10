"use client";

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Users } from 'lucide-react';
import { useSimulation } from '@/hooks/useSimulation';
import { getTacticsForQuarter } from '@/lib/tactics';
import type { Tactic } from '@/lib/simMachine';
import { calculateEnhancedWildcardImpact, type EnhancedWildcardEvent } from '@/lib/enhancedWildcards';
import { getEnhancedWildcardForQuarter } from '@/lib/wildcardHelpers';
import { getRandomTalentPool, type TalentCandidate } from '@/lib/talentMarket';
import { ImmersiveLayout } from '@/components/simulation/ImmersiveLayout';
import { QuarterOperatingConsole } from '@/components/simulation/QuarterOperatingConsole';
import { TalentMarketModal } from '@/components/simulation/TalentMarketModal';
import { WildcardModal } from '@/components/simulation/WildcardModal';
import { Button } from '@/components/ui/button';
import { MobileSheet, MobileSheetContent, MobileSheetDescription, MobileSheetDismissButton, MobileSheetHeader, MobileSheetTitle } from '@/components/ui/mobile-sheet';

export default function Q2Page() {
  const router = useRouter();
  const { context, addTactic, removeTactic, triggerWildcard, respondToWildcard } = useSimulation();
  const [selectedTactics, setSelectedTactics] = useState<Tactic[]>(context.quarters.Q2.tactics || []);
  const [currentWildcard, setCurrentWildcard] = useState<EnhancedWildcardEvent | null>(null);
  const [showWildcardModal, setShowWildcardModal] = useState(false);
  const [talentCandidates, setTalentCandidates] = useState<TalentCandidate[]>([]);
  const [showTalentMarket, setShowTalentMarket] = useState(false);
  const [hasTriggeredTalentMarket, setHasTriggeredTalentMarket] = useState(false);
  const [showOptionsPrompt, setShowOptionsPrompt] = useState(false);

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

  const openTalentOptions = () => {
    setTalentCandidates(getRandomTalentPool(3));
    setShowTalentMarket(true);
    setHasTriggeredTalentMarket(true);
  };

  const focusSelectedPlan = () => {
    document.getElementById('selected-plan')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (selectedTactics.length === 0) {
      setShowOptionsPrompt(true);
    }
  }, [selectedTactics.length]);

  const specialActions = (
    <section id="quarter-options" className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Quarter options</h2>
      <div className="mt-3 grid gap-2">
        <Button
          type="button"
          variant="outline"
          className="justify-start rounded-md border-slate-300 bg-white text-slate-800"
          onClick={openTalentOptions}
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
        availableTactics={getTacticsForQuarter('Q2')}
        selectedTactics={selectedTactics}
        onAddTactic={handleAddTactic}
        onRemoveTactic={handleRemoveTactic}
        onCompleteQuarter={() => router.push('/sim/q2/debrief')}
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
            focusSelectedPlan();
          }}
          onClose={() => {
            setShowWildcardModal(false);
            focusSelectedPlan();
          }}
        />
      )}

      {showTalentMarket && (
        <TalentMarketModal
          candidates={talentCandidates}
          isOpen={showTalentMarket}
          onHire={() => {
            setShowTalentMarket(false);
            focusSelectedPlan();
          }}
          availableBudget={remainingBudget}
          onClose={() => {
            setShowTalentMarket(false);
            focusSelectedPlan();
          }}
        />
      )}

      <MobileSheet open={showOptionsPrompt} onOpenChange={setShowOptionsPrompt}>
        <MobileSheetContent className="max-h-[72vh]">
          <MobileSheetHeader>
            <div>
              <MobileSheetTitle>Quarter options available</MobileSheetTitle>
              <MobileSheetDescription>
                Want to use optional actions now, or continue with tactic planning first?
              </MobileSheetDescription>
            </div>
            <MobileSheetDismissButton />
          </MobileSheetHeader>
          <div className="space-y-2 px-5 pb-[calc(env(safe-area-inset-bottom)+18px)]">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start rounded-xl border-slate-300 bg-white text-slate-800"
              onClick={() => {
                setShowOptionsPrompt(false);
                openTalentOptions();
              }}
              disabled={hasTriggeredTalentMarket}
            >
              <Users className="mr-2 h-4 w-4" />
              Use talent options
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start rounded-xl border-slate-300 bg-white text-slate-800"
              onClick={() => {
                setShowOptionsPrompt(false);
                handleTriggerWildcard();
              }}
              disabled={showWildcardModal}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Open market briefing
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-slate-600 hover:bg-slate-100"
              onClick={() => {
                setShowOptionsPrompt(false);
                document.getElementById('quarter-options')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            >
              Show options and continue planning
            </Button>
          </div>
        </MobileSheetContent>
      </MobileSheet>
    </ImmersiveLayout>
  );
}
