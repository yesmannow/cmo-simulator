'use client';

import type React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Flag, GitBranch, Layers3, LayoutDashboard, LineChart, Megaphone, Sparkles, Wrench } from 'lucide-react';
import { CompanyMark } from '@/components/simulation/CompanyMark';
import { useSimulation } from '@/hooks/useSimulation';
import { cn } from '@/lib/utils';

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/sim', icon: LayoutDashboard },
  { label: 'Strategy', href: '/sim/strategy', icon: Flag },
  { label: 'Quarter 1', href: '/sim/q1', icon: Layers3 },
  { label: 'Quarter 2', href: '/sim/q2', icon: Layers3 },
  { label: 'Quarter 3', href: '/sim/q3', icon: Layers3 },
  { label: 'Quarter 4', href: '/sim/q4', icon: Layers3 },
  { label: 'Debrief', href: '/sim/debrief', icon: BarChart3 },
];

const CRM_ITEMS: NavItem[] = [
  { label: 'Campaigns', href: '/sim/campaigns', icon: Megaphone },
  { label: 'Pipeline', href: '/sim/pipeline', icon: GitBranch },
  { label: 'Analytics', href: '/sim/analytics', icon: LineChart },
];

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) return '$0';
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (Math.abs(value) >= 10_000) return `$${Math.round(value / 1000).toLocaleString()}k`;
  return `$${Math.round(value).toLocaleString()}`;
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) return '0%';
  return `${value.toFixed(1)}%`;
}

function titleForPath(pathname: string) {
  if (pathname.startsWith('/sim/setup')) return 'Setup';
  if (pathname.startsWith('/sim/strategy')) return 'Strategy Session';
  if (pathname.startsWith('/sim/campaigns')) return 'Campaigns';
  if (pathname.startsWith('/sim/pipeline')) return 'Pipeline';
  if (pathname.startsWith('/sim/analytics')) return 'Analytics';
  if (pathname.startsWith('/sim/q1')) return 'Q1 Operating Plan';
  if (pathname.startsWith('/sim/q2')) return 'Q2 Operating Plan';
  if (pathname.startsWith('/sim/q3')) return 'Q3 Operating Plan';
  if (pathname.startsWith('/sim/q4')) return 'Q4 Operating Plan';
  if (pathname.startsWith('/sim/debrief')) return 'Debrief';
  return 'Overview';
}

export function CrmShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { context } = useSimulation();

  const companyName = context.strategy.companyName?.trim() || 'New Workspace';
  const industry = context.strategy.industry || 'saas';
  const logoStyle = context.strategy.logoStyle || 'orb';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] gap-0">
        <aside className="hidden w-[280px] shrink-0 border-r border-slate-200 bg-white lg:block">
          <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
            <CompanyMark companyName={companyName} industry={industry} size={34} style={logoStyle} />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-950">{companyName}</div>
              <div className="truncate text-xs text-slate-500">Workspace · {industry.replace('-', ' ')}</div>
            </div>
          </div>

          <nav className="px-3 py-4">
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              CMO Simulator
            </div>
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === '/sim'
                ? pathname === '/sim'
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'mt-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-slate-100 text-slate-950'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={cn('h-4 w-4', isActive ? 'text-slate-900' : 'text-slate-500')} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="mt-5 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              CRM Views
            </div>
            {CRM_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'mt-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-slate-100 text-slate-950'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={cn('h-4 w-4', isActive ? 'text-slate-900' : 'text-slate-500')} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto px-4 pb-5">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-slate-500" />
                  Run state
                </span>
                <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 shadow-sm">
                  {context.finalResults ? 'Completed' : 'In progress'}
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                Quick stats update as you finalize each quarter.
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="lg:hidden">
                  <CompanyMark companyName={companyName} industry={industry} size={34} style={logoStyle} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-950">{titleForPath(pathname)}</div>
                  <div className="text-xs text-slate-500">CMO Simulator · {companyName}</div>
                </div>
              </div>

              <div className="hidden items-center gap-2 md:flex">
                <StatTile label="Revenue" value={formatCurrency(context.kpis.revenue)} />
                <StatTile label="Profit" value={formatCurrency(context.kpis.profit)} />
                <StatTile label="Market" value={formatPercent(context.kpis.marketShare)} />
                <StatTile label="Brand" value={formatPercent(context.kpis.brandAwareness)} />
                <Link
                  href="/sim/setup"
                  className="ml-2 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  <Wrench className="h-4 w-4 text-slate-500" />
                  Workspace
                </Link>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-sm font-semibold text-slate-950">{value}</div>
    </div>
  );
}
