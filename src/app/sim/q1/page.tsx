'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, ArrowRight } from 'lucide-react';
import { useSimulation } from '@/hooks/useSimulation';
import { SAMPLE_TACTICS } from '@/lib/tactics';

interface SimpleTactic {
  id: string;
  name: string;
  cost?: number;
  category: string;
}

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

  const [selectedTactics, setSelectedTactics] = useState<SimpleTactic[]>([]);
  const [allocations, setAllocations] = useState<AllocationItem[]>([
    { id: 'digital', name: 'Digital Marketing', budgetAmount: 0, timeAmount: 0, color: '#3b82f6' },
    { id: 'content', name: 'Content Creation', budgetAmount: 0, timeAmount: 0, color: '#10b981' },
    { id: 'traditional', name: 'Traditional Media', budgetAmount: 0, timeAmount: 0, color: '#f59e0b' },
    { id: 'events', name: 'Events & Experiences', budgetAmount: 0, timeAmount: 0, color: '#8b5cf6' },
    { id: 'partnerships', name: 'Partnerships', budgetAmount: 0, timeAmount: 0, color: '#ef4444' },
  ]);

  const quarterBudget = Math.floor((context?.totalBudget || 500000) / 4);
  const usedBudget = selectedTactics.reduce((sum: number, tactic: SimpleTactic) => sum + (tactic.cost || 0), 0);
  const remainingBudget = quarterBudget - usedBudget;

  useEffect(() => {
    const newAllocations = allocations.map((allocation: AllocationItem) => {
      const categoryTactics = selectedTactics.filter((t: SimpleTactic) => t.category === allocation.id);
      const budgetAmount = categoryTactics.reduce((sum: number, t: SimpleTactic) => sum + (t.cost || 0), 0);
      return { ...allocation, budgetAmount };
    });
    setAllocations(newAllocations);
  }, [selectedTactics, allocations]);

  const handleAddTactic = (tactic: SimpleTactic) => {
    if (!selectedTactics.find((t: SimpleTactic) => t.id === tactic.id)) {
      const newTactics = [...selectedTactics, tactic];
      setSelectedTactics(newTactics);
      if (addTactic) addTactic('Q1', tactic as any);
    }
  };

  const handleRemoveTactic = (tacticId: string) => {
    const newTactics = selectedTactics.filter((t: SimpleTactic) => t.id !== tacticId);
    setSelectedTactics(newTactics);
    if (removeTactic) removeTactic('Q1', tacticId);
  };

  const handleCompleteQuarter = () => {
    if (completeQuarter) completeQuarter('Q1');
    router.push('/sim/q2');
  };

  const canComplete = selectedTactics.length > 0 && remainingBudget >= 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Q1 Marketing Campaign</h1>
        <p className="text-lg text-muted-foreground">
          Plan your first quarter marketing initiatives.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="tactics" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tactics">Select Tactics</TabsTrigger>
              <TabsTrigger value="plan">Your Plan</TabsTrigger>
            </TabsList>

            <TabsContent value="tactics" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {SAMPLE_TACTICS.slice(0, 6).map((tactic: SimpleTactic) => (
                  <Card key={tactic.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{tactic.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{tactic.category}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-primary">
                          ${tactic.cost?.toLocaleString() || 'N/A'}
                        </span>
                        <Button
                          onClick={() => handleAddTactic(tactic)}
                          disabled={selectedTactics.some((t: any) => t.id === tactic.id)}
                        >
                          {selectedTactics.some((t: any) => t.id === tactic.id) ? 'Selected' : 'Add'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="plan" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Your Q1 Marketing Plan</h3>
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
                <div className="space-y-4">
                  {selectedTactics.map((tactic: any) => (
                    <Card key={tactic.id}>
                      <CardContent className="flex justify-between items-center p-4">
                        <div>
                          <h4 className="font-medium">{tactic.name}</h4>
                          <p className="text-sm text-muted-foreground">{tactic.category}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">${tactic.cost?.toLocaleString() || 'N/A'}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveTactic(tactic.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Q1 Summary</CardTitle>
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
                  <div className="font-medium">Tactics</div>
                  <div className="text-muted-foreground">
                    {selectedTactics.length} selected
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCompleteQuarter}
                disabled={!canComplete}
                className="w-full"
                size="lg"
              >
                Complete Q1
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {!canComplete && (
                <div className="text-sm text-muted-foreground">
                  {selectedTactics.length === 0 && "• Select at least one tactic"}
                  {remainingBudget < 0 && "• Budget exceeded"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
