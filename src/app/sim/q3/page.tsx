"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSimulation } from '@/hooks/useSimulation';
import { SAMPLE_TACTICS, EnrichedTactic } from '@/lib/tactics';
import { TacticCard } from '@/components/simulation/matrix/TacticCard';
import { Tactic } from '@/lib/simMachine';
import { ImmersiveLayout } from '@/components/simulation/ImmersiveLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { EnhancedKPIDashboard } from '@/components/simulation/EnhancedKPIDashboard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Megaphone, ArrowRight, Zap } from 'lucide-react';
import { CMOMentor } from '@/components/simulation/CMOMentor';
import { ExecutivePressure } from '@/components/simulation/ExecutivePressure';
import { EndOfQuarterDebrief } from '@/components/simulation/EndOfQuarterDebrief';
import { WildcardModal } from '@/components/simulation/WildcardModal';
import { ConfettiEffect } from '@/components/simulation/ConfettiEffect';
import { getEnhancedWildcardForQuarter } from '@/lib/wildcardHelpers';
import { calculateEnhancedWildcardImpact, type EnhancedWildcardEvent } from '@/lib/enhancedWildcards';
import { BigBetModal } from '@/components/simulation/BigBetModal';
import { getRandomBigBets, BigBetOption, calculateBigBetOutcome } from '@/lib/talentMarket';
import { InfoTooltip } from '@/components/ui/InfoTooltip';

