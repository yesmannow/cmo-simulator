"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSimulation } from '@/hooks/useSimulation';
import { SAMPLE_TACTICS, EnrichedTactic } from '@/lib/tactics';
import { TacticCard } from '@/components/simulation/matrix/TacticCard';
import { Tactic } from '@/lib/simMachine';
import { ImmersiveLayout } from '@/components/simulation/ImmersiveLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { EnhancedKPIDashboard } from '@/components/simulation/EnhancedKPIDashboard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, ArrowRight, Zap, Users, Briefcase } from 'lucide-react';
import { CMOMentor } from '@/components/simulation/CMOMentor';
import { ExecutivePressure } from '@/components/simulation/ExecutivePressure';
import { EndOfQuarterDebrief } from '@/components/simulation/EndOfQuarterDebrief';
import { WildcardModal } from '@/components/simulation/WildcardModal';
import { TalentMarketModal } from '@/components/simulation/TalentMarketModal';
import { ConfettiEffect } from '@/components/simulation/ConfettiEffect';
import { getRandomTalentPool } from '@/lib/talentMarket';
import { TalentCandidate } from '@/lib/talentMarket';
import { getEnhancedWildcardForQuarter } from '@/lib/wildcardHelpers';
import { calculateEnhancedWildcardImpact, type EnhancedWildcardEvent } from '@/lib/enhancedWildcards';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { saveSimulationSnapshot } from '@/lib/saveSimulationSnapshot';

