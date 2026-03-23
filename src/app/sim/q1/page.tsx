"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
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
import { motion } from 'framer-motion';
import { Target, Megaphone, ArrowRight } from 'lucide-react';
import { CMOMentor } from '@/components/simulation/CMOMentor';
import { ExecutivePressure } from '@/components/simulation/ExecutivePressure';
import { EndOfQuarterDebrief } from '@/components/simulation/EndOfQuarterDebrief';
import { ConfettiEffect } from '@/components/simulation/ConfettiEffect';
import { InfoTooltip } from '@/components/ui/InfoTooltip';

interface AllocationItem {
  id: string;
  name: string;
  budgetAmount: number;
  timeAmount: number;
  color: string;
}

export default function Q1Page() {
  const router = useRouter();
  const { context, addTactic, removeTactic, completeQuarter } = useSimulation();

  const [selectedTactics, setSelectedTactics] = useState<Tactic[]>([]);
  const [showDebrief, setShowDebrief] = useState(false);
  const [allocations, setAllocations] = useState<AllocationItem[]>([
    { id: 'digital', name: 'Digital Marketing', budgetAmount: 0, timeAmount: 0, color: '#3b82f6' },
    { id: 'content', name: 'Content Creation', budgetAmount: 0, timeAmount: 0, color: '#10b981' },
    { id: 'traditional', name: 'Traditional Media', budgetAmount: 0, timeAmount: 0, color: '#f59e0b' },
    { id: 'events', name: 'Events & Experiences', budgetAmount: 0, timeAmount: 0, color: '#8b5cf6' },
    { id: 'partnerships', name: 'Partnerships', budgetAmount: 0, timeAmount: 0, color: '#ef4444' },
  ]);

  const quarterBudget = Math.floor((context?.totalBudget || 500000) / 4);
  const usedBudget = selectedTactics.reduce((sum: number, tactic: Tactic) => sum + (tactic.cost || 0), 0);
  const remainingBudget = quarterBudget - usedBudget;

  useEffect(() => {
    const newAllocations = allocations.map((allocation: AllocationItem) => {
      const categoryTactics = selectedTactics.filter((t: Tactic) => t.category === allocation.id);
      const budgetAmount = categoryTactics.reduce((sum: number, t: Tactic) => sum + (t.cost || 0), 0);
      return { ...allocation, budgetAmount };
    });
    setAllocations(newAllocations);
  }, [selectedTactics]);

  const handleAddTactic = (tactic: Tactic) => {
    if (!selectedTactics.find((t: Tactic) => t.id === tactic.id)) {
      const newTactics = [...selectedTactics, tactic];
      setSelectedTactics(newTactics);
      if (addTactic) addTactic('Q1', tactic);
    }
  };

  const handleRemoveTactic = (tacticId: string) => {
    const newTactics = selectedTactics.filter((t: Tactic) => t.id !== tacticId);
    setSelectedTactics(newTactics);
    if (removeTactic) removeTactic('Q1', tacticId);
  };

  const handleCompleteQuarter = () => {
    setShowDebrief(true);
  };

  const canComplete = selectedTactics.length > 0 && remainingBudget >= 0;

  return (
    <ImmersiveLayout
      title="Q1 Marketing Campaign"
      subtitle="Plan your first quarter marketing initiatives. Focus on building awareness and laying the groundwork for the year."
      quarter="Quarter 1"
    >
      <div className="space-y-10 max-w-7xl mx-auto pb-20">
        {/* Executive Directive */}
        <ExecutivePressure currentQuarter="Q1" context={context} />

        {/* Real-time Performance HUD */}
        <EnhancedKPIDashboard 
          context={context} 
          quarter="Q1"
          selectedTactics={selectedTactics}
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="tactics" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 p-1 rounded-xl">
                <TabsTrigger value="tactics" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all duration-300">Select Tactics</TabsTrigger>
                <TabsTrigger value="plan" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all duration-300">Your Plan</TabsTrigger>
              </TabsList>

              <TabsContent value="tactics" className="mt-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {SAMPLE_TACTICS.slice(0, 6).map((tactic: unknown) => {
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

              <TabsContent value="plan" className="mt-6 space-y-4">
                {selectedTactics.length === 0 ? (
                  <GlassCard className="p-20 text-center">
                    <div className="max-w-xs mx-auto space-y-4">
                      <Target className="h-16 w-16 mx-auto text-blue-200/20" />
                      <h4 className="text-2xl font-bold text-white">Strategy Empty</h4>
                      <p className="text-blue-200/40">Launch your Q1 initiatives by selecting tactics from the deployment matrix.</p>
                    </div>
                  </GlassCard>
                ) : (
                  <div className="space-y-4">
                    {selectedTactics.map((tactic: Tactic) => (
                      <GlassCard key={tactic.id} className="border-l-4 border-l-primary hover:bg-white/10">
                        <div className="p-6 flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                              <Megaphone className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-white">{tactic.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-[10px] uppercase border-white/10 text-blue-200/40">{tactic.category}</Badge>
                                <span className="text-xs text-blue-200/40">•</span>
                                <span className="text-xs font-bold text-primary">${tactic.cost?.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTactic(tactic.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-full"
                          >
                            Abandon
                          </Button>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <GlassCard className="border-primary/30">
              <div className="p-8 space-y-8">
                <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4 flex items-center justify-between">
                  Deployment Status
                  <InfoTooltip iconOnly position="left" content="Real-time monitoring of your budget burn rate and tactical coverage." />
                </h3>
                
                <CMOMentor 
                  selectedTactics={selectedTactics}
                  remainingBudget={remainingBudget}
                  currentQuarter="Q1"
                  context={context}
                />

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-200/60 font-medium">Budget Utilization</span>
                      <span className={cn("font-bold", remainingBudget < 0 ? "text-red-400" : "text-green-400")}>
                        {((usedBudget / quarterBudget) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((usedBudget / quarterBudget) * 100, 100)}%` }}
                        className={cn(
                          "h-full transition-colors duration-500",
                          remainingBudget < 0 ? "bg-red-500" : "bg-primary"
                        )}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-blue-200/40">${usedBudget.toLocaleString()} spent</span>
                      <span className="text-blue-200/40">${quarterBudget.toLocaleString()} limit</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-tighter text-blue-200/40">Remaining</p>
                      <p className={cn("text-xl font-black", remainingBudget < 0 ? "text-red-400" : "text-white")}>
                        ${remainingBudget.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-tighter text-blue-200/40">Tactics</p>
                      <p className="text-xl font-black text-white">{selectedTactics.length} Units</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCompleteQuarter}
                  disabled={!canComplete}
                  className={cn(
                    "w-full py-8 text-lg font-black rounded-2xl transition-all duration-300",
                    canComplete 
                      ? "bg-primary hover:bg-primary/80 text-white shadow-xl shadow-primary/20" 
                      : "bg-white/5 text-blue-200/20 cursor-not-allowed border-white/5"
                  )}
                >
                  Finalize Q1 Tactics
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                {!canComplete && (
                  <p className="text-center text-xs text-red-400/60 font-bold italic">
                    {selectedTactics.length === 0 ? "Matrix requires at least 1 deployment" : "Budget threshold exceeded"}
                  </p>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
      <ConfettiEffect trigger={canComplete && selectedTactics.length >= 3} />
      <EndOfQuarterDebrief
        isOpen={showDebrief}
        context={context}
        quarter="Q1"
        selectedTactics={selectedTactics}
        onConfirm={() => {
          setShowDebrief(false);
          if (completeQuarter) completeQuarter('Q1');
          router.push('/sim/q2');
        }}
      />
    </ImmersiveLayout>
  );
}
