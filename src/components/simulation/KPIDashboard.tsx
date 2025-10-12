'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Heart } from 'lucide-react';
import { SimulationContext } from '@/lib/simMachine';

interface KPIDashboardProps {
  context: SimulationContext;
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  showQuarterlyBreakdown?: boolean;
}

export function KPIDashboard({ context, quarter, showQuarterlyBreakdown = false }: KPIDashboardProps) {
  const kpis = [
    {
      title: 'Revenue',
      value: context.kpis.revenue,
      format: (val: number) => `$${val.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      target: 2000000,
      description: 'Total revenue generated',
    },
    {
      title: 'Market Share',
      value: context.kpis.marketShare,
      format: (val: number) => `${val.toFixed(1)}%`,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      target: 25,
      description: 'Percentage of market captured',
    },
    {
      title: 'Customer Satisfaction',
      value: context.kpis.customerSatisfaction,
      format: (val: number) => `${val.toFixed(1)}%`,
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      target: 85,
      description: 'Customer happiness score',
    },
    {
      title: 'Brand Awareness',
      value: context.kpis.brandAwareness,
      format: (val: number) => `${val.toFixed(1)}%`,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      target: 60,
      description: 'Brand recognition level',
    },
  ];

  const getTrendIcon = (current: number, target: number) => {
    const progress = (current / target) * 100;
    return progress >= 75 ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (current: number, target: number) => {
    const progress = (current / target) * 100;
    if (progress >= 75) return 'text-green-500';
    if (progress >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Main KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon = getTrendIcon(kpi.value, kpi.target);
          const progress = Math.min((kpi.value / kpi.target) * 100, 100);
          
          return (
            <Card key={kpi.title} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                    <Icon className={`h-4 w-4 ${kpi.color}`} />
                  </div>
                  <TrendIcon className={`h-4 w-4 ${getTrendColor(kpi.value, kpi.target)}`} />
                </div>
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold">{kpi.format(kpi.value)}</div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Target: {kpi.format(kpi.target)}</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Budget Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                ${context.totalBudget.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Budget</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${(context.totalBudget - context.remainingBudget).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ${context.remainingBudget.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${context.kpis.profit.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Profit</div>
            </div>
          </div>
          <div className="mt-4">
            <Progress 
              value={((context.totalBudget - context.remainingBudget) / context.totalBudget) * 100} 
              className="h-3"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Budget Utilization</span>
              <span>{(((context.totalBudget - context.remainingBudget) / context.totalBudget) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quarterly Breakdown */}
      {showQuarterlyBreakdown && (
        <Card>
          <CardHeader>
            <CardTitle>Quarterly Performance</CardTitle>
            <CardDescription>Track your progress across all quarters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map((q) => {
                const quarterData = context.quarters[q];
                const isActive = quarter === q;
                const hasResults = quarterData.results.revenue > 0;
                const talentCount = quarterData.talentHired?.length || 0;

                return (
                  <div key={q} className={`p-4 rounded-lg border-2 ${
                    isActive ? 'border-primary bg-primary/5' : 'border-muted'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{q}</h4>
                      {isActive && <Badge variant="default">Current</Badge>}
                      {hasResults && !isActive && <Badge variant="secondary">Complete</Badge>}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Revenue:</span>
                        <span className="font-medium">
                          ${quarterData.results.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tactics:</span>
                        <span className="font-medium">{quarterData.tactics.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Budget:</span>
                        <span className="font-medium">
                          ${quarterData.budgetSpent.toLocaleString()}
                        </span>
                      </div>
                      {talentCount > 0 && (
                        <div className="flex justify-between items-center">
                          <span>Talent Hires:</span>
                          <Badge variant="outline">{talentCount}</Badge>
                        </div>
                      )}
                      {quarterData.bigBetMade && quarterData.bigBetOutcome && (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span>Big Bet:</span>
                            <Badge variant={quarterData.bigBetOutcome.success ? 'default' : 'destructive'}>
                              {quarterData.bigBetOutcome.success ? 'Success' : 'Missed' }
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {quarterData.bigBetMade.name}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
