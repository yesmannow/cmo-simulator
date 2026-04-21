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
    <div className={cn('rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
          <div className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{value}</div>
          {hint && <div className="mt-1 text-xs text-slate-600">{hint}</div>}
        </div>
        {icon && <div className="mt-0.5 text-slate-500">{icon}</div>}
      </div>
    </div>
  );
}

