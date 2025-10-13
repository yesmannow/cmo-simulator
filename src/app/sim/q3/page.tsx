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
import { BudgetTimeAllocator } from '@/components/simulation/BudgetTimeAllocator';
import { MilestoneConfetti } from '@/components/simulation/ConfettiEffect';
import { SAMPLE_TACTICS } from '@/lib/tactics';
import { getEnhancedWildcardForQuarter } from '@/lib/wildcardHelpers';
import { calculateEnhancedWildcardImpact, type EnhancedWildcardEvent } from '@/lib/enhancedWildcards';
import { ArrowRight, Zap, Target, Calendar, TrendingUp } from 'lucide-react';

export default function Q3Page() {
  const router = useRouter();
  const { context, addTactic, removeTactic, triggerWildcard, respondToWildcard, completeQuarter } = useSimulation();
  
  const [selectedTactics, setSelectedTactics] = useState(context.quarters.Q3.tactics);
  const [availableTactics] = useState(SAMPLE_TACTICS);
  const [currentWildcard, setCurrentWildcard] = useState<EnhancedWildcardEvent | null>(null);
  const [showWildcardModal, setShowWildcardModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [allocations, setAllocations] = useState([
    { id: 'digital', name: 'Digital Marketing', budgetAmount: 0, timeAmount: 0, color: '#3b82f6' },
    { id: 'content', name: 'Content Creation', budgetAmount: 0, timeAmount: 0, color: '#10b981' },
    { id: 'traditional', name: 'Traditional Media', budgetAmount: 0, timeAmount: 0, color: '#f59e0b' },
    { id: 'events', name: 'Events & Experiences', budgetAmount: 0, timeAmount: 0, color: '#8b5cf6' },
    { id: 'partnerships', name: 'Partnerships', budgetAmount: 0, timeAmount: 0, color: '#ef4444' },
  ]);

  const quarterBudget = Math.floor(context.totalBudget / 4);
  const quarterTime = 200;
  
  const usedBudget = selectedTactics.reduce((sum, tactic) => sum + tactic.cost, 0);
  const usedTime = selectedTactics.reduce((sum, tactic) => sum + tactic.timeRequired, 0);
  const remainingBudget = quarterBudget - usedBudget;
  const remainingTime = quarterTime - usedTime;

  // Calculate momentum from previous quarters
  const previousRevenue = context.quarters.Q1.results.revenue + context.quarters.Q2.results.revenue;
  const momentumBonus = previousRevenue > 300000 ? 1.2 : 1.0; // 20% bonus for strong performance

  useEffect(() => {
    const newAllocations = allocations.map(allocation => {
      const categoryTactics = selectedTactics.filter(t => t.category === allocation.id);
      const budgetAmount = categoryTactics.reduce((sum, t) => sum + t.cost, 0);
      const timeAmount = categoryTactics.reduce((sum, t) => sum + t.timeRequired, 0);
      return { ...allocation, budgetAmount, timeAmount };
    });
    setAllocations(newAllocations);
  }, [selectedTactics]); // Removed allocations from dependency array to prevent infinite loop

  const handleAddTactic = (tactic: unknown) => {
    if (!selectedTactics.find(t => t.id === tactic.id)) {
      const newTactics = [...selectedTactics, tactic];
      setSelectedTactics(newTactics);
      addTactic('Q3', tactic);
    }
  };

  const handleRemoveTactic = (tacticId: string) => {
    const newTactics = selectedTactics.filter(t => t.id !== tacticId);
    setSelectedTactics(newTactics);
    removeTactic('Q3', tacticId);
  };

  const handleTriggerWildcard = () => {
    const wildcard = getEnhancedWildcardForQuarter(context, 'Q3');
    if (!wildcard) return;
    setCurrentWildcard(wildcard);
    setShowWildcardModal(true);
    triggerWildcard('Q3', wildcard);
  };

  const handleWildcardResponse = (choiceId: string) => {
    if (currentWildcard) {
      const impact = calculateEnhancedWildcardImpact(currentWildcard, choiceId);
      respondToWildcard('Q3', currentWildcard, choiceId, impact);
      setShowWildcardModal(false);
      setCurrentWildcard(null);
    }
  };

  const handleCompleteQuarter = () => {
    completeQuarter('Q3');
    setShowConfetti(true);
    setTimeout(() => {
      router.push('/sim/q4');
    }, 3000);
  };

  const canComplete = selectedTactics.length > 0 && remainingBudget >= 0 && remainingTime >= 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <MilestoneConfetti trigger={showConfetti} />
      
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Calendar className="h-4 w-4 mr-2" />
            Quarter 3
          </Badge>
          {momentumBonus > 1.0 && (
            <Badge className="text-lg px-4 py-2 bg-green-100 text-green-800">
              <TrendingUp className="h-4 w-4 mr-2" />
              Momentum Bonus!
            </Badge>
          )}
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Q3 Marketing Campaign
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Mid-year push! Capitalize on your momentum and prepare for the final quarter sprint.
        </p>
        {momentumBonus > 1.0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-green-800 font-medium">
              🚀 Strong H1 performance unlocked a 20% effectiveness bonus for Q3 tactics!
            </p>
          </div>
        )}
      </div>

      <KPIDashboard context={context} quarter="Q3" showQuarterlyBreakdown={true} />

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
                <Button 
                  onClick={handleTriggerWildcard}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Trigger Market Event
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {availableTactics.map((tactic) => (
                  <TacticCard
                    key={tactic.id}
                    tactic={{
                      ...tactic,
                      expectedImpact: {
                        ...tactic.expectedImpact,
                        revenue: Math.round(tactic.expectedImpact.revenue * momentumBonus),
                        marketShare: Math.round(tactic.expectedImpact.marketShare * momentumBonus),
                        customerSatisfaction: Math.round(tactic.expectedImpact.customerSatisfaction * momentumBonus),
                        brandAwareness: Math.round(tactic.expectedImpact.brandAwareness * momentumBonus),
                      }
                    }}
                    onAdd={() => handleAddTactic(tactic)}
                    isSelected={selectedTactics.some(t => t.id === tactic.id)}
                    showAddButton={true}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="plan" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Your Q3 Marketing Plan</h3>
                <Badge variant="outline">
                  {selectedTactics.length} tactics selected
                </Badge>
              </div>
              
              {selectedTactics.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h4 className="text-lg font-medium mb-2">No tactics selected</h4>
                    <p>Switch to the &quot;Select Tactics&quot; tab to build your marketing plan.</p>
                  </div>
                </Card>
              ) : (
                <DndContext onDragEnd={(event: DragEndEvent) => {
                  const { active, over } = event;
                  if (active.id !== over?.id) {
                    const oldIndex = selectedTactics.findIndex(t => t.id === active.id);
                    const newIndex = selectedTactics.findIndex(t => t.id === over?.id);
                    const newTactics = [...selectedTactics];
                    const [reorderedItem] = newTactics.splice(oldIndex, 1);
                    newTactics.splice(newIndex, 0, reorderedItem);
                    setSelectedTactics(newTactics);
                  }
                }}>
                  <SortableContext items={selectedTactics.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      {selectedTactics.map((tactic) => (
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
              <h3 className="text-lg font-semibold">Resource Allocation</h3>
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Q3 Summary</CardTitle>
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
                    {context.quarters.Q3.wildcardEvents.length} triggered
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCompleteQuarter}
                disabled={!canComplete}
                className="w-full"
                size="lg"
              >
                Complete Q3
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
              <CardTitle className="text-base">Performance Tracker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium">H1 Revenue:</span>
                  <div className="text-green-600 font-semibold">
                    ${previousRevenue.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="font-medium">YTD Progress:</span>
                  <div className="text-blue-600 font-semibold">
                    {((previousRevenue / 2000000) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              
              {momentumBonus > 1.0 && (
                <div className="p-2 bg-green-50 rounded text-green-800 text-xs">
                  🎯 Momentum bonus active: +20% tactic effectiveness
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
                  {context.strategy.primaryChannels?.map(channel => (
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
    </div>
  );
}
