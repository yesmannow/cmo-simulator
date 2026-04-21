"use client";

import { Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
          <p className="text-sm leading-6 text-slate-700">{profile.primaryTradeoff}</p>
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

