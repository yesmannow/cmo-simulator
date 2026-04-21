'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { MessageSquareWarning, TrendingDown, Eye, AlertOctagon } from 'lucide-react';
import { SimulationContext } from '@/lib/simMachine';
import { InfoTooltip } from '@/components/ui/InfoTooltip';

interface ExecutivePressureProps {
  currentQuarter: string;
  context: SimulationContext;
}

export function ExecutivePressure({ currentQuarter, context }: ExecutivePressureProps) {
  const pressureMessage = useMemo(() => {
    // Determine context-aware board pressure
    const isUnderperforming = context.kpis.revenue < (context.strategy.timeHorizon === '1-year' ? 500000 : 250000);
    const lowMarketShare = context.kpis.marketShare < 5;

    if (currentQuarter === 'Q1') {
      return {
        title: "CEO Directive",
        message: "The board approved your budget, but expectations are sky-high. We need to see immediate traction. Don't play it too safe.",
        urgency: "medium",
        icon: Eye,
        color: "text-blue-400",
        bgUrl: "from-blue-500/10 to-transparent",
        borderColor: "border-blue-500/20"
      };
    }

    if (currentQuarter === 'Q2') {
      if (isUnderperforming) {
        return {
          title: "Board Inquiry",
          message: "Revenue velocity is severely lacking. The investors are asking questions. Time to pivot or double down on our performing assets.",
          urgency: "high",
          icon: TrendingDown,
          color: "text-rose-400",
          bgUrl: "from-rose-500/10 to-transparent",
          borderColor: "border-rose-500/30"
        };
      }
      return {
        title: "Growth Mandate",
        message: "Solid start, but our competitors aren't sleeping. The mandate this quarter is aggressive expansion. Secure more market share.",
        urgency: "medium",
        icon: AlertOctagon,
        color: "text-amber-400",
        bgUrl: "from-amber-500/10 to-transparent",
        borderColor: "border-amber-500/30"
      };
    }

    if (currentQuarter === 'Q3') {
      if (lowMarketShare) {
        return {
          title: "Critical Warning",
          message: "Our market penetration is stalling. If we don't break through the noise this quarter, we risk irrelevance next year. Deploy the war chest.",
          urgency: "critical",
          icon: MessageSquareWarning,
          color: "text-red-500",
          bgUrl: "from-red-600/20 to-transparent",
          borderColor: "border-red-500/50"
        };
      }
      return {
        title: "Scaling Pressure",
        message: "You've proven the model. Now the board demands scale. We need explosive growth going into Q4 to hit our annual targets.",
        urgency: "high",
        icon: AlertOctagon,
        color: "text-rose-400",
        bgUrl: "from-rose-500/10 to-transparent",
        borderColor: "border-rose-500/30"
      };
    }

    // Q4
    return {
      title: "Final Push",
      message: "This is it. The quarter that defines the fiscal year. Exhaust every viable channel. Leave nothing on the table.",
      urgency: "high",
      icon: MessageSquareWarning,
      color: "text-red-400",
      bgUrl: "from-red-500/10 to-transparent",
      borderColor: "border-red-500/30"
    };

  }, [currentQuarter, context.kpis, context.strategy.timeHorizon]);

  const Icon = pressureMessage.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
    >
      <GlassCard className={`relative overflow-hidden bg-gradient-to-br ${pressureMessage.bgUrl} border ${pressureMessage.borderColor} shadow-lg backdrop-blur-md`}>
        {/* Animated pulse for high urgency */}
        {pressureMessage.urgency === 'critical' && (
          <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
        )}
        
        <div className="p-5 flex items-start gap-4">
          <div className={`p-3 rounded-xl bg-slate-900/50 border ${pressureMessage.borderColor} shrink-0`}>
            <Icon className={`w-6 h-6 ${pressureMessage.color} ${pressureMessage.urgency === 'critical' ? 'animate-bounce' : ''}`} />
          </div>
          
          <div className="space-y-1">
            <h3 className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 ${pressureMessage.color}`}>
              {pressureMessage.title}
              <InfoTooltip iconOnly position="right" content="Contextual mandates from the Executive Board based on your current KPI performance." />
            </h3>
            <p className="text-sm font-medium leading-relaxed text-slate-300">
              {pressureMessage.message}
            </p>
            <div className="pt-2">
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border tracking-widest
                ${pressureMessage.urgency === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/50' : 
                  pressureMessage.urgency === 'high' ? 'bg-rose-500/20 text-rose-400 border-rose-500/50' : 
                  'bg-blue-500/20 text-blue-400 border-blue-500/50'}`}
              >
                Board Level Priority: {pressureMessage.urgency}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
