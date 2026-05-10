'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ImmersiveLayout } from '@/components/simulation/ImmersiveLayout';
import { RhombusTableShell } from '@/components/simulation/RhombusTableShell';
import { StatCard } from '@/components/crm/StatCard';
import { useSimulation } from '@/hooks/useSimulation';
import type { Tactic } from '@/lib/simMachine';

type QuarterKey = 'Q1' | 'Q2' | 'Q3' | 'Q4';
type QuarterFilter = QuarterKey | 'all';
type CategoryFilter = Tactic['category'] | 'all';
type CampaignRow = { quarter: QuarterKey; tactic: Tactic };

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) return '$0';
  return `$${Math.round(value).toLocaleString()}`;
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) return '0.0%';
  return `${value.toFixed(1)}%`;
}

function categoryLabel(category: Tactic['category']) {
  if (category === 'digital') return 'Digital';
  if (category === 'content') return 'Content';
  if (category === 'traditional') return 'Traditional';
  if (category === 'events') return 'Events';
  return 'Partnerships';
}

export default function CampaignsPage() {
  const { context, currentPhase, getCurrentQuarter } = useSimulation();

  const [quarterFilter, setQuarterFilter] = useState<QuarterFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<CampaignRow | null>(null);

  const currentQuarter = getCurrentQuarter();

  const quarterIndex = (q: QuarterKey) => (q === 'Q1' ? 1 : q === 'Q2' ? 2 : q === 'Q3' ? 3 : 4);
  const currentIndex = currentQuarter ? quarterIndex(currentQuarter) : null;

  const isPostRun = currentPhase === 'debrief' || currentPhase === 'completed';

  const getStatus = (q: QuarterKey) => {
    if (isPostRun) return 'Executed';
    if (!currentIndex) return 'Planned';
    return quarterIndex(q) < currentIndex ? 'Executed' : quarterIndex(q) === currentIndex ? 'Planned' : 'Planned';
  };

  const rows = useMemo(() => {
    const quarters: QuarterKey[] = ['Q1', 'Q2', 'Q3', 'Q4'];
    const all = quarters.flatMap((quarter) =>
      (context.quarters[quarter].tactics || []).map((tactic) => ({
        quarter,
        tactic,
      })),
    );

    return all
      .filter((row) => (quarterFilter === 'all' ? true : row.quarter === quarterFilter))
      .filter((row) => (categoryFilter === 'all' ? true : row.tactic.category === categoryFilter))
      .filter((row) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          row.tactic.name.toLowerCase().includes(q) ||
          (row.tactic.description || '').toLowerCase().includes(q)
        );
      });
  }, [categoryFilter, context.quarters, quarterFilter, query]);

  const totals = useMemo(() => {
    const spend = rows.reduce((sum, row) => sum + (row.tactic.cost || 0), 0);
    const time = rows.reduce((sum, row) => sum + (row.tactic.timeRequired || 0), 0);
    const count = rows.length;
    const byCategory = rows.reduce<Record<string, number>>((acc, row) => {
      acc[row.tactic.category] = (acc[row.tactic.category] || 0) + (row.tactic.cost || 0);
      return acc;
    }, {});
    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] as Tactic['category'] | undefined;
    return { spend, time, count, topCategory };
  }, [rows]);

  return (
    <ImmersiveLayout
      title="Campaigns"
      quarter="CRM View"
      subtitle="A CRM-style rollup of the tactics you’ve deployed (and what they were meant to change). Read-only: this view mirrors the simulation state."
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="grid gap-3 md:grid-cols-3">
          <StatCard label="Campaigns" value={`${totals.count}`} hint="Tactics across quarters" />
          <StatCard label="Spend" value={formatCurrency(totals.spend)} hint="Total spend in this view" />
          <StatCard
            label="Top Focus"
            value={totals.topCategory ? categoryLabel(totals.topCategory) : '—'}
            hint="Largest spend category"
          />
        </div>

        <RhombusTableShell
          title="Campaign Register"
          subtitle="Search and review deployed tactics. Read-only: filters and drill-down don’t affect outcomes."
          query={query}
          onQueryChange={setQuery}
          queryPlaceholder="Search campaigns…"
          filters={
            <div className="w-full space-y-2">
              <div className="grid grid-cols-2 gap-2 md:hidden">
                <select
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                  value={quarterFilter}
                  onChange={(e) => setQuarterFilter(e.target.value as QuarterFilter)}
                >
                  <option value="all">All Quarters</option>
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                </select>
                <select
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
                >
                  <option value="all">All Types</option>
                  <option value="digital">Digital</option>
                  <option value="content">Content</option>
                  <option value="traditional">Traditional</option>
                  <option value="events">Events</option>
                  <option value="partnerships">Partnerships</option>
                </select>
              </div>
              <div className="hidden flex-wrap items-center gap-2 md:flex">
                <FilterButton active={quarterFilter === 'all'} onClick={() => setQuarterFilter('all')}>
                  All Quarters
                </FilterButton>
                {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map((q) => (
                  <FilterButton key={q} active={quarterFilter === q} onClick={() => setQuarterFilter(q)}>
                    {q}
                  </FilterButton>
                ))}
                <span className="mx-1 hidden h-9 w-px bg-slate-200 lg:block" />
                <FilterButton active={categoryFilter === 'all'} onClick={() => setCategoryFilter('all')}>
                  All Types
                </FilterButton>
                {(['digital', 'content', 'traditional', 'events', 'partnerships'] as const).map((c) => (
                  <FilterButton key={c} active={categoryFilter === c} onClick={() => setCategoryFilter(c)}>
                    {categoryLabel(c)}
                  </FilterButton>
                ))}
              </div>
            </div>
          }
          meta={
            <>
              <span className="font-semibold text-slate-800">{rows.length}</span> campaigns
            </>
          }
        >
          <div className="px-5 py-4">
            <div className="space-y-3 md:hidden">
            {rows.length === 0 ? (
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
                No campaigns yet. Add tactics in a quarter to populate this view.
              </div>
            ) : (
              rows.map((row) => (
                <button
                  key={`${row.quarter}:${row.tactic.id}`}
                  type="button"
                  className="w-full rounded-[24px] border border-slate-200 bg-white p-4 text-left"
                  onClick={() => setSelected(row)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{row.quarter}</p>
                      <p className="mt-1 break-all text-sm font-semibold text-slate-950">{row.tactic.name}</p>
                    </div>
                    <Badge className="border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-50">
                      {getStatus(row.quarter)}
                    </Badge>
                  </div>
                  {row.tactic.description && <p className="mt-2 break-all text-sm leading-6 text-slate-600">{row.tactic.description}</p>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge className="border border-slate-200 bg-white text-slate-700 hover:bg-white">
                      {categoryLabel(row.tactic.category)}
                    </Badge>
                    <Badge className="border border-slate-200 bg-white text-slate-700 hover:bg-white">
                      {formatCurrency(row.tactic.cost)}
                    </Badge>
                    <Badge className="border border-slate-200 bg-white text-slate-700 hover:bg-white">
                      {row.tactic.timeRequired}h
                    </Badge>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="hidden overflow-auto lg:block">
            <table className="w-full min-w-[860px] table-fixed border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  <th className="sticky top-0 bg-white py-3 pr-4">Quarter</th>
                  <th className="sticky top-0 bg-white py-3 pr-4">Campaign</th>
                  <th className="sticky top-0 bg-white py-3 pr-4">Type</th>
                  <th className="sticky top-0 bg-white py-3 pr-4">Status</th>
                  <th className="sticky top-0 bg-white py-3 pr-4">Cost</th>
                  <th className="sticky top-0 bg-white py-3 pr-4">Time</th>
                  <th className="sticky top-0 bg-white py-3 pr-4">Intent</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-sm text-slate-600">
                      No campaigns yet. Add tactics in a quarter to populate this view.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr
                      key={`${row.quarter}:${row.tactic.id}`}
                      className="border-t border-slate-100 cursor-pointer hover:bg-slate-50"
                      onClick={() => setSelected(row)}
                    >
                      <td className="whitespace-nowrap py-4 pr-4 text-sm font-semibold text-slate-900">{row.quarter}</td>
                      <td className="min-w-0 py-4 pr-4">
                        <div className="truncate text-sm font-semibold text-slate-950" title={row.tactic.name}>
                          {row.tactic.name}
                        </div>
                        {row.tactic.description && (
                          <div className="mt-1 truncate text-xs text-slate-600" title={row.tactic.description}>
                            {row.tactic.description}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap py-4 pr-4">
                        <Badge className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
                          {categoryLabel(row.tactic.category)}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap py-4 pr-4">
                        <Badge className="border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-50">
                          {getStatus(row.quarter)}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap py-4 pr-4 text-sm text-slate-700">{formatCurrency(row.tactic.cost)}</td>
                      <td className="whitespace-nowrap py-4 pr-4 text-sm text-slate-700">{row.tactic.timeRequired}h</td>
                      <td className="break-all py-4 pr-4 text-xs text-slate-600">
                        Revenue {formatCurrency(row.tactic.expectedImpact.revenue)} · Share {row.tactic.expectedImpact.marketShare.toFixed(1)}% ·
                        Awareness {row.tactic.expectedImpact.brandAwareness.toFixed(1)}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          </div>
        </RhombusTableShell>

        <Dialog open={!!selected} onOpenChange={(open) => (!open ? setSelected(null) : null)}>
          <DialogContent className="max-w-2xl border-slate-200 bg-white text-slate-950">
            {selected && (
              <DialogHeader>
                <DialogTitle className="text-slate-950">{selected.tactic.name}</DialogTitle>
                <DialogDescription className="text-slate-600">
                  {selected.quarter} · {categoryLabel(selected.tactic.category)} · {formatCurrency(selected.tactic.cost)} · {selected.tactic.timeRequired}h
                </DialogDescription>
              </DialogHeader>
            )}

            {selected && (
              <div className="space-y-5">
                {selected.tactic.description && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    {selected.tactic.description}
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-3">
                  <StatCard label="Expected Revenue" value={formatCurrency(selected.tactic.expectedImpact.revenue)} />
                  <StatCard label="Expected Share" value={formatPercent(selected.tactic.expectedImpact.marketShare)} />
                  <StatCard label="Expected Awareness" value={formatPercent(selected.tactic.expectedImpact.brandAwareness)} />
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quarter Summary</div>
                      <div className="mt-1 text-sm text-slate-700">
                        Revenue {formatCurrency(context.quarters[selected.quarter].results.revenue)} · Profit{' '}
                        {formatCurrency(context.quarters[selected.quarter].results.profit)} · Market Share{' '}
                        {formatPercent(context.quarters[selected.quarter].results.marketShare)}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        Quarter results are aggregate outcomes; this campaign’s “expected” impact is directional guidance.
                      </div>
                    </div>
                    <Link
                      href={`/sim/${selected.quarter.toLowerCase()}`}
                      className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                      Open {selected.quarter}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ImmersiveLayout>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className={active ? 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}
    >
      {children}
    </Button>
  );
}
