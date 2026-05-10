'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { RunDetailsDrawer } from '@/components/simulation/RunDetailsDrawer';
import { RhombusTableShell } from '@/components/simulation/RhombusTableShell';
import { cn } from '@/lib/utils';

export type RunHistoryRow = {
  run_id: string;
  company_name: string;
  current_phase: string;
  status: 'in_progress' | 'completed';
  overall_score: number | null;
  grade: string | null;
  saved_at: string;
  canResume: boolean;
  context?: unknown | null;
};

type SortKey = 'company' | 'status' | 'phase' | 'saved' | 'score';

function safeDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleString();
}

function StatusBadge({ status }: { status: 'in_progress' | 'completed' }) {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
        Completed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
      In progress
    </span>
  );
}

function SortButton({
  label,
  sortKey,
  activeKey,
  direction,
  onChange,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  direction: 'asc' | 'desc';
  onChange: (key: SortKey) => void;
}) {
  const isActive = sortKey === activeKey;
  const Icon = !isActive ? ArrowUpDown : direction === 'asc' ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={() => onChange(sortKey)}
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-1 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 hover:bg-slate-100',
        isActive && 'text-slate-700',
      )}
      aria-label={`Sort by ${label}`}
    >
      {label}
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

export function RunHistoryTable({
  runs,
  isBusy,
  onResume,
  onDelete,
}: {
  runs: RunHistoryRow[];
  isBusy?: boolean;
  onResume: (runId: string) => void;
  onDelete: (runId: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('saved');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [detailsId, setDetailsId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return runs.filter((run) => {
      if (status !== 'all' && run.status !== status) return false;
      if (!needle) return true;
      return (
        (run.company_name || '').toLowerCase().includes(needle)
        || run.current_phase.toLowerCase().includes(needle)
        || run.status.toLowerCase().includes(needle)
        || (run.grade ?? '').toLowerCase().includes(needle)
      );
    });
  }, [runs, query, status]);

  const sorted = useMemo(() => {
    const by = [...filtered];
    const dir = sortDirection === 'asc' ? 1 : -1;
    const compareString = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: 'base' }) * dir;

    by.sort((a, b) => {
      switch (sortKey) {
        case 'company':
          return compareString(a.company_name || 'Untitled', b.company_name || 'Untitled');
        case 'status':
          return compareString(a.status, b.status);
        case 'phase':
          return compareString(a.current_phase, b.current_phase);
        case 'score': {
          const av = a.overall_score ?? -1;
          const bv = b.overall_score ?? -1;
          return (av - bv) * dir;
        }
        case 'saved':
        default: {
          const at = new Date(a.saved_at).getTime();
          const bt = new Date(b.saved_at).getTime();
          return (at - bt) * dir;
        }
      }
    });

    return by;
  }, [filtered, sortKey, sortDirection]);

  const handleSortChange = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDirection(key === 'company' ? 'asc' : 'desc');
  };

  const selectedRun = useMemo(() => {
    if (!detailsId) return null;
    return runs.find((run) => run.run_id === detailsId) ?? null;
  }, [detailsId, runs]);

  return (
    <RhombusTableShell
      query={query}
      onQueryChange={setQuery}
      queryPlaceholder="Search runs, phase, status, grade…"
      filters={
        <div className="flex items-center gap-2">
          <span className="hidden text-xs font-semibold uppercase tracking-wide text-slate-500 sm:inline">Status</span>
          <div className="inline-flex overflow-hidden rounded-xl border border-slate-200 bg-white">
            {(['all', 'in_progress', 'completed'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatus(value)}
                className={cn(
                  'px-3 py-2 text-xs font-semibold',
                  status === value ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-50',
                )}
              >
                {value === 'all' ? 'All' : value === 'in_progress' ? 'In progress' : 'Completed'}
              </button>
            ))}
          </div>
        </div>
      }
      meta={
        <>
          Showing <span className="font-semibold text-slate-800">{sorted.length}</span> of{' '}
          <span className="font-semibold text-slate-800">{runs.length}</span>
        </>
      }
      showCreditsLink
      footer={
        <>
          Table UI patterns adapted from{' '}
          <a
            className="font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-950"
            href="https://www.figma.com/community/file/1117974813137316859/rhombus-multi-purpose-dashboard-ui-kit"
            target="_blank"
            rel="noreferrer"
          >
            Rhombus Multi Purpose Dashboard UI Kit
          </a>{' '}
          by Designspace Team (CC BY 4.0).
        </>
      }
    >
      <div className="overflow-x-auto">
        <table className="min-w-[860px] w-full border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-left">
                <SortButton label="Company" sortKey="company" activeKey={sortKey} direction={sortDirection} onChange={handleSortChange} />
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton label="Status" sortKey="status" activeKey={sortKey} direction={sortDirection} onChange={handleSortChange} />
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton label="Phase" sortKey="phase" activeKey={sortKey} direction={sortDirection} onChange={handleSortChange} />
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton label="Saved" sortKey="saved" activeKey={sortKey} direction={sortDirection} onChange={handleSortChange} />
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton label="Score" sortKey="score" activeKey={sortKey} direction={sortDirection} onChange={handleSortChange} />
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-sm text-slate-600">
                  No matches. Try clearing filters or searching by company name.
                </td>
              </tr>
            ) : (
              sorted.map((run) => (
                <tr
                  key={run.run_id}
                  className="group cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50"
                  onClick={() => setDetailsId(run.run_id)}
                >
                  <td className="px-4 py-4 align-top">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-950">
                        {run.company_name || 'Untitled Company'}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        Run ID <span className="font-mono">{run.run_id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <StatusBadge status={run.status} />
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="text-sm font-medium text-slate-800">{run.current_phase}</div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="text-sm text-slate-700">{safeDate(run.saved_at)}</div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="text-sm font-semibold text-slate-950">{run.overall_score ?? '—'}</div>
                    <div className="text-xs text-slate-500">{run.grade ? `Grade ${run.grade}` : 'No grade yet'}</div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-lg border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                        disabled={!run.canResume || isBusy}
                        onClick={(event) => {
                          event.stopPropagation();
                          onResume(run.run_id);
                        }}
                      >
                        {run.status === 'completed' ? 'Review' : 'Resume'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-lg border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
                        disabled={isBusy}
                        onClick={(event) => {
                          event.stopPropagation();
                          onDelete(run.run_id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        open={Boolean(detailsId)}
        onOpenChange={(open) => {
          if (!open) setDetailsId(null);
        }}
      >
        <DialogContent
          className="fixed right-0 top-0 z-50 h-[100vh] w-full max-w-[720px] translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-none border-l border-slate-200 bg-white p-0 text-slate-950 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right-1/2 data-[state=closed]:slide-out-to-right-1/2 sm:rounded-none"
        >
          {selectedRun ? (
            <RunDetailsDrawer
              runId={selectedRun.run_id}
              companyName={selectedRun.company_name}
              status={selectedRun.status}
              currentPhase={selectedRun.current_phase}
              savedAt={selectedRun.saved_at}
              overallScore={selectedRun.overall_score}
              grade={selectedRun.grade}
              context={selectedRun.context ?? null}
              onResume={selectedRun.canResume && !isBusy ? () => onResume(selectedRun.run_id) : undefined}
            />
          ) : (
            <div className="p-6 text-sm text-slate-600">Loading run details…</div>
          )}
        </DialogContent>
      </Dialog>
    </RhombusTableShell>
  );
}
