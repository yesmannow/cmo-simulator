'use client';

import { useMemo } from 'react';
import { AlertCircle, Eye, TrendingDown } from 'lucide-react';
import type { SimulationContext } from '@/lib/simMachine';
import { cn } from '@/lib/utils';

interface ExecutivePressureProps {
  currentQuarter: string;
  context: SimulationContext;
}

export function ExecutivePressure({ currentQuarter, context }: ExecutivePressureProps) {
  const pressure = useMemo(() => {
    const lowRevenue = context.kpis.revenue < (context.strategy.timeHorizon === '1-year' ? 500000 : 250000);
    const lowMarketShare = context.kpis.marketShare < 5;

    if (currentQuarter === 'Q1') {
      return {
        title: 'Board mandate',
        message: 'Establish a credible first-quarter plan. The board wants early traction, but not at the cost of reckless cash burn.',
        priority: 'Medium',
        tone: 'neutral',
        icon: Eye,
      };
    }

    if (currentQuarter === 'Q2' && lowRevenue) {
      return {
        title: 'Revenue pressure',
        message: 'The first-half revenue pace is behind plan. Rebalance toward moves that can create demand without exhausting the quarter reserve.',
        priority: 'High',
        tone: 'warning',
        icon: TrendingDown,
      };
    }

    if (currentQuarter === 'Q3' && lowMarketShare) {
      return {
        title: 'Market position risk',
        message: 'Market share is still thin. Decide whether to concentrate spend for a breakthrough or preserve cash for the final quarter.',
        priority: 'High',
        tone: 'warning',
        icon: AlertCircle,
      };
    }

    if (currentQuarter === 'Q4') {
      return {
        title: 'Final board review',
        message: 'This quarter determines the annual story. Prioritize moves that improve the final scorecard and make the debrief defensible.',
        priority: 'High',
        tone: 'critical',
        icon: AlertCircle,
      };
    }

    return {
      title: 'Growth mandate',
      message: 'Performance is moving, but the mix still needs discipline. Use the forecast to balance acquisition, brand carryover, and budget reserve.',
      priority: 'Medium',
      tone: 'neutral',
      icon: Eye,
    };
  }, [context.kpis.marketShare, context.kpis.revenue, context.strategy.timeHorizon, currentQuarter]);

  const Icon = pressure.icon;

  return (
    <section className={cn(
      'rounded-lg border p-5 shadow-sm',
      pressure.tone === 'warning' && 'border-amber-200 bg-amber-50',
      pressure.tone === 'critical' && 'border-red-200 bg-red-50',
      pressure.tone === 'neutral' && 'border-slate-200 bg-white',
    )}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-3">
          <div className={cn(
            'rounded-md border p-2',
            pressure.tone === 'warning' && 'border-amber-200 bg-white text-amber-800',
            pressure.tone === 'critical' && 'border-red-200 bg-white text-red-800',
            pressure.tone === 'neutral' && 'border-slate-200 bg-slate-50 text-slate-700',
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">{pressure.title}</h2>
            <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-800">{pressure.message}</p>
          </div>
        </div>
        <span className="w-fit rounded-sm border border-slate-300 bg-white px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
          {pressure.priority} priority
        </span>
      </div>
    </section>
  );
}

