"use client";

import { AlertTriangle, ArrowRight, Check, Plus, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Drawer } from '@/components/ui/Drawer';
import { type EnrichedTactic } from '@/lib/tactics';
import { getTacticBusinessProfile } from '@/lib/simulationForecast';

interface TacticCardProps {
  tactic: EnrichedTactic;
  isSelected: boolean;
  onAdd: () => void;
}

export function TacticCard({ tactic, isSelected, onAdd }: TacticCardProps) {
  const profile = getTacticBusinessProfile(tactic);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div>
            <h3 className="text-base font-semibold text-slate-950">{tactic.name}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{tactic.description || tactic.strategicRationale}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-slate-900 text-white hover:bg-slate-900">{profile.businessRole}</Badge>
            <Badge variant="outline" className="border-slate-300 text-slate-700">{profile.kpiPressure}</Badge>
          </div>
          <Drawer
            className="shadow-sm"
            summary={
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Decision drawer</span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                  <Target className="h-3.5 w-3.5 text-slate-500" />
                  Best use
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                  Tradeoff
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                  <AlertTriangle className="h-3.5 w-3.5 text-slate-500" />
                  Watch outs
                </span>
              </div>
            }
          >
            <dl className="grid gap-3 text-sm md:grid-cols-3">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Best used when</dt>
                <dd className="mt-1 leading-6 text-slate-700">{profile.bestUsedWhen}</dd>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tradeoff</dt>
                <dd className="mt-1 leading-6 text-slate-700">{profile.primaryTradeoff}</dd>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Watch out for</dt>
                <dd className="mt-1 leading-6 text-slate-700">{profile.watchOutFor}</dd>
              </div>
            </dl>
          </Drawer>
        </div>
        <div className="shrink-0 space-y-3 rounded-md border border-slate-200 bg-slate-50 p-3 md:w-40">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Investment</p>
          <p className="text-lg font-semibold text-slate-950">${tactic.cost.toLocaleString()}</p>
          <Button type="button" className="w-full rounded-md bg-slate-950 text-white hover:bg-slate-800" disabled={isSelected} onClick={onAdd}>
            {isSelected ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
            {isSelected ? 'In plan' : 'Add'}
          </Button>
        </div>
      </div>
    </article>
  );
}
