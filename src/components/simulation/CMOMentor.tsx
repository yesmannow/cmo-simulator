'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { BrainCircuit, MessageSquare, Info, AlertCircle, TrendingUp } from 'lucide-react';
import { Tactic, SimulationContext, processQuarterAdvance } from '@/lib/simMachine';
import { calculateTacticSynergy } from '@/lib/scoringEngine';

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
    return processQuarterAdvance(context, currentQuarter as 'Q1' | 'Q2' | 'Q3' | 'Q4');
  }, [context, currentQuarter, selectedTactics]);

  const synergy = useMemo(() => calculateTacticSynergy(selectedTactics as any), [selectedTactics]);
  
  const advice = useMemo(() => {
    if (selectedTactics.length === 0) {
      if (currentQuarter === 'Q1') {
        return {
          title: "Starting the Year",
          message: "Your first priority is identifying high-impact channels. Begin building Adstock early in the year so it compounds by Q4.",
          type: 'info'
        };
      }
      return {
        title: "Awaiting Strategy",
        message: "Select tactics to see how they interact. Look for channels that synergize well with your previous quarter's efforts.",
        type: 'info'
      };
    }

    if (predictiveState) {
      const rois = predictiveState.newEngineState.results.channelRoi;
      
      // Check for Saturation (Low ROI despite spend)
      const saturatedChannels = Object.entries(rois).filter(([channel, roi]) => roi > 0 && roi < 50); // Less than 50% ROI indicates severe saturation
      if (saturatedChannels.length > 0) {
        return {
          title: "Channel Saturation Detected",
          message: `Your spend on ${saturatedChannels[0][0].toUpperCase()} is hitting diminishing returns (est. ROI: ${saturatedChannels[0][1].toFixed(0)}%). Consider reallocating budget to other channels.`,
          type: 'warning'
        };
      }

      // Check for Synergy Bonus Check
      const hasSynergy = Object.values(rois).reduce((a, b) => a + b, 0) > 0 && synergy > 1.2;
      if (hasSynergy) {
        return {
          title: "Excellent Synergy Found",
          message: `You've successfully paired tactics that amplify each other. The advanced engine is projecting a ${((synergy - 1) * 100).toFixed(0)}% algorithmic performance boost to your secondary KPIs!`,
          type: 'success'
        };
      }

      // Check for Adstock from previous quarters
      const incomingAdstock = Object.values(context.engineState.adstock).reduce((a, b) => a + b, 0);
      if (incomingAdstock > 50000) {
        return {
          title: "Adstock Momentum",
          message: "Your brand is riding a wave of 'Adstock' from previous quarters. This carry-over awareness will naturally boost the effectiveness of your lower-funnel tactics this quarter.",
          type: 'success'
        };
      }
    }

    if (synergy < 1.0) {
      return {
        title: "Strategic Imbalance",
        message: "Your current mix is heavily weighted in one area. Diversifying into other categories like 'Events' or 'Partnerships' could provide better market coverage and reduce saturation risk.",
        type: 'warning'
      };
    }

    if (remainingBudget < 50000 && selectedTactics.length < 3) {
      return {
        title: "Budget Optimization",
        message: "You're running low on funds with few tactics. In real marketing, it's often better to skip a low-impact tactic and save budget for a 'Big Bet' later in the year.",
        type: 'tip'
      };
    }

    return {
      title: "Tactical Assessment",
      message: "The current mix is stable. Keep an eye on the ROI numbers when the quarter completes to learn which channels are most effective in this landscape.",
      type: 'info'
    };
  }, [selectedTactics, synergy, currentQuarter, remainingBudget, predictiveState, context]);

  const getIcon = () => {
    switch (advice.type) {
      case 'success': return <TrendingUp className="text-emerald-400 h-5 w-5" />;
      case 'warning': return <AlertCircle className="text-amber-400 h-5 w-5" />;
      case 'tip': return <Braincircuit className="text-purple-400 h-5 w-5" />;
      default: return <Info className="text-cyan-400 h-5 w-5" />;
    }
  };

  return (
    <GlassCard className="border-cyan-500/20">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
          <BrainCircuit className="h-6 w-6 text-cyan-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              CMO Mentor
              <span className="text-[10px] uppercase tracking-wider bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                AI Analysis
              </span>
            </h3>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            key={advice.title}
          >
            <div className="flex items-center gap-2 mb-2">
              {getIcon()}
              <span className="text-sm font-medium text-cyan-100">{advice.title}</span>
            </div>
            <p className="text-sm text-cyan-100/70 leading-relaxed italic">
              "{advice.message}"
            </p>
          </motion.div>
        </div>
      </div>
    </GlassCard>
  );
}

function Braincircuit(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 4.5V12" />
      <path d="M18 11V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v5" />
      <path d="M18 16.5V20" />
      <path d="M12 16.5V20" />
      <path d="M6 16.5V20" />
      <path d="M20 12v4.5" />
      <path d="M4 12v4.5" />
      <circle cx="12" cy="14" r="2" />
    </svg>
  );
}
