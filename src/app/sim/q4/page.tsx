"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSimulation } from '@/hooks/useSimulation';
import { SAMPLE_TACTICS } from '@/lib/tactics';
import { Tactic } from '@/lib/simMachine';
import { ImmersiveLayout } from '@/components/simulation/ImmersiveLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { EnhancedKPIDashboard } from '@/components/simulation/EnhancedKPIDashboard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Megaphone, ArrowRight, Zap, Trophy } from 'lucide-react';
import { CMOMentor } from '@/components/simulation/CMOMentor';
import { WildcardModal } from '@/components/simulation/WildcardModal';
import { ConfettiEffect } from '@/components/simulation/ConfettiEffect';
import { getEnhancedWildcardForQuarter } from '@/lib/wildcardHelpers';
import { calculateEnhancedWildcardImpact, type EnhancedWildcardEvent } from '@/lib/enhancedWildcards';

export default function Q4Page() {
  const router = useRouter();
  const { context, addTactic, removeTactic, triggerWildcard, respondToWildcard, completeQuarter } = useSimulation();

  const [selectedTactics, setSelectedTactics] = useState<Tactic[]>(context.quarters.Q4.tactics || []);
  const [currentWildcard, setCurrentWildcard] = useState<EnhancedWildcardEvent | null>(null);
  const [showWildcardModal, setShowWildcardModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const quarterBudget = Math.floor((context?.totalBudget || 500000) / 4);
  const usedBudget = selectedTactics.reduce((sum: number, tactic: Tactic) => sum + (tactic.cost || 0), 0);
  const remainingBudget = quarterBudget - usedBudget;

  useEffect(() => {
    if (!showWildcardModal && !currentWildcard && Math.random() > 0.6) {
      handleTriggerWildcard();
    }
  }, []);

  const handleTriggerWildcard = () => {
    const wildcard = getEnhancedWildcardForQuarter(context, 'Q4');
    if (!wildcard) return;
    setCurrentWildcard(wildcard);
    setShowWildcardModal(true);
    if (triggerWildcard) triggerWildcard('Q4', wildcard);
  };

  const handleWildcardResponse = (choiceId: string) => {
    if (currentWildcard && respondToWildcard) {
      const impact = calculateEnhancedWildcardImpact(currentWildcard, choiceId);
      respondToWildcard('Q4', currentWildcard, choiceId, impact);
      setShowWildcardModal(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleAddTactic = (tactic: Tactic) => {
    if (!selectedTactics.find((t: Tactic) => t.id === tactic.id)) {
      const newTactics = [...selectedTactics, tactic];
      setSelectedTactics(newTactics);
      if (addTactic) addTactic('Q4', tactic);
    }
  };

  const handleRemoveTactic = (tacticId: string) => {
    const newTactics = selectedTactics.filter((t: Tactic) => t.id !== tacticId);
    setSelectedTactics(newTactics);
    if (removeTactic) removeTactic('Q4', tacticId);
  };

  const handleCompleteQuarter = () => {
    if (completeQuarter) completeQuarter('Q4');
    router.push('/sim/debrief');
  };

  const canComplete = selectedTactics.length > 0 && remainingBudget >= 0;

  return (
    <ImmersiveLayout
      title="Q4 Final Year-End Push"
      subtitle="The Grand Finale. Deploy your remaining budget and maximize results for the annual board review."
      quarter="Quarter 4"
    >
      <div className="space-y-10 max-w-7xl mx-auto pb-20">
        <EnhancedKPIDashboard 
          context={context} 
          quarter="Q4"
          selectedTactics={selectedTactics}
        />

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="border-primary/40 bg-primary/10 shadow-[0_0_50px_rgba(59,130,246,0.3)]">
              <div className="p-8 space-y-8">
                <div className="flex items-center gap-3 border-b border-primary/20 pb-4">
                  <Trophy className="h-8 w-8 text-amber-400" />
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Board Review</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                      <span className="text-blue-100/60">Final Momentum</span>
                      <span className={remainingBudget < 0 ? "text-red-400" : "text-primary italic"}>
                        {((usedBudget / quarterBudget) * 100).toFixed(0)}% Utilized
                      </span>
                    </div>
                    <div className="h-5 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-primary/20 shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((usedBudget / quarterBudget) * 100, 100)}%` }}
                        className={cn("h-full rounded-full transition-all duration-1000 ease-out", remainingBudget < 0 ? "bg-red-500" : "bg-gradient-to-r from-primary to-blue-400")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-6">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-100/40 mb-1">Reserve</p>
                      <p className={cn("text-xl font-black tabular-nums", remainingBudget < 0 ? "text-red-400" : "text-white")}>
                        ${remainingBudget.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-100/40 mb-1">Units</p>
                      <p className="text-xl font-black text-white tabular-nums">{selectedTactics.length}</p>
                    </div>
                  </div>
                </div>

                <CMOMentor 
                  selectedTactics={selectedTactics}
                  remainingBudget={remainingBudget}
                  currentQuarter="Q4"
                  context={context}
                />

                <Button
                  onClick={handleCompleteQuarter}
                  disabled={!canComplete}
                  className={cn(
                    "w-full py-10 text-2xl font-black rounded-3xl transition-all duration-700 uppercase tracking-widest",
                    canComplete 
                      ? "bg-primary text-white shadow-[0_0_50px_rgba(59,130,246,0.6)] hover:shadow-[0_0_80px_rgba(59,130,246,0.8)] hover:scale-[1.05] hover:-rotate-1" 
                      : "bg-white/5 text-white/5 cursor-not-allowed border-white/5"
                  )}
                >
                  Initiate Final Audit
                  <ArrowRight className="ml-3 h-8 w-8" />
                </Button>
              </div>
            </GlassCard>
            
            <motion.div
              animate={{ rotate: [0, 1, -1, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
            >
              <Button 
                className="w-full bg-white/5 border border-primary/30 text-white hover:bg-white/10 h-20 rounded-3xl font-black uppercase tracking-widest italic group"
                onClick={handleTriggerWildcard}
                disabled={showWildcardModal}
              >
                <Zap className="h-6 w-6 mr-3 text-primary group-hover:scale-150 transition-transform" />
                Q4 Wildcard Logic
              </Button>
            </motion.div>
          </div>

          <div className="lg:col-span-3">
            <Tabs defaultValue="available" className="w-full">
              <TabsList className="bg-[#0f172a]/50 border border-primary/20 p-2 rounded-3xl mb-10 overflow-hidden">
                <TabsTrigger value="available" className="px-16 py-4 data-[state=active]:bg-primary data-[state=active]:text-white rounded-2xl transition-all font-black uppercase italic tracking-widest text-sm">Strategic Inventory</TabsTrigger>
                <TabsTrigger value="active" className="px-16 py-4 data-[state=active]:bg-primary data-[state=active]:text-white rounded-2xl transition-all font-black uppercase italic tracking-widest text-sm text-white/20">Final Deployment ({selectedTactics.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="available" className="mt-0">
                <div className="grid md:grid-cols-2 gap-8">
                  {SAMPLE_TACTICS.slice(12, 18).map((tactic: Tactic) => {
                    const isSelected = selectedTactics.some(st => st.id === tactic.id);
                    return (
                      <GlassCard 
                        key={tactic.id} 
                        className={cn(
                          "group transition-all duration-700",
                          isSelected ? "border-primary/80 bg-primary/20 shadow-[0_0_30px_rgba(59,130,246,0.3)]" : "hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                        )}
                      >
                        <div className="p-10 space-y-8">
                          <div className="flex justify-between items-start border-b border-white/5 pb-6">
                            <div className="space-y-2">
                              <h4 className="text-3xl font-black text-white tracking-tighter leading-none">{tactic.name}</h4>
                              <p className="text-xs font-black uppercase tracking-[0.4em] text-primary/60">{tactic.category}</p>
                            </div>
                            {isSelected && <Badge className="bg-primary text-white font-black px-4 py-1 animate-pulse">DEPLOYED</Badge>}
                          </div>
                          
                          {(tactic as any).strategicRationale && (
                             <p className="text-lg text-blue-100/60 leading-relaxed font-medium italic opacity-80 group-hover:opacity-100 transition-opacity border-l-2 border-primary/30 pl-3">
                               {(tactic as any).strategicRationale}
                             </p>
                           )}

                          <div className="flex justify-between items-center pt-8 border-t border-white/5">
                            <div className="space-y-1">
                              <p className="text-xs text-blue-100/20 uppercase font-black italic tracking-[0.2em]">Final Call</p>
                              <p className="text-4xl font-black text-white tabular-nums tracking-tighter italic">${tactic.cost.toLocaleString()}</p>
                            </div>
                            <Button
                              onClick={() => handleAddTactic(tactic)}
                              disabled={isSelected}
                              className={cn(
                                "rounded-2xl px-12 h-16 font-black uppercase tracking-widest transition-all duration-500",
                                isSelected ? "bg-white/5 text-white/10" : "bg-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:scale-110"
                              )}
                            >
                              {isSelected ? 'LOCKED' : 'DEPLOY'}
                            </Button>
                          </div>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="active" className="mt-0">
                {selectedTactics.length === 0 ? (
                  <GlassCard className="p-60 text-center border-dashed border-primary/20 bg-transparent">
                    <motion.div
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Megaphone className="h-32 w-32 mx-auto text-primary mb-10" />
                      <p className="text-blue-100/10 font-black uppercase tracking-[1em] text-2xl italic">Operational Zero</p>
                    </motion.div>
                  </GlassCard>
                ) : (
                  <div className="space-y-6">
                    {selectedTactics.map(tactic => (
                      <GlassCard key={tactic.id} className="border-l-8 border-l-primary hover:bg-white/20 transition-colors">
                        <div className="p-8 flex justify-between items-center">
                          <div className="flex items-center gap-8">
                            <div className="w-20 h-20 rounded-3xl bg-primary/20 border border-primary/40 flex items-center justify-center font-black text-primary text-3xl italic shadow-[inset_0_0_20px_rgba(59,130,246,0.3)]">
                              {tactic.category.substring(0,2).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="text-2xl font-black text-white italic">{tactic.name}</h4>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-sm font-black text-primary uppercase italic tracking-widest tabular-nums">${tactic.cost.toLocaleString()}</span>
                                <span className="text-white/10 scale-150">•</span>
                                <span className="text-sm text-blue-100/30 font-black uppercase tracking-[0.2em]">{tactic.category}</span>
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            className="text-red-500 hover:bg-red-500/10 hover:text-red-400 rounded-2xl px-8 py-8 font-black uppercase tracking-widest text-sm"
                            onClick={() => handleRemoveTactic(tactic.id)}
                          >
                            RETRACT UNIT
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
      </AnimatePresence>
      <ConfettiEffect trigger={showConfetti} />
    </ImmersiveLayout>
  );
}
