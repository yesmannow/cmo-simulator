"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { SimulationContext, Tactic, processQuarterAdvance } from '@/lib/simMachine';
import { ArrowRight, TrendingUp, TrendingDown, BrainCircuit, Activity, BarChart3, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';


interface EndOfQuarterDebriefProps {
  isOpen: boolean;
  context: SimulationContext;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  selectedTactics: Tactic[];
  onConfirm: () => void;
}

export function EndOfQuarterDebrief({ isOpen, context, quarter, selectedTactics, onConfirm }: EndOfQuarterDebriefProps) {
  const [step, setStep] = useState(0);

  // Compute the predictive results
  const predictiveResult = useMemo(() => {
    if (!isOpen) return null;
    
    // Create a temporary context with the selected tactics applied to the current quarter
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
    
    return processQuarterAdvance(tempContext, quarter);
  }, [isOpen, context, quarter, selectedTactics]);

  // Generate Causal Insights
  const insights = useMemo(() => {
    if (!predictiveResult) return [];
    const logs = [];
    const oldKpis = context.kpis;
    const newKpis = predictiveResult.newKpis;
    const synergy = 1.0;

    // 1. Synergy Insight
    if (synergy > 1.1) {
      logs.push({
        title: "Synergistic Amplifier",
        desc: `Your tactic combination created a ${((synergy - 1) * 100).toFixed(0)}% efficiency boost across all channels.`,
        type: 'positive',
        icon: Zap
      });
    } else if (synergy < 0.9) {
      logs.push({
        title: "Fragmented Strategy",
        desc: "Your tactics lack synergy, causing a minor penalty to overall campaign effectiveness.",
        type: 'negative',
        icon: AlertTriangle
      });
    }

    // 2. Brand Insight
    const brandDiff = newKpis.brandAwareness - oldKpis.brandAwareness;
    if (brandDiff > 2) {
      logs.push({
        title: "Brand Equity Grown",
        desc: `Your long-term investments increased Brand Awareness by ${brandDiff.toFixed(1)}%, lowering future acquisition costs.`,
        type: 'positive',
        icon: TrendingUp
      });
    } else if (brandDiff < 0) {
      logs.push({
        title: "Brand Decay",
        desc: `Underinvestment in brand led to a ${Math.abs(brandDiff).toFixed(1)}% drop in awareness. Performance channels will become more expensive next quarter.`,
        type: 'negative',
        icon: TrendingDown
      });
    }

    // 3. Revenue vs Market Share 
    const revDiff = newKpis.revenue - oldKpis.revenue;
    const shareDiff = newKpis.marketShare - oldKpis.marketShare;
    if (revDiff > 100000 && shareDiff <= 0.5) {
      logs.push({
        title: "Harvesting Yield",
        desc: "High revenue growth without proportional market share growth indicates you are successfully monetizing your existing audience.",
        type: 'neutral',
        icon: BarChart3
      });
    } else if (shareDiff > 1) {
      logs.push({
        title: "Market Penetration",
        desc: `You captured ${shareDiff.toFixed(1)}% of the market. This structural gain forces competitors to react.`,
        type: 'positive',
        icon: Activity
      });
    }

    return logs;
  }, [predictiveResult, context.kpis, selectedTactics]);

  // Auto-advance animation steps
  useEffect(() => {
    if (isOpen) {
      setStep(0);
      const timer1 = setTimeout(() => setStep(1), 1500);
      const timer2 = setTimeout(() => setStep(2), 3500);
      return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }
  }, [isOpen]);

  if (!isOpen || !predictiveResult) return null;

  const oldKpis = context.kpis;
  const newKpis = predictiveResult.newKpis;

  const renderMetric = (label: string, oldVal: number, newVal: number, isCurrency = false) => {
    const diff = newVal - oldVal;
    const isPositive = diff > 0;
    const isNeutral = diff === 0;
    
    return (
      <div className="flex flex-col space-y-2 p-4 bg-white/5 border border-white/10 rounded-2xl">
        <span className="text-xs uppercase tracking-widest text-blue-200/50 font-black">{label}</span>
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-black text-white truncate break-words">
            {isCurrency ? `$${newVal.toLocaleString()}` : newVal.toFixed(1)}
          </span>
          {!isNeutral && (
            <span className={cn("text-sm font-bold flex items-center gap-1", isPositive ? "text-emerald-400" : "text-red-400", "mt-1")}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {isPositive ? '+' : ''}{isCurrency ? `$${diff.toLocaleString()}` : diff.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 overflow-hidden">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Header Panel */}
          <GlassCard className="lg:col-span-12 p-8 border-t-4 border-t-primary shadow-[0_10px_40px_rgba(59,130,246,0.15)] bg-slate-900/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: step >= 0 ? 1 : 0, x: step >= 0 ? 0 : -20 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-xs uppercase tracking-widest mb-4"
                >
                  <BrainCircuit className="h-4 w-4" />
                  Quarterly Debrief
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    {quarter}
                  </span> Results
                </h2>
                <p className="text-slate-400 mt-2 text-lg">Detailed cause and effect analysis for your strategic deployment.</p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: step >= 2 ? 1 : 0, scale: step >= 2 ? 1 : 0.8 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  onClick={onConfirm}
                  className="bg-primary hover:bg-primary/80 text-white px-8 py-6 rounded-2xl font-black text-lg h-auto shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.6)] hover:scale-105 transition-all w-full md:w-auto"
                >
                  {quarter === 'Q4' ? 'View Annual Review' : `Proceed to ${quarter === 'Q1' ? 'Q2' : quarter === 'Q2' ? 'Q3' : 'Q4'}`}
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </motion.div>
            </div>
          </GlassCard>

          {/* Metrics Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 20 }}
            className="lg:col-span-12"
          >
            <GlassCard className="p-8 border-white/5 bg-slate-900/60">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                <Activity className="h-5 w-5 text-emerald-400" />
                Key Performance Shifts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {renderMetric("Revenue", oldKpis.revenue, newKpis.revenue, true)}
                {renderMetric("Profit", oldKpis.profit, newKpis.profit, true)}
                {renderMetric("Market Share", oldKpis.marketShare, newKpis.marketShare)}
                {renderMetric("Brand Awareness", oldKpis.brandAwareness, newKpis.brandAwareness)}
                {renderMetric("Customer Sat", oldKpis.customerSatisfaction, newKpis.customerSatisfaction)}
              </div>
            </GlassCard>
          </motion.div>

          {/* Causal Insights Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 20 }}
            className="lg:col-span-12"
          >
            <GlassCard className="p-8 border-primary/20 bg-primary/5 shadow-[inset_0_0_50px_rgba(59,130,246,0.05)]">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                <BrainCircuit className="h-5 w-5 text-primary" />
                Causal Insights <span className="text-xs font-normal text-slate-400 italic normal-case ml-2">Why this happened</span>
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {insights.map((insight, idx) => {
                  const Icon = insight.icon;
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + (idx * 0.2) }}
                      className={cn(
                        "p-6 rounded-2xl border flex gap-4 items-start",
                        insight.type === 'positive' && "bg-emerald-500/10 border-emerald-500/30",
                        insight.type === 'negative' && "bg-red-500/10 border-red-500/30",
                        insight.type === 'neutral' && "bg-blue-500/10 border-blue-500/30",
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-xl",
                        insight.type === 'positive' && "bg-emerald-500/20 text-emerald-400",
                        insight.type === 'negative' && "bg-red-500/20 text-red-500",
                        insight.type === 'neutral' && "bg-blue-500/20 text-blue-400",
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">{insight.title}</h4>
                        <p className={cn(
                          "text-sm leading-relaxed",
                          insight.type === 'positive' && "text-emerald-100/70",
                          insight.type === 'negative' && "text-red-100/70",
                          insight.type === 'neutral' && "text-blue-100/70",
                        )}>
                          {insight.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
                
                {insights.length === 0 && (
                  <div className="col-span-2 text-center p-12 border border-dashed border-white/10 rounded-2xl">
                    <p className="text-slate-400 italic">No major strategic deviations detected. Performance advanced strictly along baseline trajectory.</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function Zap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
