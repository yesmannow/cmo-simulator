'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type RhombusTableShellProps = {
  title?: string;
  subtitle?: string;
  query: string;
  onQueryChange: (value: string) => void;
  queryPlaceholder?: string;
  filters?: ReactNode;
  meta?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  showCreditsLink?: boolean;
};

export function RhombusTableShell({
  title,
  subtitle,
  query,
  onQueryChange,
  queryPlaceholder = 'Search…',
  filters,
  meta,
  footer,
  children,
  className,
  showCreditsLink = false,
}: RhombusTableShellProps) {
  return (
    <div className={cn('rounded-2xl border border-slate-200 bg-white shadow-sm', className)}>
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <div className="min-w-0">
            {title ? <div className="text-sm font-semibold text-slate-950">{title}</div> : null}
            {subtitle ? <div className="mt-0.5 text-xs text-slate-500">{subtitle}</div> : null}
          </div>
          <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
            <div className="relative w-full max-w-lg">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder={queryPlaceholder}
                className="h-10 rounded-xl border-slate-200 bg-white pl-10 text-sm"
              />
            </div>
            {filters ? <div className="flex flex-wrap items-center gap-2">{filters}</div> : null}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 md:justify-end">
          {meta ? <div className="text-xs font-medium text-slate-500">{meta}</div> : null}
          {showCreditsLink ? (
            <Link className="text-xs font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-950" href="/sim/credits">
              Credits
            </Link>
          ) : null}
        </div>
      </div>

      {children}

      {footer ? (
        <div className="border-t border-slate-200 px-5 py-3 text-[11px] leading-5 text-slate-500">{footer}</div>
      ) : null}
    </div>
  );
}

