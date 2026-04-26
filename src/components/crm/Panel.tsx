'use client';

import type React from 'react';
import { cn } from '@/lib/utils';

export function Panel({
  title,
  subtitle,
  right,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm', className)}>
      {(title || subtitle || right) && (
        <header className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {title && <h2 className="break-words text-sm font-semibold text-slate-950">{title}</h2>}
            {subtitle && <p className="mt-1 break-words text-sm text-slate-600">{subtitle}</p>}
          </div>
          {right && <div className="min-w-0 max-w-full shrink sm:shrink-0">{right}</div>}
        </header>
      )}
      <div className="min-w-0 px-5 py-4">{children}</div>
    </section>
  );
}

