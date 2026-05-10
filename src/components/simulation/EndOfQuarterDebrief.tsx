"use client";

import { useMemo } from 'react';
import { ArrowRight, BarChart3, CheckCircle2, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildSimulationForecast, formatForecastValue, type QuarterKey } from '@/lib/simulationForecast';
import type { SimulationContext, Tactic } from '@/lib/simMachine';
import { cn } from '@/lib/utils';

interface EndOfQuarterDebriefProps {
  context: SimulationContext;
  quarter: QuarterKey;
  selectedTactics: Tactic[];
  onConfirm: () => void;
  isOpen?: boolean;
  mode?: 'modal' | 'page';
  onBack?: () => void;
}

export function EndOfQuarterDebrief({
  isOpen = true,
  context,
  quarter,
  selectedTactics,
  onConfirm,
  mode = 'modal',
  onBack,
}: EndOfQuarterDebriefProps) {
  const forecast = useMemo(
    () => buildSimulationForecast(context, quarter, selectedTactics),
    [context, quarter, selectedTactics],
  );

  if (!isOpen) return null;

  const positiveMoves = forecast.deltaFromCurrent.filter((metric) => metric.delta > 0);
  const negativeMoves = forecast.deltaFromCurrent.filter((metric) => metric.delta < 0);
  const nextQuarterLabel = quarter === 'Q4' ? 'View annual debrief' : `Continue to ${quarter === 'Q1' ? 'Q2' : quarter === 'Q2' ? 'Q3' : 'Q4'}`;

  const isPage = mode === 'page';

  return (
    <div
      className={cn(
        isPage
          ? 'mx-auto max-w-6xl'
          : 'relative z-20 rounded-[24px] border border-slate-200 bg-white shadow-xl md:fixed md:inset-0 md:z-[100] md:overflow-y-auto md:bg-slate-950/70 md:px-4 md:py-8 md:backdrop-blur-sm',
      )}
    >
      <div
        className={cn(
          'mx-auto rounded-[24px] bg-white',
          isPage ? 'max-w-6xl border border-slate-200 shadow-xl' : 'max-w-5xl border-0 border-slate-200 md:rounded-xl md:border md:shadow-2xl',
        )}
      >
        <header className="border-b border-slate-200 p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{quarter} debrief</p>
          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">What changed and why</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                This review translates your selected moves into business outcomes before the simulation advances the quarter.
              </p>
            </div>
            <div className="hidden gap-3 md:flex">
              {onBack ? (
                <Button type="button" variant="outline" className="rounded-md border-slate-300 bg-white text-slate-800" onClick={onBack}>
                  Back to plan
                </Button>
              ) : null}
              <Button type="button" className="rounded-md bg-slate-950 text-white hover:bg-slate-800" onClick={onConfirm}>
                {nextQuarterLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
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
        <div className="sticky bottom-0 border-t border-slate-200 bg-white/96 p-4 backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:justify-end">
            {onBack ? (
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl border-slate-300 bg-white text-slate-800 md:w-auto md:min-w-[180px]"
                onClick={onBack}
              >
                Back to plan
              </Button>
            ) : null}
            <Button
              type="button"
              className="w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800 md:w-auto md:min-w-[240px]"
              onClick={onConfirm}
            >
              {nextQuarterLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
