import type React from 'react';
import {
  BarChart3,
  Flag,
  GitBranch,
  Home,
  Layers3,
  LayoutDashboard,
  LineChart,
  Megaphone,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { resolveSimulationPath, type SimulationPhase } from '@/lib/simulationRouting';

export type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

export const CORE_NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/sim', icon: LayoutDashboard },
  { label: 'Strategy', href: '/sim/strategy', icon: Flag },
  { label: 'Debrief', href: '/sim/debrief', icon: BarChart3 },
];

export const QUARTER_NAV_ITEMS: NavItem[] = [
  { label: 'Quarter 1', href: '/sim/q1', icon: Layers3 },
  { label: 'Quarter 2', href: '/sim/q2', icon: Layers3 },
  { label: 'Quarter 3', href: '/sim/q3', icon: Layers3 },
  { label: 'Quarter 4', href: '/sim/q4', icon: Layers3 },
];

export const CRM_NAV_ITEMS: NavItem[] = [
  { label: 'Campaigns', href: '/sim/campaigns', icon: Megaphone },
  { label: 'Pipeline', href: '/sim/pipeline', icon: GitBranch },
  { label: 'Analytics', href: '/sim/analytics', icon: LineChart },
];

export const ALL_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/sim', icon: Home },
  { label: 'Setup', href: '/sim/setup', icon: Wrench },
  ...CORE_NAV_ITEMS.filter((item) => item.href !== '/sim'),
  ...QUARTER_NAV_ITEMS,
  ...CRM_NAV_ITEMS,
];

export function titleForPath(pathname: string) {
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

export function activeHref(pathname: string, href: string) {
  return href === '/sim' ? pathname === '/sim' : pathname.startsWith(href);
}

export function primaryNavItemForPath(pathname: string): NavItem {
  if (pathname.startsWith('/sim/setup')) return { label: 'Setup', href: '/sim/setup', icon: Wrench };
  if (pathname.startsWith('/sim/strategy')) return { label: 'Strategy', href: '/sim/strategy', icon: Flag };
  if (pathname.startsWith('/sim/q1')) return { label: 'Q1', href: '/sim/q1', icon: Layers3 };
  if (pathname.startsWith('/sim/q2')) return { label: 'Q2', href: '/sim/q2', icon: Layers3 };
  if (pathname.startsWith('/sim/q3')) return { label: 'Q3', href: '/sim/q3', icon: Layers3 };
  if (pathname.startsWith('/sim/q4')) return { label: 'Q4', href: '/sim/q4', icon: Layers3 };
  if (pathname.startsWith('/sim/campaigns')) return { label: 'Campaigns', href: '/sim/campaigns', icon: Megaphone };
  if (pathname.startsWith('/sim/pipeline')) return { label: 'Pipeline', href: '/sim/pipeline', icon: GitBranch };
  if (pathname.startsWith('/sim/analytics')) return { label: 'Analytics', href: '/sim/analytics', icon: LineChart };
  if (pathname.startsWith('/sim/debrief')) return { label: 'Debrief', href: '/sim/debrief', icon: BarChart3 };
  return { label: 'Overview', href: '/sim', icon: LayoutDashboard };
}

export function quarterNavItemForPhase(currentPhase: SimulationPhase): NavItem {
  const href = resolveSimulationPath(currentPhase);
  if (href.startsWith('/sim/q1')) return { label: 'Q1', href: '/sim/q1', icon: Layers3 };
  if (href.startsWith('/sim/q2')) return { label: 'Q2', href: '/sim/q2', icon: Layers3 };
  if (href.startsWith('/sim/q3')) return { label: 'Q3', href: '/sim/q3', icon: Layers3 };
  if (href.startsWith('/sim/q4')) return { label: 'Q4', href: '/sim/q4', icon: Layers3 };
  return { label: 'Quarter', href, icon: Sparkles };
}
