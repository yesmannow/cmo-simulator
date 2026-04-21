"use client";

import { useMemo } from 'react';
import { ArrowRight, BarChart3, CheckCircle2, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildSimulationForecast, formatForecastValue, type QuarterKey } from '@/lib/simulationForecast';
import type { SimulationContext, Tactic } from '@/lib/simMachine';
import { cn } from '@/lib/utils';

interface EndOfQuarterDebriefProps {
  isOpen: boolean;
  context: SimulationContext;
  quarter: QuarterKey;
  selectedTactics: Tactic[];
  onConfirm: () => void;
}

export function EndOfQuarterDebrief({ isOpen, context, quarter, selectedTactics, onConfirm }: EndOfQuarterDebriefProps) {
  const forecast = useMemo(
    () => buildSimulationForecast(context, quarter, selectedTactics),
    [context, quarter, selectedTactics],
  );

  if (!isOpen) return null;

  const positiveMoves = forecast.deltaFromCurrent.filter((metric) => metric.delta > 0);
  const negativeMoves = forecast.deltaFromCurrent.filter((metric) => metric.delta < 0);
  const nextQuarterLabel = quarter === 'Q4' ? 'View annual debrief' : `Continue to ${quarter === 'Q1' ? 'Q2' : quarter === 'Q2' ? 'Q3' : 'Q4'}`;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/70 px-4 py-8 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white shadow-2xl">
        <header className="border-b border-slate-200 p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{quarter} debrief</p>
          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">What changed and why</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                This review translates your selected moves into business outcomes before the simulation advances the quarter.
              </p>
            </div>
            <Button type="button" className="rounded-md bg-slate-950 text-white hover:bg-slate-800" onClick={onConfirm}>
              {nextQuarterLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {forecast.deltaFromCurrent.map((metric) => (
                <div key={metric.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {formatForecastValue(metric.value, metric.format)}
                  </p>
                  <p className={cn('mt-1 text-sm font-medium', metric.delta >= 0 ? 'text-emerald-700' : 'text-red-700')}>
                    {metric.delta >= 0 ? '+' : ''}{formatForecastValue(metric.delta, metric.format)}
                  </p>
                </div>
              ))}
            </div>

            <section className="rounded-lg border border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                <h3 className="text-lg font-semibold text-slate-950">What worked</h3>
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                {(positiveMoves.length > 0 ? positiveMoves : forecast.deltaFromCurrent.slice(0, 2)).map((metric) => (
                  <li key={metric.label}>
                    <span className="font-medium text-slate-950">{metric.label}</span> moved by {formatForecastValue(metric.delta, metric.format)} based on the current plan.
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-lg border border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-amber-700" />
                <h3 className="text-lg font-semibold text-slate-950">What to watch</h3>
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                {(negativeMoves.length > 0 ? negativeMoves.map((metric) => `${metric.label} declined by ${formatForecastValue(Math.abs(metric.delta), metric.format)}.`) : forecast.riskWarnings).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </section>

          <aside className="space-y-6">
            <section className="rounded-lg border border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-slate-700" />
                <h3 className="text-lg font-semibold text-slate-950">Why the model reacted</h3>
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                {forecast.explanationBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-lg border border-slate-200 p-5">
              <h3 className="text-lg font-semibold text-slate-950">Recommended next move</h3>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                {forecast.riskWarnings[0] ||
                  'Carry the strongest channel signal forward, then rebalance any spend that is not improving revenue, awareness, or market share.'}
              </p>
            </section>
          </aside>
        </main>
      </div>
    </div>
  );
}