export default function Q3Page() {
  const router = useRouter();
  const { context, addTactic, removeTactic, triggerWildcard, respondToWildcard, completeQuarter, makeBigBet } = useSimulation();

  const [selectedTactics, setSelectedTactics] = useState<Tactic[]>(context.quarters.Q3.tactics || []);
  const [currentWildcard, setCurrentWildcard] = useState<EnhancedWildcardEvent | null>(null);
  const [showWildcardModal, setShowWildcardModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showBigBetModal, setShowBigBetModal] = useState(false);
  const [availableBigBets, setAvailableBigBets] = useState<BigBetOption[]>([]);
  const [showDebrief, setShowDebrief] = useState(false);

  const quarterBudget = Math.floor((context?.totalBudget || 500000) / 4);
  const usedBudget = selectedTactics.reduce((sum: number, tactic: Tactic) => sum + (tactic.cost || 0), 0);
  const remainingBudget = quarterBudget - usedBudget;

  useEffect(() => {
    // Generate big bets once
    setAvailableBigBets(getRandomBigBets(3));
    
    if (!showWildcardModal && !currentWildcard && Math.random() > 0.8) {
      handleTriggerWildcard();
    }
  }, []);

  const handleTriggerWildcard = () => {
    const wildcard = getEnhancedWildcardForQuarter(context, 'Q3');
    if (!wildcard) return;
    setCurrentWildcard(wildcard);
    setShowWildcardModal(true);
    if (triggerWildcard) triggerWildcard('Q3', wildcard);
  };

  const handleWildcardResponse = (choiceId: string) => {
    if (currentWildcard && respondToWildcard) {
      const impact = calculateEnhancedWildcardImpact(currentWildcard, choiceId);
      respondToWildcard('Q3', currentWildcard, choiceId, impact);
      setShowWildcardModal(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleAddTactic = (tactic: Tactic) => {
    if (!selectedTactics.find((t: Tactic) => t.id === tactic.id)) {
      const newTactics = [...selectedTactics, tactic];
      setSelectedTactics(newTactics);
      if (addTactic) addTactic('Q3', tactic);
    }
  };

  const handleRemoveTactic = (tacticId: string) => {
    const newTactics = selectedTactics.filter((t: Tactic) => t.id !== tacticId);
    setSelectedTactics(newTactics);
    if (removeTactic) removeTactic('Q3', tacticId);
  };

  const handleCompleteQuarter = () => {
    setShowDebrief(true);
  };

  const canComplete = selectedTactics.length > 0 && remainingBudget >= 0;

  return (
    <ImmersiveLayout
      title="Q3 Performance Optimization"
      subtitle="The turning point of the year. Optimize your mix based on performance data and market feedback."
      quarter="Quarter 3"
    >
      <div className="space-y-10 max-w-7xl mx-auto pb-20">
        <ExecutivePressure currentQuarter="Q3" context={context} />
        
        <EnhancedKPIDashboard 
          context={context} 
          quarter="Q3"
          selectedTactics={selectedTactics}
        />

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="border-primary/30">
              <div className="p-6 space-y-8">
                <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4 flex items-center justify-between">
                  Efficiency Score
                  <InfoTooltip iconOnly position="left" content="Real-time monitoring of your budget burn rate and tactical depth." />
                </h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-blue-100/40">
                      <span>Budget Utilization</span>
                      <span className={remainingBudget < 0 ? "text-red-400" : "text-primary"}>
                        {((usedBudget / quarterBudget) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((usedBudget / quarterBudget) * 100, 100)}%` }}
                        className={cn("h-full rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-500", remainingBudget < 0 ? "bg-red-500" : "bg-primary")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-tighter text-blue-100/40 mb-1 text-center">Remaining</p>
                      <p className={cn("text-lg font-black text-center", remainingBudget < 0 ? "text-red-400" : "text-white")}>
                        ${remainingBudget.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                      <p className="text-[10px] font-black uppercase tracking-tighter text-blue-100/40 mb-1">Active</p>
                      <p className="text-lg font-black text-white">{selectedTactics.length} Units</p>
                    </div>
                  </div>
                </div>

                <CMOMentor 
                  selectedTactics={selectedTactics}
                  remainingBudget={remainingBudget}
                  currentQuarter="Q3"
                  context={context}
                />

                <Button
                  onClick={handleCompleteQuarter}
                  disabled={!canComplete}
                  className={cn(
                    "w-full py-8 text-lg font-black rounded-2xl transition-all duration-500",
                    canComplete 
                      ? "bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105" 
                      : "bg-white/5 text-blue-100/10 cursor-not-allowed"
                  )}
                >
                  Confirm Q3 Operations
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </div>
            </GlassCard>
            
            <div className="flex flex-col gap-3">
              <Button 
                className="w-full bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 h-16 rounded-2xl font-bold"
                onClick={handleTriggerWildcard}
                disabled={showWildcardModal}
              >
                <Zap className="h-5 w-5 mr-3" />
                Analyze Risks
              </Button>
              <Button 
                className={cn(
                   "w-full border h-16 rounded-2xl font-bold",
                   context.quarters.Q3.bigBetMade 
                     ? "bg-purple-500/10 border-purple-500/20 text-purple-400 cursor-not-allowed" 
                     : "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20 hover:scale-[1.02] hover:bg-purple-500 transition-all"
                )}
                onClick={() => setShowBigBetModal(true)}
                disabled={!!context.quarters.Q3.bigBetMade}
              >
                {context.quarters.Q3.bigBetMade ? 'Executive Action Taken' : 'Executive Action'}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <Tabs defaultValue="available" className="w-full">
              <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl mb-8">
                <TabsTrigger value="available" className="px-12 py-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all font-bold">Strategy Matrix</TabsTrigger>
                <TabsTrigger value="active" className="px-12 py-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all font-bold">Deployed Tacticals</TabsTrigger>
              </TabsList>

              <TabsContent value="available" className="mt-0 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {SAMPLE_TACTICS.slice(8, 14).map((tactic: unknown) => {
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
                  <GlassCard className="p-40 text-center border-dashed">
                    <Megaphone className="h-20 w-20 mx-auto text-white/5 mb-6" />
                    <p className="text-blue-100/20 font-black uppercase tracking-[0.3em] text-lg italic">Strategic Silence</p>
                  </GlassCard>
                ) : (
                  <div className="space-y-4">
                    {selectedTactics.map(tactic => (
                      <GlassCard key={tactic.id} className="border-l-4 border-l-primary hover:bg-white/10">
                        <div className="p-6 flex justify-between items-center">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-xl italic shadow-inner">
                              {tactic.category.substring(0,2).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="text-xl font-black text-white">{tactic.name}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs font-black text-primary/80 uppercase tracking-widest">${tactic.cost.toLocaleString()}</span>
                                <span className="text-white/20 text-xs">•</span>
                                <span className="text-xs text-blue-100/40 font-bold uppercase tracking-widest">{tactic.category}</span>
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            className="text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-full px-6 font-bold"
                            onClick={() => handleRemoveTactic(tactic.id)}
                          >
                            TERMINATE
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

      <AnimatePresence>
        {showWildcardModal && currentWildcard && (
          <WildcardModal
             wildcard={currentWildcard}
             isOpen={showWildcardModal}
             onChoose={handleWildcardResponse}
             onClose={() => setShowWildcardModal(false)}
          />
        )}
        {showBigBetModal && (
          <BigBetModal
            bigBets={availableBigBets}
            isOpen={showBigBetModal}
            onClose={() => setShowBigBetModal(false)}
            onSelect={(bet) => {
              const outcome = calculateBigBetOutcome(bet, context, false);
              if (makeBigBet) makeBigBet('Q3', bet, { success: outcome.success, actualImpact: outcome.actualImpact });
              setShowBigBetModal(false);
            }}
            availableBudget={remainingBudget}
            currentKPIs={context.kpis}
          />
        )}
      </AnimatePresence>
      <ConfettiEffect trigger={showConfetti} />
      <EndOfQuarterDebrief
        isOpen={showDebrief}
        context={context}
        quarter="Q3"
        selectedTactics={selectedTactics}
        onConfirm={() => {
          setShowDebrief(false);
          if (completeQuarter) completeQuarter('Q3');
          router.push('/sim/q4');
        }}
      />
    </ImmersiveLayout>
  );
}
