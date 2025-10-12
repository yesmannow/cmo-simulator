'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSimulation } from '@/hooks/useSimulation';
import { KPIDashboard } from '@/components/simulation/KPIDashboard';
import { TacticCard, DraggableTacticCard } from '@/components/simulation/TacticCard';
import { WildcardModal } from '@/components/simulation/WildcardModal';
import { BigBetModal } from '@/components/simulation/BigBetModal';
import { BudgetTimeAllocator } from '@/components/simulation/BudgetTimeAllocator';
import { ConfettiEffect } from '@/components/simulation/ConfettiEffect';
import { getTacticsByCategory, getRandomWildcard } from '@/lib/tactics';
import { getRandomBigBets } from '@/lib/talentMarket';
import { Tactic, WildcardEvent } from '@/lib/simMachine';
import { BigBetOption } from '@/lib/talentMarket';
import { ArrowRight, Zap, Target, Calendar, Crown, Flame, Sparkles } from 'lucide-react';

export default function Q4Page() {
  const router = useRouter();
  const {
    context,
    addTactic,
    removeTactic,
    triggerWildcard,
    respondToWildcard,
    completeQuarter,
    selectBigBet,
    resolveBigBet,
  } = useSimulation();
  
  const [selectedTactics, setSelectedTactics] = useState(context.quarters.Q4.tactics);
  const [availableTactics] = useState(getTacticsByCategory('digital'));
  const [currentWildcard, setCurrentWildcard] = useState<WildcardEvent | null>(null);
  const [showWildcardModal, setShowWildcardModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bigBetOptions, setBigBetOptions] = useState<BigBetOption[]>([]);
  const [showBigBetModal, setShowBigBetModal] = useState(false);
  const [hasTriggeredBigBet, setHasTriggeredBigBet] = useState(false);
  const [allocations, setAllocations] = useState([
    { id: 'digital', name: 'Digital Marketing', budgetAmount: 0, timeAmount: 0, color: '#3b82f6' },
    { id: 'content', name: 'Content Creation', budgetAmount: 0, timeAmount: 0, color: '#10b981' },
    { id: 'traditional', name: 'Traditional Media', budgetAmount: 0, timeAmount: 0, color: '#f59e0b' },
    { id: 'events', name: 'Events & Experiences', budgetAmount: 0, timeAmount: 0, color: '#8b5cf6' },
    { id: 'partnerships', name: 'Partnerships', budgetAmount: 0, timeAmount: 0, color: '#ef4444' },
  ]);

  const quarterBudget = Math.floor(context.totalBudget / 4);
  const quarterTime = 200;
  
  const usedBudget = selectedTactics.reduce((sum: number, tactic: Tactic) => sum + tactic.cost, 0);
  const usedTime = selectedTactics.reduce((sum: number, tactic: Tactic) => sum + tactic.timeRequired, 0);
  const remainingBudget = quarterBudget - usedBudget;
  const remainingTime = quarterTime - usedTime;

  // Calculate year-end push bonus
  const ytdRevenue = context.quarters.Q1.results.revenue + context.quarters.Q2.results.revenue + context.quarters.Q3.results.revenue;
  const finalPushBonus = ytdRevenue > 800000 ? 1.5 : ytdRevenue > 500000 ? 1.3 : 1.1; // Up to 50% bonus for exceptional performance
  const isOnTrack = ytdRevenue > 1200000; // On track for 2M+ annual revenue

  useEffect(() => {
    const newAllocations = allocations.map(allocation => {
      const categoryTactics = selectedTactics.filter((t: Tactic) => t.category === allocation.id);
      const budgetAmount = categoryTactics.reduce((sum: number, t: Tactic) => sum + t.cost, 0);
      const timeAmount = categoryTactics.reduce((sum: number, t: Tactic) => sum + t.timeRequired, 0);
      return { ...allocation, budgetAmount, timeAmount };
    });
    setAllocations(newAllocations);
  }, [selectedTactics]);

  const handleAddTactic = (tactic: Tactic) => {
    if (!selectedTactics.find((t: Tactic) => t.id === tactic.id)) {
      const newTactics = [...selectedTactics, tactic];
      setSelectedTactics(newTactics);
      addTactic('Q4', tactic);
    }
  };

  const handleRemoveTactic = (tacticId: string) => {
    const newTactics = selectedTactics.filter((t: Tactic) => t.id !== tacticId);
    setSelectedTactics(newTactics);
    removeTactic('Q4', tacticId);
  };

  const handleTriggerWildcard = () => {
    const wildcard = getRandomWildcard();
    setCurrentWildcard(wildcard);
    setShowWildcardModal(true);
    triggerWildcard('Q4', wildcard);
  };

  const handleWildcardResponse = (choiceId: string) => {
    if (currentWildcard) {
      respondToWildcard(currentWildcard.id, choiceId);
      setShowWildcardModal(false);
      setCurrentWildcard(null);
    }
  };

  const handleOpenBigBet = () => {
    const bigBets = getRandomBigBets(3);
    setBigBetOptions(bigBets);
    setShowBigBetModal(true);
    setHasTriggeredBigBet(true);
  };

  const handleSelectBigBet = (bigBet: BigBetOption) => {
    selectBigBet('Q4', bigBet);
    resolveBigBet('Q4');
    setShowBigBetModal(false);
  };

  const handleCompleteQuarter = () => {
    completeQuarter('Q4');
    setShowConfetti(true);
    setTimeout(() => {
      router.push('/sim/debrief');
    }, 3000);
  };

  const canComplete = selectedTactics.length > 0 && remainingBudget >= 0 && remainingTime >= 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <ConfettiEffect trigger={showConfetti} />
      
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Calendar className="h-4 w-4 mr-2" />
            Quarter 4 - Final Sprint
          </Badge>
          {finalPushBonus >= 1.5 && (
            <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              <Crown className="h-4 w-4 mr-2" />
              Elite Performance!
            </Badge>
          )}
          {finalPushBonus >= 1.3 && finalPushBonus < 1.5 && (
            <Badge className="text-lg px-4 py-2 bg-orange-100 text-orange-800">
              <Flame className="h-4 w-4 mr-2" />
              Hot Streak!
            </Badge>
          )}
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Q4 Final Sprint
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          The final quarter! Make it count with your strongest tactics and biggest bets. This is where legends are made.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="font-semibold text-blue-800">Year-to-Date Revenue</div>
            <div className="text-2xl font-bold text-blue-900">${ytdRevenue.toLocaleString()}</div>
            <div className="text-sm text-blue-600">
              {isOnTrack ? '🎯 On track for 2M+ target!' : `${((ytdRevenue / 2000000) * 100).toFixed(1)}% to target`}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
            <div className="font-semibold text-green-800">Q4 Effectiveness Bonus</div>
            <div className="text-2xl font-bold text-green-900">+{((finalPushBonus - 1) * 100).toFixed(0)}%</div>
            <div className="text-sm text-green-600">
              {finalPushBonus >= 1.5 ? '🚀 Maximum boost unlocked!' : 
               finalPushBonus >= 1.3 ? '⚡ Strong momentum bonus!' : 
               '📈 Year-end push active!'}
            </div>
          </div>
        </div>
      </div>

      <KPIDashboard context={context} quarter="Q4" showQuarterlyBreakdown={true} />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="tactics" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tactics">Select Tactics</TabsTrigger>
              <TabsTrigger value="plan">Your Plan</TabsTrigger>
              <TabsTrigger value="allocations">Budget & Time</TabsTrigger>
            </TabsList>

            <TabsContent value="tactics" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Available Marketing Tactics</h3>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleOpenBigBet}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={hasTriggeredBigBet}
                  >
                    <Sparkles className="h-4 w-4" />
                    {hasTriggeredBigBet ? 'Big Bet Made' : 'Make Big Bet'}
                  </Button>
                  <Button 
                    onClick={handleTriggerWildcard}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    Trigger Market Event
                  </Button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {availableTactics.map((tactic) => (
                  <TacticCard
                    key={tactic.id}
                    tactic={{
                      ...tactic,
                      expectedImpact: {
                        ...tactic.expectedImpact,
                        revenue: Math.round(tactic.expectedImpact.revenue * finalPushBonus),
                        marketShare: Math.round(tactic.expectedImpact.marketShare * finalPushBonus),
                        customerSatisfaction: Math.round(tactic.expectedImpact.customerSatisfaction * finalPushBonus),
                        brandAwareness: Math.round(tactic.expectedImpact.brandAwareness * finalPushBonus),
                      }
                    }}
                    onAdd={() => handleAddTactic(tactic)}
                    isSelected={selectedTactics.some((t: Tactic) => t.id === tactic.id)}
                    showAddButton={true}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="plan" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Your Q4 Marketing Plan</h3>
                <Badge variant="outline">
                  {selectedTactics.length} tactics selected
                </Badge>
              </div>
              
              {selectedTactics.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h4 className="text-lg font-medium mb-2">No tactics selected</h4>
                    <p>Switch to the "Select Tactics" tab to build your final quarter plan.</p>
                  </div>
                </Card>
              ) : (
                <DndContext onDragEnd={(event: DragEndEvent) => {
                  const { active, over } = event;
                  if (active.id !== over?.id) {
                    const oldIndex = selectedTactics.findIndex((t: Tactic) => t.id === active.id);
                    const newIndex = selectedTactics.findIndex((t: Tactic) => t.id === over?.id);
                    const newTactics = [...selectedTactics];
                    const [reorderedItem] = newTactics.splice(oldIndex, 1);
                    newTactics.splice(newIndex, 0, reorderedItem);
                    setSelectedTactics(newTactics);
                  }
                }}>
                  <SortableContext items={selectedTactics.map((t: Tactic) => t.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      {selectedTactics.map((tactic: Tactic) => (
                        <DraggableTacticCard
                          key={tactic.id}
                          tactic={tactic}
                          onRemove={() => handleRemoveTactic(tactic.id)}
                          showRemoveButton={true}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </TabsContent>

            <TabsContent value="allocations" className="space-y-4">
              <h3 className="text-lg font-semibold">Final Resource Allocation</h3>
              <BudgetTimeAllocator
                totalBudget={quarterBudget}
                totalTime={quarterTime}
                allocations={allocations}
                onAllocationsChange={setAllocations}
                remainingBudget={remainingBudget}
                remainingTime={remainingTime}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-600" />
                Q4 Final Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Budget</div>
                  <div className="text-muted-foreground">
                    ${usedBudget.toLocaleString()} / ${quarterBudget.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Time</div>
                  <div className="text-muted-foreground">
                    {usedTime}h / {quarterTime}h
                  </div>
                </div>
                <div>
                  <div className="font-medium">Tactics</div>
                  <div className="text-muted-foreground">
                    {selectedTactics.length} selected
                  </div>
                </div>
                <div>
                  <div className="font-medium">Events</div>
                  <div className="text-muted-foreground">
                    {context.quarters.Q4.wildcardEvents.length} triggered
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCompleteQuarter}
                disabled={!canComplete}
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                size="lg"
              >
                Complete Year & See Results
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {!canComplete && (
                <div className="text-sm text-muted-foreground">
                  {selectedTactics.length === 0 && "• Select at least one tactic"}
                  {remainingBudget < 0 && "• Budget exceeded"}
                  {remainingTime < 0 && "• Time allocation exceeded"}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Annual Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Annual Target:</span>
                  <span className="font-semibold">$2,000,000</span>
                </div>
                <div className="flex justify-between">
                  <span>YTD Revenue:</span>
                  <span className="font-semibold text-blue-600">${ytdRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining to Target:</span>
                  <span className={`font-semibold ${2000000 - ytdRevenue <= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                    ${Math.max(0, 2000000 - ytdRevenue).toLocaleString()}
                  </span>
                </div>
              </div>
              
              {finalPushBonus >= 1.3 && (
                <div className="p-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded text-yellow-800 text-xs">
                  🏆 Elite performance bonus: +{((finalPushBonus - 1) * 100).toFixed(0)}% effectiveness
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Target:</span> {context.strategy.targetAudience}
              </div>
              <div>
                <span className="font-medium">Position:</span> {context.strategy.brandPositioning}
              </div>
              <div>
                <span className="font-medium">Channels:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {context.strategy.primaryChannels?.map((channel: string) => (
                    <Badge key={channel} variant="secondary" className="text-xs">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <WildcardModal
        wildcard={currentWildcard}
        isOpen={showWildcardModal}
        onClose={() => setShowWildcardModal(false)}
        onChoose={handleWildcardResponse}
      />

      <BigBetModal
        bigBets={bigBetOptions}
        isOpen={showBigBetModal}
        onClose={() => setShowBigBetModal(false)}
        onSelect={handleSelectBigBet}
        availableBudget={remainingBudget}
        currentKPIs={{
          revenue: context.quarters.Q1.results.revenue + context.quarters.Q2.results.revenue + context.quarters.Q3.results.revenue,
          marketShare: context.quarters.Q3.results.marketShare || 15,
          customerSatisfaction: context.quarters.Q3.results.customerSatisfaction || 75,
          brandAwareness: context.quarters.Q3.results.brandAwareness || 60
        }}
      />
    </div>
  );
}
