'use client';

import { useMemo } from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { buildSimulationForecast, type QuarterKey } from '@/lib/simulationForecast';
import type { SimulationContext, Tactic } from '@/lib/simMachine';
import { cn } from '@/lib/utils';

interface CMOMentorProps {
  selectedTactics: Tactic[];
  remainingBudget: number;
  currentQuarter: string;
  context: SimulationContext;
}

export function CMOMentor({ selectedTactics, currentQuarter, context }: CMOMentorProps) {
  const quarter = currentQuarter as QuarterKey;
  const forecast = useMemo(() => {
    if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(currentQuarter)) return null;
    return buildSimulationForecast(context, quarter, selectedTactics);
  }, [context, currentQuarter, quarter, selectedTactics]);

  const guidance = useMemo(() => {
    if (!forecast || selectedTactics.length === 0) {
      return {
        tone: 'neutral',
        title: 'Choose a focused quarter plan',
        message: 'Start with moves that match the board mandate. The forecast will show budget pressure, KPI movement, and risk once you add tactics.',
      };
    }

    const hardWarning = forecast.riskWarnings.find((warning) => warning.includes('exceeds') || warning.includes('negative'));
    if (hardWarning) {
      return {
        tone: 'warning',
        title: 'Review before finalizing',
        message: hardWarning,
      };
    }

    const topChannel = forecast.channelBreakdown[0];
    if (topChannel && topChannel.roi > 120) {
      return {
        tone: 'positive',
        title: 'Plan has a clear efficiency signal',
        message: `${topChannel.channel.toUpperCase()} is carrying the strongest projected return. Keep an eye on concentration risk if you add more spend.`,
      };
    }

    return {
      tone: 'neutral',
      title: 'Plan is ready for comparison',
      message: forecast.explanationBullets[0] || 'Use the forecast and risk notes to decide whether this mix fits the quarter mandate.',
    };
  }, [forecast, selectedTactics.length]);

  const Icon = guidance.tone === 'warning' ? AlertTriangle : guidance.tone === 'positive' ? CheckCircle2 : Info;

  return (
    <section className={cn(
      'rounded-lg border p-4',
      guidance.tone === 'warning' && 'border-amber-200 bg-amber-50 text-amber-950',
      guidance.tone === 'positive' && 'border-emerald-200 bg-emerald-50 text-emerald-950',
      guidance.tone === 'neutral' && 'border-slate-200 bg-white text-slate-950',
    )}>
      <div className="flex gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <h3 className="text-sm font-semibold">{guidance.title}</h3>
          <p className="mt-1 text-sm leading-6 opacity-85">{guidance.message}</p>
        </div>
      </div>
    </section>
  );
}

