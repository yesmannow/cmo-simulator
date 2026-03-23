'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Heart, Sparkles, Zap, TrendingUpIcon } from 'lucide-react';
import { SimulationContext } from '@/lib/simMachine';
import CountUp from 'react-countup';
import { SparklesCore } from '@/components/ui/sparkles';
// Note: calculateQuarterResults is not exported, so we'll calculate projection differently

interface EnhancedKPIDashboardProps {
  context: SimulationContext;
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  showQuarterlyBreakdown?: boolean;
  selectedTactics?: any[]; // For real-time projection
}

export function EnhancedKPIDashboard({
  context,
  quarter,
  showQuarterlyBreakdown = false,
  selectedTactics = []
}: EnhancedKPIDashboardProps) {
  const [previousValues, setPreviousValues] = useState<Record<string, number>>({});
  const [showSparkles, setShowSparkles] = useState<string | null>(null);

  // Calculate total revenue from all completed quarters
  const calculateTotalRevenue = () => {
    let total = 0;
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'] as const;
    quarters.forEach((q) => {
      const quarterData = context.quarters[q];
      if (quarterData?.results?.revenue !== undefined) {
        if (quarterData.tactics.length > 0 || quarterData.results.revenue > 0) {
          total += quarterData.results.revenue;
        }
      }
    });
    return total > 0 ? total : (context.kpis.revenue || 0);
  };

  // Calculate projected revenue for current quarter based on selected tactics
  const calculateProjectedRevenue = useMemo(() => {
    if (!quarter || selectedTactics.length === 0) return 0;

    // Calculate projection based on tactic expected impacts
    // This is a simplified version - in production, use the actual calculation function
    let totalExpectedRevenue = 0;
    let totalSpend = 0;
    let totalTraffic = 0;

    selectedTactics.forEach((tactic: any) => {
      const cost = tactic.cost || 0;
      totalSpend += cost;
      totalExpectedRevenue += (tactic.expectedImpact?.revenue || 0);

      // Estimate traffic based on category
      const category = tactic.category || 'digital';
      const trafficMultipliers: Record<string, number> = {
        digital: 5,
        content: 10,
        events: 8,
        partnerships: 12,
        traditional: 3,
      };
      totalTraffic += cost * (trafficMultipliers[category] || 4);
    });

    // Apply market saturation
    const marketSaturation = Math.min(context.kpis.marketShare / 50, 0.8);
    totalTraffic *= (1 - marketSaturation);

    // Convert to revenue
    const leads = Math.floor(totalTraffic * 0.05);
    const brandMultiplier = 0.8 + (context.kpis.brandAwareness / 100) * 0.4;
    const conversions = Math.floor(leads * 0.15 * brandMultiplier);

    const baseCustomerValue = 200;
    const brandValueMultiplier = 0.7 + (context.kpis.brandAwareness / 100) * 0.6;
    const marketShareValueMultiplier = 0.8 + (context.kpis.marketShare / 100) * 0.4;
    const customerValue = baseCustomerValue * brandValueMultiplier * marketShareValueMultiplier;

    const trafficBasedRevenue = conversions * customerValue;
    const baseRevenue = (trafficBasedRevenue * 0.6) + (totalExpectedRevenue * 0.4);
    const budgetEfficiency = totalSpend > 0 ? Math.min(1.2, 1.0 + (totalSpend / 500000) * 0.2) : 1.0;

    return Math.max(0, baseRevenue * budgetEfficiency);
  }, [quarter, selectedTactics, context.kpis]);

  // Get current metrics
  const getCurrentMetrics = () => {
    const quarters = ['Q4', 'Q3', 'Q2', 'Q1'] as const;
    for (const q of quarters) {
      const quarterData = context.quarters[q];
      if (quarterData?.results && (quarterData.tactics.length > 0 || quarterData.results.revenue > 0)) {
        return {
          marketShare: quarterData.results.marketShare || context.kpis.marketShare,
          customerSatisfaction: quarterData.results.customerSatisfaction || context.kpis.customerSatisfaction,
          brandAwareness: quarterData.results.brandAwareness || context.kpis.brandAwareness,
        };
      }
    }
    return {
      marketShare: context.kpis.marketShare,
      customerSatisfaction: context.kpis.customerSatisfaction,
      brandAwareness: context.kpis.brandAwareness,
    };
  };

  const totalRevenue = useMemo(() => calculateTotalRevenue(), [context.quarters, context.kpis.revenue]);
  
  const currentMetrics = useMemo(() => getCurrentMetrics(), [context.quarters, context.kpis]);
  
  const projectedRevenue = calculateProjectedRevenue;

  // Calculate trends
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return 'new';
    const change = ((current - previous) / previous) * 100;
    if (change > 5) return 'up';
    if (change < -5) return 'down';
    return 'stable';
  };

  // Calculate quarter-over-quarter trends
  const quarterTrends = useMemo(() => {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'] as const;
    const trends: Record<string, 'up' | 'down' | 'stable' | 'new'> = {};

    quarters.forEach((q, index) => {
      if (index === 0) {
        trends[q] = 'new';
      } else {
        const current = context.quarters[q].results.revenue || 0;
        const previous = context.quarters[quarters[index - 1]].results.revenue || 0;
        trends[q] = calculateTrend(current, previous);
      }
    });

    return trends;
  }, [context.quarters]);

  // Calculate ROI
  const calculateROI = () => {
    const totalSpent = context.totalBudget - context.remainingBudget;
    if (totalSpent === 0) return 0;
    return ((totalRevenue - totalSpent) / totalSpent) * 100;
  };

  const roi = calculateROI();

  // Check for milestones
  const checkMilestones = (value: number, target: number) => {
    const milestones = [0.25, 0.5, 0.75, 0.9, 1.0];
    const progress = value / target;
    return milestones.filter(m => progress >= m && progress < m + 0.05);
  };

  // Update previous values when current values change
  useEffect(() => {
    setPreviousValues({
      revenue: totalRevenue,
      marketShare: currentMetrics.marketShare,
      customerSatisfaction: currentMetrics.customerSatisfaction,
      brandAwareness: currentMetrics.brandAwareness,
    });
  }, [
    totalRevenue, 
    currentMetrics.marketShare, 
    currentMetrics.customerSatisfaction, 
    currentMetrics.brandAwareness
  ]);

  const kpis = [
    {
      title: 'Revenue',
      value: totalRevenue,
      format: (val: number) => `$${val.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      target: 2000000,
      description: 'Total revenue generated',
      trend: calculateTrend(totalRevenue, previousValues.revenue || 0),
    },
    {
      title: 'Market Share',
      value: currentMetrics.marketShare,
      format: (val: number) => `${val.toFixed(1)}%`,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      target: 25,
      description: 'Percentage of market captured',
      trend: calculateTrend(currentMetrics.marketShare, previousValues.marketShare || 0),
    },
    {
      title: 'Customer Satisfaction',
      value: currentMetrics.customerSatisfaction,
      format: (val: number) => `${val.toFixed(1)}%`,
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      target: 85,
      description: 'Customer happiness score',
      trend: calculateTrend(currentMetrics.customerSatisfaction, previousValues.customerSatisfaction || 0),
    },
    {
      title: 'Brand Awareness',
      value: currentMetrics.brandAwareness,
      format: (val: number) => `${val.toFixed(1)}%`,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      target: 60,
      description: 'Brand recognition level',
      trend: calculateTrend(currentMetrics.brandAwareness, previousValues.brandAwareness || 0),
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTrendColor = (current: number, target: number) => {
    const progress = (current / target) * 100;
    if (progress >= 75) return 'text-green-500';
    if (progress >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Main KPI Cards with Animations */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          const progress = Math.min((kpi.value / kpi.target) * 100, 100);
          const milestones = checkMilestones(kpi.value, kpi.target);
          const hasMilestone = milestones.length > 0;

          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onHoverStart={() => setShowSparkles(kpi.title)}
              onHoverEnd={() => setShowSparkles(null)}
            >
              <Card className={`relative overflow-hidden border-2 ${kpi.borderColor} transition-all duration-300 hover:shadow-lg hover:scale-105`}>
                {/* Sparkles effect on hover */}
                {showSparkles === kpi.title && (
                  <div className="absolute inset-0 pointer-events-none">
                    <SparklesCore
                      particleColor={kpi.color.replace('text-', '#')}
                      particleDensity={20}
                      speed={2}
                      className="h-full w-full opacity-30"
                    />
                  </div>
                )}

                {/* Milestone indicator */}
                {hasMilestone && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 z-10"
                  >
                    <Badge className="bg-yellow-500 text-white animate-pulse">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Milestone!
                    </Badge>
                  </motion.div>
                )}

                <CardHeader className="pb-2 relative z-10">
                  <div className="flex items-center justify-between">
                    <motion.div
                      className={`p-2 rounded-lg ${kpi.bgColor}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className={`h-4 w-4 ${kpi.color}`} />
                    </motion.div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(kpi.trend)}
                      {kpi.trend === 'up' && (
                        <motion.div
                          animate={{ y: [0, -2, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Zap className="h-3 w-3 text-green-500" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 relative z-10">
                  <div className="text-2xl font-bold">
                    <CountUp
                      end={kpi.value}
                      duration={1.5}
                      separator=","
                      decimals={kpi.title === 'Revenue' ? 0 : 1}
                      prefix={kpi.title === 'Revenue' ? '$' : ''}
                      suffix={kpi.title !== 'Revenue' ? '%' : ''}
                      className={kpi.color}
                    />
                  </div>
                  <div className="relative">
                    <Progress
                      value={progress}
                      className="h-2"
                    />
                    {/* Animated gradient overlay */}
                    <motion.div
                      className={`absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r ${kpi.bgColor.replace('bg-', 'from-')} ${kpi.color.replace('text-', 'to-')}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      style={{ opacity: 0.3 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Target: {kpi.format(kpi.target)}</span>
                    <span className={getTrendColor(kpi.value, kpi.target)}>
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Enhanced Budget Overview with ROI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 opacity-50" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Budget Overview & ROI
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  <CountUp end={context.totalBudget} duration={1.5} separator="," prefix="$" />
                </div>
                <div className="text-sm text-muted-foreground">Total Budget</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  <CountUp
                    end={context.totalBudget - context.remainingBudget}
                    duration={1.5}
                    separator=","
                    prefix="$"
                  />
                </div>
                <div className="text-sm text-muted-foreground">Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  <CountUp end={context.remainingBudget} duration={1.5} separator="," prefix="$" />
                </div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  <CountUp end={context.kpis.profit} duration={1.5} separator="," prefix="$" />
                </div>
                <div className="text-sm text-muted-foreground">Profit</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <CountUp end={roi} duration={1.5} decimals={1} suffix="%" />
                </div>
                <div className="text-sm text-muted-foreground">ROI</div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Progress
                value={((context.totalBudget - context.remainingBudget) / context.totalBudget) * 100}
                className="h-3"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Budget Utilization</span>
                <span>
                  {(((context.totalBudget - context.remainingBudget) / context.totalBudget) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Real-time Revenue Projection */}
      {quarter && selectedTactics.length > 0 && projectedRevenue > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-2 border-dashed border-primary/50 bg-gradient-to-r from-primary/5 to-purple-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Real-time Q{quarter.replace('Q', '')} Projection
              </CardTitle>
              <CardDescription>
                Based on your current tactic selection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Projected Revenue</div>
                  <div className="text-3xl font-bold text-primary">
                    <CountUp end={projectedRevenue} duration={1} separator="," prefix="$" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">Total YTD + Projected</div>
                  <div className="text-2xl font-bold text-green-600">
                    <CountUp
                      end={totalRevenue + projectedRevenue}
                      duration={1}
                      separator=","
                      prefix="$"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quarterly Breakdown with Trends */}
      {showQuarterlyBreakdown && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Performance</CardTitle>
              <CardDescription>Track your progress across all quarters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map((q, index) => {
                  const quarterData = context.quarters[q];
                  const isActive = quarter === q;
                  const hasResults = quarterData.tactics.length > 0 || (quarterData.results.revenue !== undefined && quarterData.results.revenue > 0);
                  const revenue = quarterData.results.revenue || 0;
                  const tacticsCount = quarterData.tactics.length || 0;
                  const budgetSpent = quarterData.budgetSpent || 0;
                  const trend = quarterTrends[q];
                  const quarterROI = budgetSpent > 0 ? ((revenue - budgetSpent) / budgetSpent) * 100 : 0;

                  return (
                    <motion.div
                      key={q}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                        isActive ? 'border-primary bg-primary/5 shadow-lg' : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{q}</h4>
                        <div className="flex items-center gap-1">
                          {isActive && <Badge variant="default">Current</Badge>}
                          {hasResults && !isActive && <Badge variant="secondary">Complete</Badge>}
                          {trend === 'up' && (
                            <motion.div
                              animate={{ y: [0, -2, 0] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            </motion.div>
                          )}
                          {trend === 'down' && (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Revenue:</span>
                          <span className="font-medium">
                            <CountUp end={revenue} duration={1} separator="," prefix="$" />
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tactics:</span>
                          <span className="font-medium">{tacticsCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Budget:</span>
                          <span className="font-medium">
                            <CountUp end={budgetSpent} duration={1} separator="," prefix="$" />
                          </span>
                        </div>
                        {hasResults && (
                          <div className="flex justify-between pt-1 border-t">
                            <span>ROI:</span>
                            <span className={`font-medium ${quarterROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              <CountUp end={quarterROI} duration={1} decimals={1} suffix="%" />
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

