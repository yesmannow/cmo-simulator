'use client';

import { useMemo } from 'react';
import { GitBranch, TrendingUp } from 'lucide-react';
import { ImmersiveLayout } from '@/components/simulation/ImmersiveLayout';
import { Panel } from '@/components/crm/Panel';
import { StatCard } from '@/components/crm/StatCard';
import { useSimulation } from '@/hooks/useSimulation';
import type { Channel } from '@/types/engine';

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) return '$0';
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  return `$${Math.round(value).toLocaleString()}`;
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) return '0%';
  return `${(value * 100).toFixed(1)}%`;
}

const CHANNEL_LABELS: Record<Channel, string> = {
  tv: 'TV',
  radio: 'Radio',
  print: 'Print',
  digital: 'Digital',
  social: 'Social',
  seo: 'SEO',
  events: 'Events',
  pr: 'PR',
};

export default function PipelinePage() {
  const { context } = useSimulation();

  const snapshot = useMemo(() => {
    const results = context.engineState?.results;
    const traffic = results?.traffic ?? 0;
    const leads = results?.leads ?? 0;
    const conversions = results?.conversions ?? 0;
    const incrementalSales = results?.incrementalSales ?? 0;
    const leadRate = traffic > 0 ? leads / traffic : 0;
    const conversionRate = leads > 0 ? conversions / leads : 0;
    const revenuePerConversion = conversions > 0 ? incrementalSales / conversions : 0;

    return {
      traffic,
      leads,
      conversions,
      incrementalSales,
      leadRate,
      conversionRate,
      revenuePerConversion,
    };
  }, [context.engineState?.results]);

  const stress = context.engineState?.stressMeters ?? { ceo: 75, cfo: 75, cmo: 75 };
  const market = context.engineState?.marketConditions;

  const channelMix = useMemo(() => {
    const contributions = context.engineState?.results?.channelContributions;
    const roi = context.engineState?.results?.channelRoi;
    if (!contributions || !roi) return [];
    return (Object.keys(contributions) as Channel[])
      .map((channel) => ({
        channel,
        label: CHANNEL_LABELS[channel],
        contribution: contributions[channel] || 0,
        roi: roi[channel] || 0,
      }))
      .filter((row) => row.contribution > 0 || row.roi > 0)
      .sort((a, b) => b.contribution - a.contribution)
      .slice(0, 6);
  }, [context.engineState?.results?.channelContributions, context.engineState?.results?.channelRoi]);

  return (
    <ImmersiveLayout
      title="Pipeline"
      quarter="CRM View"
      subtitle="A funnel-style view derived from the simulation engine outputs. Read-only: this view mirrors the sim state and doesn’t alter outcomes."
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="grid gap-3 md:grid-cols-4">
          <StatCard label="Traffic" value={snapshot.traffic.toLocaleString()} hint="Estimated site sessions" icon={<TrendingUp className="h-4 w-4" />} />
          <StatCard label="Leads" value={snapshot.leads.toLocaleString()} hint={`Lead rate ${formatPercent(snapshot.leadRate)}`} />
          <StatCard label="Conversions" value={snapshot.conversions.toLocaleString()} hint={`Close rate ${formatPercent(snapshot.conversionRate)}`} />
          <StatCard label="Revenue" value={formatCurrency(snapshot.incrementalSales)} hint={`Rev/conv ${formatCurrency(snapshot.revenuePerConversion)}`} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Panel
            title="Pipeline Flow"
            subtitle="This is a dashboard view (CRM-style) of what the engine thinks your funnel did on the latest tick."
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <StageBlock title="Traffic" value={snapshot.traffic.toLocaleString()} meta="Sessions" />
              <StageBlock title="Leads" value={snapshot.leads.toLocaleString()} meta={`Lead rate ${formatPercent(snapshot.leadRate)}`} />
              <StageBlock title="Conversions" value={snapshot.conversions.toLocaleString()} meta={`Close rate ${formatPercent(snapshot.conversionRate)}`} />
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                <GitBranch className="h-4 w-4 text-slate-500" />
                What this means in the sim
              </div>
              <ul className="mt-2 grid gap-1 text-sm text-slate-600">
                <li>Higher traffic comes from stronger channel response + synergy in the engine model.</li>
                <li>Leads and conversions are derived from the engine’s current lead/close assumptions.</li>
                <li>Quarter tactics still decide spend; this view just translates outcomes into a CRM-style funnel.</li>
              </ul>
            </div>
          </Panel>

          <Panel title="Executive Pressure" subtitle="A quick read on how the board feels right now.">
            <div className="space-y-3">
              <PressureRow label="CEO (growth)" value={stress.ceo} />
              <PressureRow label="CFO (efficiency)" value={stress.cfo} />
              <PressureRow label="CMO (team)" value={stress.cmo} />
            </div>
            <div className="mt-4 text-xs text-slate-600">
              These meters live in the engine state; your quarter decisions influence them indirectly via revenue and spend dynamics.
            </div>
          </Panel>

          <Panel title="Market Snapshot" subtitle="Context the engine is using right now.">
            <div className="grid gap-3">
              <MiniRow label="Seasonality" value={market ? market.seasonalityIndex.toFixed(2) : '—'} />
              <MiniRow label="Economy" value={market ? market.economicIndex.toFixed(2) : '—'} />
              <MiniRow
                label="Competitor spend"
                value={
                  market
                    ? formatCurrency(Object.values(market.competitorSpend).reduce((a, b) => a + b, 0))
                    : '—'
                }
              />
            </div>
          </Panel>

          <Panel title="Channel Mix" subtitle="Top channel contribution + ROI (latest tick).">
            {channelMix.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                No channel output yet. Complete a quarter to populate this panel.
              </div>
            ) : (
              <div className="space-y-3">
                {channelMix.map((row) => (
                  <div key={row.channel} className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>{row.label}</span>
                      <span>{Math.round(row.roi)}% ROI</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-slate-900"
                        style={{ width: `${Math.min(100, Math.max(3, (row.contribution / Math.max(1, snapshot.incrementalSales)) * 100))}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-slate-600">Contribution {formatCurrency(row.contribution)}</div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </ImmersiveLayout>
  );
}

function StageBlock({ title, value, meta }: { title: string; value: string; meta: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{title}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{value}</div>
      <div className="mt-1 text-xs text-slate-600">{meta}</div>
    </div>
  );
}

function PressureRow({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
        <span>{label}</span>
        <span>{pct}/100</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-slate-900" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function MiniRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
      <div className="min-w-0 text-xs font-semibold text-slate-700">{label}</div>
      <div className="min-w-0 break-all text-right text-xs font-semibold text-slate-950">{value}</div>
    </div>
  );
}
