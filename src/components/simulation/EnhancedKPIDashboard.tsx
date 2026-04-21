'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Heart, Sparkles, Zap, TrendingUpIcon, ArrowRight } from 'lucide-react';
import { SimulationContext, Tactic, processQuarterAdvance } from '@/lib/simMachine';
import CountUp from 'react-countup';
import { SparklesCore } from '@/components/ui/sparkles';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { logger } from '@/lib/logger';

interface EnhancedKPIDashboardProps {
  context: SimulationContext;
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  showQuarterlyBreakdown?: boolean;
  selectedTactics?: Tactic[];
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
  const calculateTotalRevenue = useCallback(() => {
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
  }, [context.quarters, context.kpis.revenue]);

  // Calculate projected revenue for current quarter based on selected tactics
  const calculateProjectedRevenue = useMemo(() => {
    if (!quarter || selectedTactics.length === 0 || !['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter)) return 0;
    
    try {
      const tempContext = {
        ...context,
        quarters: {
          ...context.quarters,
          [quarter]: {
            ...context.quarters[quarter],
            tactics: selectedTactics
          }
        }
      };
      
      const projection = processQuarterAdvance(tempContext, quarter as 'Q1' | 'Q2' | 'Q3' | 'Q4');
      return projection.newQuarterData.results.revenue;
    } catch (e) {
      logger.error("Projection error", e);
      return 0;
    }
  }, [quarter, selectedTactics, context]);

  // Get current metrics
  const getCurrentMetrics = useCallback(() => {
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
  }, [context.quarters, context.kpis]);

  const totalRevenue = useMemo(() => calculateTotalRevenue(), [calculateTotalRevenue]);
  const currentMetrics = useMemo(() => getCurrentMetrics(), [getCurrentMetrics]);
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
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]',
      gradient: 'from-emerald-500/20 to-emerald-400/20',
      target: 2000000,
      description: 'Total revenue generated',
      trend: calculateTrend(totalRevenue, previousValues.revenue || 0),
      tooltipContent: "Top-line gross income generated from successful market penetration and captured demand.",
    },
    {
      title: 'Market Share',
      value: currentMetrics.marketShare,
      format: (val: number) => `${val.toFixed(1)}%`,
      icon: Target,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      glow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]',
      gradient: 'from-blue-500/20 to-blue-400/20',
      target: 25,
      description: 'Percentage of market captured',
      trend: calculateTrend(currentMetrics.marketShare, previousValues.marketShare || 0),
      tooltipContent: "Your brand's percentage of total industry sales. A critical indicator of long-term dominance.",
    },
    {
      title: 'Satisfaction',
      value: currentMetrics.customerSatisfaction,
      format: (val: number) => `${val.toFixed(1)}%`,
      icon: Heart,
      color: 'text-fuchsia-400',
      bgColor: 'bg-fuchsia-500/10',
      borderColor: 'border-fuchsia-500/20',
      glow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]',
      gradient: 'from-fuchsia-500/20 to-fuchsia-400/20',
      target: 85,
      description: 'Customer happiness score',
      trend: calculateTrend(currentMetrics.customerSatisfaction, previousValues.customerSatisfaction || 0),
      tooltipContent: "Customer Trust Index. High satisfaction increases retention and lowers future acquisition costs.",
    },
    {
      title: 'Awareness',
      value: currentMetrics.brandAwareness,
      format: (val: number) => `${val.toFixed(1)}%`,
      icon: Users,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
      glow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]',
      gradient: 'from-indigo-500/20 to-indigo-400/20',
      target: 60,
      description: 'Brand recognition level',
      trend: calculateTrend(currentMetrics.brandAwareness, previousValues.brandAwareness || 0),
      tooltipContent: "The percentage of the total addressable market that recognizes your brand. Acts as a multiplier on all performance marketing.",
    },
    {
      title: 'Brand Adstock',
      value: Object.values(context.engineState?.adstock || {}).reduce((a, b) => a + b, 0),
      format: (val: number) => `$${(val / 1000).toFixed(0)}k`,
      icon: Sparkles,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
      gradient: 'from-amber-500/20 to-amber-400/20',
      target: 200000,
      description: 'Carryover brand momentum',
      trend: 'up',
      tooltipContent: "Cumulative branding momentum that decays over time. Represents the lingering effect of past advertising.",
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-emerald-400" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getTrendColor = (current: number, target: number) => {
    const progress = (current / target) * 100;
    if (progress >= 75) return 'text-emerald-400';
    if (progress >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* Main KPI Cards with Animations */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
              <Card className={`relative overflow-hidden ${kpi.glow} border ${kpi.borderColor} bg-slate-900/40 backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}>
                {/* Sparkles effect on hover */}
                {showSparkles === kpi.title && (
                  <div className="absolute inset-0 pointer-events-none z-0">
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
                    className="absolute top-2 right-2 z-20"
                  >
                    <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white animate-pulse border-none shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Milestone!
                    </Badge>
                  </motion.div>
                )}

                <CardHeader className="pb-2 relative z-10 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <motion.div
                      className={`p-2 rounded-lg ${kpi.bgColor} ring-1 ring-inset ${kpi.borderColor}`}
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
                          <Zap className="h-3 w-3 text-emerald-400" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xs font-semibold tracking-wider text-slate-400 mt-2 uppercase flex items-center justify-between">
                    {kpi.title}
                  <InfoTooltip iconOnly content={kpi.tooltipContent} position="bottom" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4 relative z-10">
                  <div className={`text-3xl font-black tracking-tight ${kpi.color} drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]`}>
                    <CountUp
                      end={kpi.value}
                      duration={1.5}
                      separator=","
                      decimals={kpi.title === 'Revenue' ? 0 : 1}
                      prefix={kpi.title === 'Revenue' ? '$' : ''}
                      suffix={kpi.title !== 'Revenue' ? '%' : ''}
                    />
                  </div>
                  <div className="relative h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 rounded-full" />
                    {/* Animated gradient bar */}
                    <motion.div
                      className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${kpi.gradient}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-wider font-semibold text-slate-500">
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
        <Card className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 pointer-events-none" />
          <CardHeader className="relative z-10 border-b border-white/5">
            <CardTitle className="flex items-center gap-2 text-slate-200">
              <DollarSign className="h-5 w-5 text-indigo-400" />
              Resource Command Center
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 pt-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center p-4 rounded-xl bg-slate-800/50 border border-white/5">
                <div className="text-2xl font-black text-slate-200 tracking-tight">
                  <CountUp end={context.totalBudget} duration={1.5} separator="," prefix="$" />
                </div>
                <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase mt-1 flex items-center justify-center gap-1">
                  Total Budget
                  <InfoTooltip iconOnly content="The total capital allocated by the board for this game." position="bottom" />
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-800/50 border border-white/5">
                <div className="text-2xl font-black text-rose-400 tracking-tight drop-shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                  <CountUp
                    end={context.totalBudget - context.remainingBudget}
                    duration={1.5}
                    separator=","
                    prefix="$"
                  />
                </div>
                <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase mt-1 flex items-center justify-center gap-1">
                  Spent
                  <InfoTooltip iconOnly content="Cumulative capital deployed across selected tactics." position="bottom" />
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-800/50 border border-white/5">
                <div className="text-2xl font-black text-blue-400 tracking-tight drop-shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                  <CountUp end={context.remainingBudget} duration={1.5} separator="," prefix="$" />
                </div>
                <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase mt-1 flex items-center justify-center gap-1">
                  Remaining
                  <InfoTooltip iconOnly content="Available reserves. Deploy this carefully across the Fiscal Year." position="bottom" />
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-800/50 border border-white/5">
                <div className="text-2xl font-black text-fuchsia-400 tracking-tight drop-shadow-[0_0_10px_rgba(217,70,239,0.2)]">
                  <CountUp end={context.kpis.profit} duration={1.5} separator="," prefix="$" />
                </div>
                <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase mt-1 flex items-center justify-center gap-1">
                  Profit
                  <InfoTooltip iconOnly content="Net earnings (Revenue minus Marketing Spend)." position="bottom" />
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <div className={`text-3xl font-black tracking-tighter drop-shadow-md ${roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  <CountUp end={roi} duration={1.5} decimals={1} suffix="%" />
                </div>
                <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mt-1 flex items-center justify-center gap-1">
                  Global ROI {roi >= 0 ? <TrendingUpIcon className="w-3 h-3 text-emerald-400"/> : <TrendingDown className="w-3 h-3 text-red-400"/>}
                  <InfoTooltip iconOnly content="Return on Investment. (Revenue generated minus Spend) / Spend. The ultimate test of efficiency." position="bottom" />
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <div className="relative h-2 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((context.totalBudget - context.remainingBudget) / context.totalBudget) * 100}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-xs font-bold tracking-wider text-slate-500 uppercase">
                <span>Burn Rate</span>
                <span className="text-blue-400">
                  {(((context.totalBudget - context.remainingBudget) / context.totalBudget) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Real-time Revenue Projection */}
      {quarter && selectedTactics.length > 0 && projectedRevenue > 0 && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="border border-amber-500/30 bg-gradient-to-r from-slate-900/60 to-amber-900/20 backdrop-blur-xl shadow-[0_0_20px_rgba(245,158,11,0.1)]">
              <CardHeader className="pb-2 border-b border-amber-500/10">
                <CardTitle className="flex items-center gap-2 text-amber-400 text-sm font-bold uppercase tracking-widest">
                  <div className="p-1.5 bg-amber-500/20 rounded-md">
                    <Zap className="h-4 w-4 text-amber-400 animate-pulse" />
                  </div>
                  Live Projection: Q{quarter.replace('Q', '')} Forward Guidance
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex-1 w-full text-center sm:text-left p-4 rounded-xl bg-slate-950/40 border border-white/5">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Estimated Q Revenue</div>
                    <div className="text-3xl font-black text-amber-400 tracking-tight drop-shadow-md">
                      <CountUp end={projectedRevenue} duration={1} separator="," prefix="$" />
                    </div>
                  </div>
                  <div className="hidden sm:block text-slate-600">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                  <div className="flex-1 w-full text-center sm:text-right p-4 rounded-xl bg-slate-950/40 border border-emerald-500/10">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Projected YTD Total</div>
                    <div className="text-4xl font-black text-emerald-400 tracking-tighter drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
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
        </AnimatePresence>
      )}

      {/* Quarterly Breakdown with Trends */}
      {showQuarterlyBreakdown && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-slate-900/40 backdrop-blur-xl border border-white/10">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-slate-200">Executive Timeline overview</CardTitle>
              <CardDescription className="text-slate-400">Chronological performance and milestone tracking</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map((q, index) => {
                  const quarterData = context.quarters[q];
                  const isActive = quarter === q;
                  const hasResults = quarterData.tactics.length > 0 || (quarterData.results.revenue !== undefined && quarterData.results.revenue > 0);
                  const revenue = quarterData.results.revenue || 0;
                  const budgetSpent = quarterData.budgetSpent || 0;
                  const trend = quarterTrends[q];
                  const quarterROI = budgetSpent > 0 ? ((revenue - budgetSpent) / budgetSpent) * 100 : 0;

                  return (
                    <motion.div
                      key={q}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className={`p-5 rounded-xl border relative overflow-hidden transition-all duration-300 ${
                        isActive 
                          ? 'border-blue-500/50 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/30' 
                          : hasResults
                            ? 'border-white/10 bg-slate-800/40 hover:bg-slate-800/60'
                            : 'border-white/5 bg-slate-900/20 opacity-50'
                      }`}
                    >
                      {isActive && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />}
                      
                      <div className="flex items-center justify-between mb-4">
                        <h4 className={`text-xl font-black ${isActive ? 'text-blue-400' : 'text-slate-300'}`}>{q}</h4>
                        <div className="flex items-center gap-2">
                          {isActive && <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-none font-bold tracking-widest uppercase text-[9px]">Active</Badge>}
                          {hasResults && !isActive && <Badge className="bg-slate-700/50 text-slate-400 hover:bg-slate-700/70 border-none uppercase text-[9px]">Archived</Badge>}
                          {hasResults && trend === 'up' && (
                            <motion.div
                              animate={{ y: [0, -2, 0] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <TrendingUp className="h-4 w-4 text-emerald-400" />
                            </motion.div>
                          )}
                          {hasResults && trend === 'down' && (
                            <TrendingDown className="h-4 w-4 text-rose-400" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Revenue</span>
                          <span className={`text-lg font-black tracking-tight ${hasResults ? 'text-slate-200' : 'text-slate-600'}`}>
                            {hasResults ? <CountUp end={revenue} duration={1} separator="," prefix="$" /> : '$0'}
                          </span>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Op. Budget</span>
                          <span className={`text-sm font-bold tracking-tight ${hasResults ? 'text-rose-400' : 'text-slate-600'}`}>
                            {hasResults ? <CountUp end={budgetSpent} duration={1} separator="," prefix="$" /> : '$0'}
                          </span>
                        </div>
                        {hasResults && (
                          <div className="flex justify-between items-end pt-3 border-t border-white/5 mt-3">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quarterly ROI</span>
                            <span className={`text-sm font-black tracking-tighter ${quarterROI >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
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
// Note: We need a generic ArrowRight import for the projection, so let's import it from lucide
// Will check/fix next tool call if missing.
