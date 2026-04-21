'use client';

import { useMemo } from 'react';
import type React from 'react';
import { AlertTriangle, ArrowRight, BarChart3, Check, DollarSign, LineChart, Minus, PieChart, Plus, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CMOMentor } from '@/components/simulation/CMOMentor';
import { ExecutivePressure } from '@/components/simulation/ExecutivePressure';
import { buildSimulationForecast, formatForecastValue, getTacticBusinessProfile, type QuarterKey } from '@/lib/simulationForecast';
import type { EnrichedTactic } from '@/lib/tactics';
import type { SimulationContext, Tactic } from '@/lib/simMachine';
import { cn } from '@/lib/utils';

interface QuarterOperatingConsoleProps {
  context: SimulationContext;
  quarter: QuarterKey;
  title: string;
  subtitle: string;
  availableTactics: EnrichedTactic[];
  selectedTactics: Tactic[];
  onAddTactic: (tactic: Tactic) => void;
  onRemoveTactic: (tacticId: string) => void;
  onCompleteQuarter: () => void;
  canComplete: boolean;
  completeLabel: string;
  specialActions?: React.ReactNode;
}

export function QuarterOperatingConsole({
  context,
  quarter,
  title,
  subtitle,
  availableTactics,
  selectedTactics,
  onAddTactic,
  onRemoveTactic,
  onCompleteQuarter,
  canComplete,
  completeLabel,
  specialActions,
}: QuarterOperatingConsoleProps) {
  const forecast = useMemo(
    () => buildSimulationForecast(context, quarter, selectedTactics),
    [context, quarter, selectedTactics],
  );
  const selectedIds = new Set(selectedTactics.map((tactic) => tactic.id));
  const { budgetSummary } = forecast;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{quarter} Operating Console</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">{title}</h1>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">{subtitle}</p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            <span className="font-semibold text-slate-950">${budgetSummary.usedBudget.toLocaleString()}</span>
            <span> used of </span>
            <span className="font-semibold text-slate-950">${budgetSummary.quarterBudget.toLocaleString()}</span>
          </div>
        </div>
      </header>

      <ExecutivePressure currentQuarter={quarter} context={context} />

      <section className="grid gap-3 md:grid-cols-5">
        {forecast.deltaFromCurrent.map((metric) => (
          <MetricTile key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <main className="space-y-6">
          <Panel>
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Choose quarter moves</h2>
                <p className="text-sm leading-6 text-slate-600">
                  Compare purpose, tradeoff, and KPI pressure before adding budget to the plan.
                </p>
              </div>
              <Badge variant="outline" className="w-fit border-slate-300 bg-slate-50 text-slate-700">
                {selectedTactics.length} selected
              </Badge>
            </div>

            <div className="divide-y divide-slate-200">
              {availableTactics.map((tactic) => {
                const profile = getTacticBusinessProfile(tactic);
                const isSelected = selectedIds.has(tactic.id);
                return (
                  <article key={tactic.id} className="grid gap-4 py-5 lg:grid-cols-[minmax(0,1fr)_180px]">
                    <div className="min-w-0 space-y-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-slate-950">{tactic.name}</h3>
                          <p className="mt-1 text-sm leading-6 text-slate-600">{tactic.description || tactic.strategicRationale}</p>
                        </div>
                        <Badge className="w-fit bg-slate-900 text-white hover:bg-slate-900">{profile.businessRole}</Badge>
                      </div>

                      <dl className="grid gap-3 text-sm md:grid-cols-3">
                        <Detail label="Best used when" value={profile.bestUsedWhen} />
                        <Detail label="Tradeoff" value={profile.primaryTradeoff} />
                        <Detail label="Watch out for" value={profile.watchOutFor} />
                      </dl>

                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-sm bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                          {profile.kpiPressure}
                        </span>
                        <span className="rounded-sm bg-slate-100 px-2 py-1 text-xs font-medium capitalize text-slate-700">
                          {tactic.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-row items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 lg:flex-col lg:items-stretch">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Investment</p>
                        <p className="mt-1 text-lg font-semibold text-slate-950">${tactic.cost.toLocaleString()}</p>
                      </div>
                      <Button
                        type="button"
                        variant={isSelected ? 'outline' : 'default'}
                        className={cn(
                          'justify-center rounded-md',
                          isSelected ? 'border-slate-300 bg-white text-slate-600 hover:bg-white' : 'bg-slate-950 text-white hover:bg-slate-800',
                        )}
                        disabled={isSelected}
                        onClick={() => onAddTactic(tactic)}
                      >
                        {isSelected ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            In plan
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Add move
                          </>
                        )}
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Selected plan</h2>
                <p className="text-sm text-slate-600">These moves will be committed when you finalize the quarter.</p>
              </div>
              <span className={cn('text-sm font-semibold', budgetSummary.remainingBudget < 0 ? 'text-red-700' : 'text-slate-700')}>
                ${budgetSummary.remainingBudget.toLocaleString()} remaining
              </span>
            </div>

            {selectedTactics.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-500">
                No moves selected. Add at least one move to create a quarter plan.
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {selectedTactics.map((tactic) => {
                  const profile = getTacticBusinessProfile(tactic);
                  return (
                    <div key={tactic.id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium text-slate-950">{tactic.name}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {profile.businessRole} · ${tactic.cost.toLocaleString()} · {profile.kpiPressure}
                        </p>
                      </div>
                      <Button type="button" variant="ghost" className="w-fit text-red-700 hover:bg-red-50 hover:text-red-800" onClick={() => onRemoveTactic(tactic.id)}>
                        <Minus className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </main>

        <aside className="space-y-6">
          <Panel>
            <h2 className="text-lg font-semibold text-slate-950">Budget status</h2>
            <div className="mt-4 space-y-3">
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={cn('h-full rounded-full', budgetSummary.remainingBudget < 0 ? 'bg-red-600' : 'bg-slate-950')}
                  style={{ width: `${Math.min(budgetSummary.utilization * 100, 100)}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <BudgetFact label="Used" value={`$${budgetSummary.usedBudget.toLocaleString()}`} />
                <BudgetFact label="Reserve" value={`$${budgetSummary.remainingBudget.toLocaleString()}`} isWarning={budgetSummary.remainingBudget < 0} />
              </div>
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-slate-700" />
              <h2 className="text-lg font-semibold text-slate-950">Forecast logic</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              {forecast.explanationBullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-700" />
              <h2 className="text-lg font-semibold text-slate-950">Risks to manage</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              {forecast.riskWarnings.map((warning) => (
                <li key={warning} className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-950">
                  {warning}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-slate-700" />
              <h2 className="text-lg font-semibold text-slate-950">Channel readout</h2>
            </div>
            {forecast.channelBreakdown.length === 0 ? (
              <p className="mt-4 text-sm leading-6 text-slate-600">Add moves to generate a channel forecast.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {forecast.channelBreakdown.slice(0, 4).map((channel) => (
                  <div key={channel.channel} className="rounded-md border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold uppercase text-slate-800">{channel.channel}</p>
                      <p className="text-sm font-semibold text-slate-950">${Math.round(channel.contribution).toLocaleString()}</p>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">Projected ROI {channel.roi.toFixed(0)}% · adstock ${Math.round(channel.adstock).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <CMOMentor selectedTactics={selectedTactics} remainingBudget={budgetSummary.remainingBudget} currentQuarter={quarter} context={context} />

          {specialActions}

          <Button
            type="button"
            onClick={onCompleteQuarter}
            disabled={!canComplete}
            className={cn(
              'w-full rounded-md py-6 text-base font-semibold',
              canComplete ? 'bg-slate-950 text-white hover:bg-slate-800' : 'bg-slate-200 text-slate-400',
            )}
          >
            {completeLabel}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </aside>
      </section>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      {children}
    </section>
  );
}

function MetricTile({ metric }: { metric: ReturnType<typeof buildSimulationForecast>['deltaFromCurrent'][number] }) {
  const icons = {
    Revenue: DollarSign,
    Profit: BarChart3,
    'Market Share': Target,
    Awareness: TrendingUp,
    Satisfaction: Check,
  };
  const Icon = icons[metric.label as keyof typeof icons] || BarChart3;
  const isPositive = metric.delta >= 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{metric.label}</p>
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
        {formatForecastValue(metric.value, metric.format)}
      </p>
      <p className={cn('mt-1 text-sm font-medium', isPositive ? 'text-emerald-700' : 'text-red-700')}>
        {isPositive ? '+' : ''}{formatForecastValue(metric.delta, metric.format)}
      </p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 leading-6 text-slate-700">{value}</dd>
    </div>
  );
}

function BudgetFact({ label, value, isWarning = false }: { label: string; value: string; isWarning?: boolean }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={cn('mt-1 font-semibold', isWarning ? 'text-red-700' : 'text-slate-950')}>{value}</p>
    </div>
  );
}
