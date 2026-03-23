'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { BrainCircuit, MessageSquare, Info, AlertOctagon, TrendingUp, Zap, RadioReceiver } from 'lucide-react';
import { Tactic, SimulationContext, processQuarterAdvance } from '@/lib/simMachine';
import { calculateTacticSynergy } from '@/lib/scoringEngine';
import { cn } from '@/lib/utils';
import { InfoTooltip } from '@/components/ui/InfoTooltip';

interface CMOMentorProps {
  selectedTactics: Tactic[];
  remainingBudget: number;
  currentQuarter: string;
  context: SimulationContext;
}

export function CMOMentor({ selectedTactics, remainingBudget, currentQuarter, context }: CMOMentorProps) {
  // We can do a dry-run of the engine to see what will happen with the current tactics
  const predictiveState = useMemo(() => {
    if (selectedTactics.length === 0 || !context || !['Q1', 'Q2', 'Q3', 'Q4'].includes(currentQuarter)) return null;
    return processQuarterAdvance({
       ...context, 
       quarters: { ...context.quarters, [currentQuarter]: { ...context.quarters[currentQuarter as keyof typeof context.quarters], tactics: selectedTactics } }
    }, currentQuarter as 'Q1' | 'Q2' | 'Q3' | 'Q4');
  }, [context, currentQuarter, selectedTactics]);

  const synergy = useMemo(() => calculateTacticSynergy(selectedTactics as any), [selectedTactics]);
  
  const advice = useMemo(() => {
    if (selectedTactics.length === 0) {
      if (currentQuarter === 'Q1') {
        return {
          title: "Awaiting Input Vector",
          message: "Awaiting initial budget deployment. Focus on establishing core brand awareness streams.",
          type: 'info',
          color: 'cyan'
        };
      }
      return {
        title: "Strategy Required",
        message: "Deploy capital to activate predictive modeling. The engine is idle.",
        type: 'info',
        color: 'slate'
      };
    }

    if (predictiveState) {
      const rois = predictiveState.newEngineState?.results?.channelRoi || {};
      
      // Check for Saturation (Low ROI despite spend)
      const saturatedChannels = Object.entries(rois).filter(([channel, roi]) => (roi as number) > 0 && (roi as number) < 50);
      if (saturatedChannels.length > 0) {
        return {
          title: "Structural Saturation Detected",
          message: `Algorithm projects diminishing returns on ${saturatedChannels[0][0].toUpperCase()} (est. ROI: ${(saturatedChannels[0][1] as number).toFixed(0)}%). Recommend capital reallocation.`,
          type: 'warning',
          color: 'amber'
        };
      }

      // Check for Synergy Bonus Check
      const hasSynergy = Object.values(rois).reduce((a: any, b: any) => a + b, 0) > 0 && synergy > 1.2;
      if (hasSynergy) {
        return {
          title: "Optimal Synaptic Chain",
          message: `Machine learning models detect a ${((synergy - 1) * 100).toFixed(0)}% resonance boost between active vectors. Network effects achieved.`,
          type: 'success',
          color: 'primary'
        };
      }

      // Check for Adstock from previous quarters
      const incomingAdstock = Object.values(context.engineState.adstock).reduce((a, b) => a + b, 0);
      if (incomingAdstock > 50000) {
        return {
          title: "Echo Trajectory Captured",
          message: "Pre-existing brand momentum is amplifying lower-funnel acquisition rates. Maintain atmospheric pressure.",
          type: 'success',
          color: 'emerald'
        };
      }
    }

    if (synergy < 1.0) {
      return {
        title: "Suboptimal Alignment",
        message: "Network fragmentation detected. Diversification into broader channels will increase algorithmic stability.",
        type: 'warning',
        color: 'rose'
      };
    }

    if (remainingBudget < 50000 && selectedTactics.length < 3) {
      return {
        title: "Capital Warning",
        message: "High capital density in isolated channels. Strategic reserves depleted below standard variance thresholds.",
        type: 'tip',
        color: 'violet'
      };
    }

    return {
      title: "Tactical Assessment Stable",
      message: "Current deployment matrix is mathematically sound. Standing by for execution.",
      type: 'info',
      color: 'cyan'
    };
  }, [selectedTactics, synergy, currentQuarter, remainingBudget, predictiveState, context]);

  const styleMap = {
    primary: {
      bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", shadow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]", icon: Zap
    },
    emerald: {
      bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", shadow: "shadow-[0_0_30px_rgba(16,185,129,0.3)]", icon: TrendingUp
    },
    amber: {
      bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", shadow: "shadow-[inset_0_0_30px_rgba(245,158,11,0.1)]", icon: AlertOctagon
    },
    rose: {
      bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400", shadow: "shadow-[inset_0_0_30px_rgba(244,63,94,0.15)]", icon: Activity
    },
    violet: {
      bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400", shadow: "shadow-[0_0_20px_rgba(139,92,246,0.2)]", icon: BrainCircuit
    },
    slate: {
      bg: "bg-slate-500/10", border: "border-slate-500/30", text: "text-slate-400", shadow: "", icon: RadioReceiver
    },
    cyan: {
      bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", shadow: "shadow-[0_0_15px_rgba(6,182,212,0.2)]", icon: Info
    }
  };

  const activeStyle = styleMap[advice.color as keyof typeof styleMap];
  const Icon = activeStyle.icon;

  return (
    <GlassCard className={cn(
      "border-l-4 relative overflow-hidden transition-all duration-1000",
      activeStyle.bg, activeStyle.border, activeStyle.shadow,
      `border-l-${advice.color}-500/50`
    )}>
      {/* Background Synaptic Grid / Particles */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      {['primary', 'emerald'].includes(advice.color) && (
        <motion.div 
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 opacity-50"
        />
      )}

      <div className="p-6 relative z-10 flex gap-5 items-start">
        {/* Pulsing Core */}
        <div className="relative shrink-0">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={cn("absolute inset-0 blur-md rounded-full", activeStyle.bg)}
          />
          <div className={cn("relative p-3 rounded-2xl border backdrop-blur-md", activeStyle.bg, activeStyle.border)}>
            <Icon className={cn("h-6 w-6", activeStyle.text)} />
          </div>
        </div>

        {/* Intelligence Feed */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <h4 className={cn("text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2", activeStyle.text)}>
              Synaptic Insight Engine
              <InfoTooltip iconOnly position="right" content="Real-time algorithmic analysis of your current deployment matrix. Alerts you to synergy bonuses or budget warnings." />
            </h4>
            <div className="flex gap-1">
              <motion.div animate={{ height: [4, 12, 4] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className={cn("w-1 rounded-full opacity-50", `bg-${advice.color}-400`)} />
              <motion.div animate={{ height: [4, 8, 4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className={cn("w-1 rounded-full opacity-50", `bg-${advice.color}-400`)} />
              <motion.div animate={{ height: [4, 16, 4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className={cn("w-1 rounded-full opacity-50", `bg-${advice.color}-400`)} />
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={advice.title}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.4 }}
              className="space-y-1"
            >
              <h3 className="text-xl font-bold text-white tracking-tight">{advice.title}</h3>
              <p className="text-sm text-slate-300/80 leading-relaxed font-medium">"{advice.message}"</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </GlassCard>
  );
}

function Activity(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  );
}
