'use client';

import { useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawerProps {
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  contentClassName?: string;
}

export function Drawer({ summary, children, defaultOpen = false, className, contentClassName }: DrawerProps) {
  const contentId = useId();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn('rounded-lg border border-slate-200 bg-white', className)}>
      <button
        type="button"
        className="group flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((value) => !value)}
      >
        <div className="min-w-0">{summary}</div>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200',
            open ? 'rotate-180' : 'rotate-0',
          )}
        />
      </button>

      <div id={contentId} className={cn('px-3 pb-3', open ? 'block' : 'hidden', contentClassName)}>
        {children}
      </div>
    </div>
  );
}

