'use client';

import { useMemo, type ReactNode } from 'react';
import { ArrowRight, Calendar, DollarSign, LineChart, Target, Users } from 'lucide-react';
import type { SimulationContext, QuarterData, Tactic } from '@/lib/simMachine';
import { buildSimulationScoreBreakdowns, deriveSimulationRecommendations } from '@/lib/simulationIntelligence';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type QuarterKey = 'Q1' | 'Q2' | 'Q3' | 'Q4';

type RunDetailsDrawerProps = {
  runId: string;
  companyName: string;
  status: 'in_progress' | 'completed';
  currentPhase: string;
  savedAt: string;
  overallScore: number | null;
  grade: string | null;
  context: unknown | null;
  onResume?: () => void;
};

function safeDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown save time';
  return date.toLocaleString();
}

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) return '$0';
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (Math.abs(value) >= 10_000) return `$${Math.round(value / 1000).toLocaleString()}k`;
  return `$${Math.round(value).toLocaleString()}`;
}

function formatSigned(value: number, formatter: (v: number) => string) {
  const sign = value > 0 ? '+' : '';
  return `${sign}${formatter(value)}`;
}

function hasQuarterActivity(quarter: QuarterData) {
  return quarter.tactics.length > 0 || quarter.budgetSpent > 0 || quarter.results.revenue > 0 || quarter.results.profit !== 0;
}

function isSimulationContext(value: unknown): value is SimulationContext {
  if (!value || typeof value !== 'object') return false;
  const v = value as SimulationContext;
  return Boolean(v.quarters && v.kpis && typeof v.totalBudget === 'number' && typeof v.remainingBudget === 'number');
}

function summarizeTactics(tactics: Tactic[]) {
  if (!tactics.length) return { count: 0, spend: 0, top: [] as Tactic[] };
  const spend = tactics.reduce((sum, tactic) => sum + (tactic.cost || 0), 0);
  const top = [...tactics].sort((a, b) => (b.cost || 0) - (a.cost || 0)).slice(0, 5);
  return { count: tactics.length, spend, top };
}

