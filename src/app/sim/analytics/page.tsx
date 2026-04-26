'use client';

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, LineChart } from 'lucide-react';
import { ImmersiveLayout } from '@/components/simulation/ImmersiveLayout';
import { Panel } from '@/components/crm/Panel';
import { StatCard } from '@/components/crm/StatCard';
import { useSimulation } from '@/hooks/useSimulation';
import type { Channel } from '@/types/engine';

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) return '$0';
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (Math.abs(value) >= 10_000) return `$${Math.round(value / 1000).toLocaleString()}k`;
  return `$${Math.round(value).toLocaleString()}`;
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

export default function AnalyticsPage() {
  const { context } = useSimulation();

  const quarterSeries = useMemo(() => {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'] as const;
    return quarters.map((q) => ({
      quarter: q,
      revenue: context.quarters[q].results.revenue || 0,
      profit: context.quarters[q].results.profit || 0,
      share: context.quarters[q].results.marketShare || context.kpis.marketShare,
    }));
  }, [context.kpis.marketShare, context.quarters]);

  const lastEngine = context.engineState?.results;

  const channelSeries = useMemo(() => {
    const contributions = lastEngine?.channelContributions;
    const roi = lastEngine?.channelRoi;
    if (!contributions || !roi) return [];
    const entries = (Object.keys(contributions) as Channel[])
      .map((channel) => ({
        channel: CHANNEL_LABELS[channel],
        contribution: Math.round(contributions[channel] || 0),
        roi: Math.round(roi[channel] || 0),
      }))
      .filter((row) => row.contribution > 0 || row.roi > 0)
      .sort((a, b) => b.contribution - a.contribution);
    return entries;
  }, [lastEngine?.channelContributions, lastEngine?.channelRoi]);

  const totals = useMemo(() => {
    const totalRevenue = quarterSeries.reduce((sum, q) => sum + q.revenue, 0);
    const totalProfit = quarterSeries.reduce((sum, q) => sum + q.profit, 0);
    const spend = (context.totalBudget || 0) - (context.remainingBudget || 0);
    const roi = spend > 0 ? ((totalRevenue - spend) / spend) * 100 : 0;
    return { totalRevenue, totalProfit, spend, roi };
  }, [context.remainingBudget, context.totalBudget, quarterSeries]);

  const engineSnapshot = useMemo(() => {
    const results = context.engineState?.results;
    const market = context.engineState?.marketConditions;
    const totalCompetitorSpend = market ? Object.values(market.competitorSpend).reduce((a, b) => a + b, 0) : 0;
    const adstockTotal = context.engineState?.adstock ? Object.values(context.engineState.adstock).reduce((a, b) => a + b, 0) : 0;

    return {
      traffic: results?.traffic ?? 0,
      leads: results?.leads ?? 0,
      conversions: results?.conversions ?? 0,
      seasonalityIndex: market?.seasonalityIndex,
      economicIndex: market?.economicIndex,
      competitorSpend: totalCompetitorSpend,
      adstockTotal,
    };
  }, [context.engineState?.adstock, context.engineState?.marketConditions, context.engineState?.results]);

  return (
    <ImmersiveLayout
      title="Analytics"
      quarter="CRM View"
      subtitle="Board-friendly reporting: quarter performance + current channel contribution/ROI from the engine. Read-only."
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="grid gap-3 md:grid-cols-4">
          <StatCard label="Revenue" value={formatCurrency(totals.totalRevenue)} />
          <StatCard label="Profit" value={formatCurrency(totals.totalProfit)} />
          <StatCard label="Spend" value={formatCurrency(totals.spend)} hint="Budget used so far" />
          <StatCard label="ROI" value={`${totals.roi.toFixed(0)}%`} hint="(Revenue - Spend) / Spend" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel
            title="Quarter Performance"
            subtitle="Revenue and profit per quarter (populates as you complete quarters)."
            right={<Activity className="h-4 w-4 text-slate-500" />}
          >
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quarterSeries} margin={{ top: 10, right: 18, left: 0, bottom: 6 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="quarter" tickLine={false} axisLine={false} fontSize={12} stroke="#64748b" />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="#64748b"
                    tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(15,23,42,0.04)' }}
                    contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10 }}
                    formatter={(v: number, key: string) => [formatCurrency(v), key === 'revenue' ? 'Revenue' : 'Profit']}
                  />
                  <Bar dataKey="revenue" fill="#0f172a" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="profit" fill="#94a3b8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel
            title="Channel Contribution"
            subtitle="Current engine allocation outcome: contribution + ROI by channel."
            right={<LineChart className="h-4 w-4 text-slate-500" />}
          >
            {channelSeries.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                No channel output yet. Add tactics and complete a quarter to populate.
              </div>
            ) : (
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={channelSeries} layout="vertical" margin={{ top: 6, right: 18, left: 24, bottom: 6 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} stroke="#64748b" />
                    <YAxis type="category" dataKey="channel" tickLine={false} axisLine={false} fontSize={12} stroke="#64748b" />
                    <Tooltip
                      cursor={{ fill: 'rgba(15,23,42,0.04)' }}
                      contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10 }}
                      formatter={(v: number, key: string) => [key === 'contribution' ? formatCurrency(v) : `${v}%`, key === 'contribution' ? 'Contribution' : 'ROI']}
                    />
                    <Bar dataKey="contribution" fill="#0f172a" radius={[8, 8, 8, 8]} />
                    <Bar dataKey="roi" fill="#cbd5e1" radius={[8, 8, 8, 8]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Panel>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <Panel
            title="Engine Snapshot"
            subtitle="Latest engine tick translated into CRM metrics (useful for executive reporting)."
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard label="Traffic" value={engineSnapshot.traffic.toLocaleString()} hint="Estimated sessions" />
              <StatCard label="Leads" value={engineSnapshot.leads.toLocaleString()} hint="Derived from traffic" />
              <StatCard label="Conversions" value={engineSnapshot.conversions.toLocaleString()} hint="Derived from leads" />
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              These numbers are computed by the engine to make the simulation feel like a real operating dashboard. They’re not editable inputs.
            </div>
          </Panel>

          <Panel title="Market Conditions" subtitle="Context the engine used for this tick.">
            <div className="space-y-3">
              <MiniRow label="Seasonality" value={engineSnapshot.seasonalityIndex ? engineSnapshot.seasonalityIndex.toFixed(2) : '—'} />
              <MiniRow label="Economy" value={engineSnapshot.economicIndex ? engineSnapshot.economicIndex.toFixed(2) : '—'} />
              <MiniRow label="Competitor Spend" value={engineSnapshot.competitorSpend ? formatCurrency(engineSnapshot.competitorSpend) : '—'} />
              <MiniRow label="Adstock Pool" value={engineSnapshot.adstockTotal ? formatCurrency(engineSnapshot.adstockTotal) : '—'} />
            </div>
            <div className="mt-4 text-xs text-slate-600">
              Scenario + industry selection shapes seasonality and competitive pressure; quarter tactics determine how you respond.
            </div>
          </Panel>
        </div>
      </div>
    </ImmersiveLayout>
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