export default function Q2Page() {
  const router = useRouter();
  const { context, addTactic, removeTactic, triggerWildcard, respondToWildcard, completeQuarter } = useSimulation();

  const [selectedTactics, setSelectedTactics] = useState<Tactic[]>(context.quarters.Q2.tactics || []);
  const [showDebrief, setShowDebrief] = useState(false);
  const [currentWildcard, setCurrentWildcard] = useState<EnhancedWildcardEvent | null>(null);
  const [showWildcardModal, setShowWildcardModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [talentCandidates, setTalentCandidates] = useState<TalentCandidate[]>([]);
  const [showTalentMarket, setShowTalentMarket] = useState(false);
  const [hasTriggeredTalentMarket, setHasTriggeredTalentMarket] = useState(false);

  const quarterBudget = Math.floor((context?.totalBudget || 500000) / 4);
  const usedBudget = selectedTactics.reduce((sum: number, tactic: Tactic) => sum + (tactic.cost || 0), 0);
  const remainingBudget = quarterBudget - usedBudget;

  const handleTriggerWildcard = useCallback(() => {
    const wildcard = getEnhancedWildcardForQuarter(context, 'Q2');
    if (!wildcard) return;
    setCurrentWildcard(wildcard);
    setShowWildcardModal(true);
    if (triggerWildcard) triggerWildcard('Q2', wildcard);
  }, [context, triggerWildcard]);

  useEffect(() => {
    if (!showWildcardModal && !currentWildcard && Math.random() > 0.7) {
      handleTriggerWildcard();
    }
  }, [currentWildcard, handleTriggerWildcard, showWildcardModal]);

  const handleWildcardResponse = (choiceId: string) => {
    if (currentWildcard && respondToWildcard) {
      const impact = calculateEnhancedWildcardImpact(currentWildcard, choiceId);
      respondToWildcard('Q2', currentWildcard, choiceId, impact);
      setShowWildcardModal(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleOpenTalentMarket = () => {
    setTalentCandidates(getRandomTalentPool(3));
    setShowTalentMarket(true);
    setHasTriggeredTalentMarket(true);
  };

  const handleAddTactic = (tactic: Tactic) => {
    if (!selectedTactics.find((t: Tactic) => t.id === tactic.id)) {
      const newTactics = [...selectedTactics, tactic];
      setSelectedTactics(newTactics);
      if (addTactic) addTactic('Q2', tactic);
    }
  };

  const handleRemoveTactic = (tacticId: string) => {
    const newTactics = selectedTactics.filter((t: Tactic) => t.id !== tacticId);
    setSelectedTactics(newTactics);
    if (removeTactic) removeTactic('Q2', tacticId);
  };

  const handleCompleteQuarter = () => {
    setShowDebrief(true);
  };

  const canComplete = selectedTactics.length > 0 && remainingBudget >= 0;

  return (
    <ImmersiveLayout
      title="Q2 Campaign Expansion"
      subtitle="Scaling operations and responding to market shifts. Quality execution is paramount this quarter."
      quarter="Quarter 2"
    >
      <div className="space-y-10 max-w-7xl mx-auto pb-20">
        <ExecutivePressure currentQuarter="Q2" context={context} />
        
        <EnhancedKPIDashboard 
          context={context} 
          quarter="Q2"
          selectedTactics={selectedTactics}
        />

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Action Center Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="border-primary/20 bg-primary/5">
              <div className="p-6 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Strategic Actions
                  </div>
                  <InfoTooltip iconOnly position="left" content="Key decisions, AI advice, and special options available this quarter." />
                </h3>
                
                <CMOMentor 
                  selectedTactics={selectedTactics}
                  remainingBudget={remainingBudget}
                  currentQuarter="Q2"
                  context={context}
                />

                <div className="space-y-4">
                  <Button 
                    className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white justify-start gap-3 h-14"
                    onClick={handleOpenTalentMarket}
                    disabled={hasTriggeredTalentMarket}
                  >
                    <Users className="h-5 w-5 text-blue-400" />
                    <div className="text-left">
                      <p className="text-sm font-bold">Acquire Talent</p>
                      <p className="text-[10px] text-blue-200/40 uppercase">Boost team morale</p>
                    </div>
                  </Button>

                  <Button 
                    className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white justify-start gap-3 h-14"
                    onClick={handleTriggerWildcard}
                    disabled={showWildcardModal}
                  >
                    <Briefcase className="h-5 w-5 text-amber-400" />
                    <div className="text-left">
                      <p className="text-sm font-bold">Executive Briefing</p>
                      <p className="text-[10px] text-blue-200/40 uppercase">Market Intelligence</p>
                    </div>
                  </Button>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="border-primary/30">
              <div className="p-6 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center justify-between">
                  Resource Allocation
                  <InfoTooltip iconOnly position="left" content="Monitor your budget burn rate to ensure you don't over-extend." />
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                      <span className="text-blue-200/60">Budget Depth</span>
                      <span className={remainingBudget < 0 ? "text-red-400" : "text-green-400"}>
                        {((usedBudget / quarterBudget) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((usedBudget / quarterBudget) * 100, 100)}%` }}
                        className={cn("h-full", remainingBudget < 0 ? "bg-red-500" : "bg-primary")}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Button
                    onClick={handleCompleteQuarter}
                    disabled={!canComplete}
                    className={cn(
                      "w-full py-6 font-black rounded-xl",
                      canComplete ? "bg-primary text-white" : "bg-white/5 text-blue-200/20"
                    )}
                  >
                    Seal Q2 Strategy
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Main Deployment Matrix */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="available" className="w-full">
              <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl mb-6">
                <TabsTrigger value="available" className="px-8 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all">Deployment Matrix</TabsTrigger>
                <TabsTrigger value="active" className="px-8 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all">Active Tactics ({selectedTactics.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="available" className="space-y-6 mt-0">
                <div className="grid md:grid-cols-2 gap-4">
                  {SAMPLE_TACTICS.slice(4, 10).map((tactic: unknown) => {
                    const t = tactic as Tactic;
                    const isSelected = selectedTactics.some((st: Tactic) => st.id === t.id);
                    return (
                      <TacticCard 
                        key={t.id}
                        tactic={t as EnrichedTactic}
                        isSelected={isSelected}
                        onAdd={() => handleAddTactic(t)}
                      />
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="active" className="mt-0">
                {selectedTactics.length === 0 ? (
                  <GlassCard className="p-20 text-center">
                    <Megaphone className="h-16 w-16 mx-auto text-white/5 mb-4" />
                    <p className="text-blue-100/30 font-bold uppercase tracking-widest text-sm">No Tactical Units Deployed</p>
                  </GlassCard>
                ) : (
                  <div className="space-y-3">
                    {selectedTactics.map(tactic => (
                      <GlassCard key={tactic.id} className="border-l-4 border-primary">
                        <div className="p-5 flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary text-xs italic">
                              {tactic.category.substring(0,2).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-bold text-white">{tactic.name}</h4>
                              <p className="text-[10px] text-blue-100/40 font-bold uppercase">${tactic.cost.toLocaleString()} • Q2 Execution</p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            className="text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-full"
                            onClick={() => handleRemoveTactic(tactic.id)}
                          >
                            Decommission
                          </Button>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Specialty Modals */}
      <AnimatePresence>
        {showWildcardModal && currentWildcard && (
          <WildcardModal
             wildcard={currentWildcard}
             isOpen={showWildcardModal}
             onChoose={handleWildcardResponse}
             onClose={() => setShowWildcardModal(false)}
          />
        )}
        {showTalentMarket && (
          <TalentMarketModal
            candidates={talentCandidates}
            isOpen={showTalentMarket}
            onHire={(_candidate) => {
              // Logic for hiring talent
              setShowTalentMarket(false);
            }}
            availableBudget={remainingBudget}
            onClose={() => setShowTalentMarket(false)}
          />
        )}
      </AnimatePresence>
      <ConfettiEffect trigger={showConfetti} />
      <EndOfQuarterDebrief
        isOpen={showDebrief}
        context={context}
        quarter="Q2"
        selectedTactics={selectedTactics}
        onConfirm={() => {
          void saveSimulationSnapshot(context, 'Q2', 'in_progress');
          setShowDebrief(false);
          if (completeQuarter) completeQuarter('Q2');
          router.push('/sim/q3');
        }}
      />
    </ImmersiveLayout>
  );
}