export function RunDetailsDrawer({
  runId,
  companyName,
  status,
  currentPhase,
  savedAt,
  overallScore,
  grade,
  context,
  onResume,
}: RunDetailsDrawerProps) {
  const parsed = useMemo(() => {
    if (!isSimulationContext(context)) return null;

    const quarters: QuarterKey[] = ['Q1', 'Q2', 'Q3', 'Q4'];
    const activeQuarters = quarters.filter((key) => hasQuarterActivity(context.quarters[key]));
    const baselineKey = activeQuarters[0] ?? null;
    const latestKey = activeQuarters[activeQuarters.length - 1] ?? null;
    const baseline = baselineKey ? context.quarters[baselineKey].results : null;
    const latest = latestKey ? context.quarters[latestKey].results : null;

    const kpiDelta = baseline && latest
      ? {
        revenue: latest.revenue - baseline.revenue,
        profit: latest.profit - baseline.profit,
        marketShare: latest.marketShare - baseline.marketShare,
        customerSatisfaction: latest.customerSatisfaction - baseline.customerSatisfaction,
        brandAwareness: latest.brandAwareness - baseline.brandAwareness,
        baselineKey,
        latestKey,
      }
      : null;

    const scoreBreakdowns = buildSimulationScoreBreakdowns(context);
    const recommendation = deriveSimulationRecommendations(context, scoreBreakdowns)[0] ?? null;

    const quarterTimeline = quarters.map((key) => {
      const quarter = context.quarters[key];
      const summary = summarizeTactics(quarter.tactics);
      return {
        key,
        hasActivity: hasQuarterActivity(quarter),
        budgetSpent: quarter.budgetSpent,
        timeSpent: quarter.timeSpent,
        results: quarter.results,
        ...summary,
      };
    });

    return {
      totalBudget: context.totalBudget,
      remainingBudget: context.remainingBudget,
      kpis: context.kpis,
      kpiDelta,
      recommendation,
      quarterTimeline,
    };
  }, [context]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Simulation run
            </div>
            <h2 className="mt-2 truncate text-xl font-semibold tracking-tight text-slate-950">
              {companyName || 'Untitled Company'}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-semibold text-slate-700">
                ID <span className="font-mono">{runId.slice(0, 8)}</span>
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-700">
                Phase {currentPhase}
              </span>
              <span className={cn(
                'rounded-full border px-2.5 py-1 text-[11px] font-semibold',
                status === 'completed'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-amber-200 bg-amber-50 text-amber-700',
              )}>
                {status === 'completed' ? 'Completed' : 'In progress'}
              </span>
            </div>
          </div>
          {onResume ? (
            <Button
              type="button"
              variant="default"
              className="h-10 shrink-0 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
              onClick={onResume}
            >
              {status === 'completed' ? 'Review run' : 'Resume run'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-500" />
            <span>Saved {safeDate(savedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">{overallScore ?? '—'}</span>
            <span className="text-slate-500">score</span>
            {grade ? <Badge variant="outline" className="border-slate-200 bg-white text-slate-700">Grade {grade}</Badge> : null}
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-auto px-6 py-6">
        {parsed?.recommendation ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Recommended next action</div>
            <div className="mt-2 text-base font-semibold text-slate-950">{parsed.recommendation.title}</div>
            <div className="mt-1 text-sm leading-6 text-slate-600">{parsed.recommendation.body}</div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-700">
                Phase {parsed.recommendation.phase}
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-700">
                Category {parsed.recommendation.category}
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-sm font-semibold text-slate-950">Run summary unavailable</div>
            <div className="mt-2 text-sm leading-6 text-slate-600">
              This run was saved without a full simulation context. Resume the run to rebuild details.
            </div>
          </div>
        )}

        {parsed?.kpiDelta ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">KPI deltas</div>
                <div className="mt-2 text-base font-semibold text-slate-950">
                  {parsed.kpiDelta.baselineKey} to {parsed.kpiDelta.latestKey}
                </div>
                <div className="mt-1 text-sm leading-6 text-slate-600">Movement between the first and latest active quarter.</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs text-slate-600">
                <div className="font-semibold text-slate-900">{formatCurrency(parsed.totalBudget - parsed.remainingBudget)}</div>
                <div className="mt-0.5">spent</div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DeltaTile
                icon={<DollarSign className="h-4 w-4" />}
                label="Revenue"
                value={formatSigned(parsed.kpiDelta.revenue, formatCurrency)}
                tone={parsed.kpiDelta.revenue >= 0 ? 'good' : 'bad'}
              />
              <DeltaTile
                icon={<LineChart className="h-4 w-4" />}
                label="Profit"
                value={formatSigned(parsed.kpiDelta.profit, formatCurrency)}
                tone={parsed.kpiDelta.profit >= 0 ? 'good' : 'bad'}
              />
              <DeltaTile
                icon={<Target className="h-4 w-4" />}
                label="Market share"
                value={formatSigned(parsed.kpiDelta.marketShare, (v) => `${v.toFixed(1)}%`)}
                tone={parsed.kpiDelta.marketShare >= 0 ? 'good' : 'bad'}
              />
              <DeltaTile
                icon={<Users className="h-4 w-4" />}
                label="Awareness"
                value={formatSigned(parsed.kpiDelta.brandAwareness, (v) => `${v.toFixed(1)}%`)}
                tone={parsed.kpiDelta.brandAwareness >= 0 ? 'good' : 'bad'}
              />
            </div>
          </div>
        ) : null}

        {parsed ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Quarter activity timeline</div>
            <div className="mt-2 text-sm leading-6 text-slate-600">A read-only audit trail of tactics and results per quarter.</div>

            <div className="mt-4 space-y-3">
              {parsed.quarterTimeline.map((q) => (
                <div key={q.key} className="rounded-xl border border-slate-200 bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold text-slate-950">{q.key}</div>
                      <span className={cn(
                        'rounded-full border px-2 py-0.5 text-[11px] font-semibold',
                        q.hasActivity ? 'border-slate-200 bg-white text-slate-700' : 'border-slate-200 bg-slate-100 text-slate-600',
                      )}>
                        {q.hasActivity ? 'Executed' : 'No activity'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-700">
                        {q.count} tactics
                      </span>
                      <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-700">
                        {formatCurrency(q.budgetSpent)} spend
                      </span>
                      <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-700">
                        {formatCurrency(q.results.revenue)} rev
                      </span>
                      <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-700">
                        {formatCurrency(q.results.profit)} profit
                      </span>
                    </div>
                  </div>

                  {q.top.length > 0 ? (
                    <div className="px-4 py-3">
                      <div className="text-xs font-semibold text-slate-700">Top tactics</div>
                      <div className="mt-2 grid gap-2">
                        {q.top.map((tactic) => (
                          <div key={tactic.id} className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-slate-950">{tactic.name}</div>
                              {tactic.description ? (
                                <div className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-600">
                                  {tactic.description}
                                </div>
                              ) : null}
                            </div>
                            <div className="shrink-0 text-right text-xs font-semibold text-slate-700">
                              {formatCurrency(tactic.cost)}
                              <div className="mt-0.5 text-[11px] font-medium text-slate-500">{tactic.timeRequired}h</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-sm text-slate-600">
                      No tactics logged for this quarter.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DeltaTile({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: 'good' | 'bad';
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span className="text-slate-500">{icon}</span>
          {label}
        </div>
        <div className={cn('text-sm font-semibold', tone === 'good' ? 'text-emerald-700' : 'text-rose-700')}>
          {value}
        </div>
      </div>
    </div>
  );
}
