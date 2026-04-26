'use client';

import type React from 'react';
import { cn } from '@/lib/utils';

export function StatCard({
  label,
  value,
  hint,
  icon,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm', className)}>
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="break-words text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
          <div className="mt-1 break-words text-xl leading-tight font-semibold tracking-tight text-slate-950">{value}</div>
          {hint && <div className="mt-1 break-words text-xs text-slate-600">{hint}</div>}
        </div>
        {icon && <div className="mt-0.5 shrink-0 text-slate-500">{icon}</div>}
      </div>
    </div>
  );
}

