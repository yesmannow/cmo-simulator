'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign,
  Clock,
  Zap,
  AlertTriangle,
  Briefcase
} from 'lucide-react';
import { useSimulation } from '@/hooks/useSimulation';
import { KPIDashboard } from '@/components/simulation/KPIDashboard';
import { TacticCard } from '@/components/simulation/TacticCard';
import { BudgetTimeAllocator } from '@/components/simulation/BudgetTimeAllocator';
import { WildcardModal } from '@/components/simulation/WildcardModal';
import { TalentMarketModal } from '@/components/simulation/TalentMarketModal';
import { ConfettiEffect } from '@/components/simulation/ConfettiEffect';
import { getTacticsByCategory, getRandomWildcard } from '@/lib/tactics';
import { getRandomTalentPool } from '@/lib/talentMarket';
import { Tactic, WildcardEvent } from '@/lib/simMachine';
import { TalentCandidate } from '@/lib/talentMarket';

export default function Q2Page() {
  const router = useRouter();
  const { context, addTactic, removeTactic, triggerWildcard, respondToWildcard, completeQuarter } = useSimulation();
  
  const [selectedTactics, setSelectedTactics] = useState(context.quarters.Q2.tactics);
  const [availableTactics] = useState(getTacticsByCategory('digital'));
  const [currentWildcard, setCurrentWildcard] = useState<WildcardEvent | null>(null);
  const [showWildcardModal, setShowWildcardModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [talentCandidates, setTalentCandidates] = useState<TalentCandidate[]>([]);
  const [showTalentMarket, setShowTalentMarket] = useState(false);
  const [hasTriggeredTalentMarket, setHasTriggeredTalentMarket] = useState(false);
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
      addTactic('Q2', tactic);
    }
  };

  const handleRemoveTactic = (tacticId: string) => {
    const newTactics = selectedTactics.filter((t: Tactic) => t.id !== tacticId);
    setSelectedTactics(newTactics);
    removeTactic('Q2', tacticId);
  };

  const handleTriggerWildcard = () => {
    const wildcard = getRandomWildcard();
    setCurrentWildcard(wildcard);
    setShowWildcardModal(true);
    triggerWildcard('Q2', wildcard);
  };

  const handleWildcardResponse = (choiceId: string) => {
    if (currentWildcard) {
      respondToWildcard(currentWildcard.id, choiceId);
      setShowWildcardModal(false);
      setCurrentWildcard(null);
    }
  };

  const handleOpenTalentMarket = () => {
    const candidates = getRandomTalentPool(4);
    setTalentCandidates(candidates);
    setShowTalentMarket(true);
    setHasTriggeredTalentMarket(true);
  };

  const handleHireTalent = (candidate: TalentCandidate) => {
    // TODO: Integrate with simulation state machine
    console.log('Hired:', candidate);
    setShowTalentMarket(false);
  };

  const handleCompleteQuarter = () => {
    completeQuarter('Q2');
    setShowConfetti(true);
    setTimeout(() => {
      router.push('/sim/q3');
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
            Quarter 2
          </Badge>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Q2 Marketing Campaign
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Build on Q1 momentum. Optimize your strategy based on early results and market feedback.
        </p>
      </div>

      <KPIDashboard context={context} quarter="Q2" showQuarterlyBreakdown={true} />

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
                    onClick={handleOpenTalentMarket}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={hasTriggeredTalentMarket}
                  >
                    <Briefcase className="h-4 w-4" />
                    {hasTriggeredTalentMarket ? 'Talent Hired' : 'Hire Talent'}
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
                    tactic={tactic}
                    onAdd={() => handleAddTactic(tactic)}
                    isSelected={selectedTactics.some((t: Tactic) => t.id === tactic.id)}
                    showAddButton={true}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="plan" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Your Q2 Marketing Plan</h3>
                <Badge variant="outline">
                  {selectedTactics.length} tactics selected
                </Badge>
              </div>
              
              {selectedTactics.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h4 className="text-lg font-medium mb-2">No tactics selected</h4>
                    <p>Switch to the "Select Tactics" tab to build your marketing plan.</p>
                  </div>
                </Card>
              ) : (
                <div className="space-y-4">
                  {selectedTactics.map((tactic) => (
                    <TacticCard
                      key={tactic.id}
                      tactic={tactic}
                      onRemove={() => handleRemoveTactic(tactic.id)}
                      showRemoveButton={true}
                    />
                  ))}
                </div>
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
              <CardTitle className="text-lg">Q2 Summary</CardTitle>
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
                    {context.quarters.Q2.wildcardEvents.length} triggered
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCompleteQuarter}
                disabled={!canComplete}
                className="w-full"
                size="lg"
              >
                Complete Q2
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

      <TalentMarketModal
        candidates={talentCandidates}
        isOpen={showTalentMarket}
        onClose={() => setShowTalentMarket(false)}
        onHire={handleHireTalent}
        availableBudget={remainingBudget}
      />
    </div>
  );
}
