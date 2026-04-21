'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ImmersiveLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  quarter?: string;
  hideHeader?: boolean;
}

export function ImmersiveLayout({
  children,
  title,
  subtitle,
  quarter,
  hideHeader = false,
}: ImmersiveLayoutProps) {
  return (
    <div className="relative w-full text-slate-950">
      <div className="relative z-10 mx-auto w-full">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className={cn('mb-6', hideHeader ? 'sr-only' : 'not-sr-only')}
        >
          <div className="space-y-2">
            {quarter && (
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{quarter}</p>
            )}
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
            {subtitle && (
              <p className="max-w-4xl text-sm leading-6 text-slate-600 sm:text-base">{subtitle}</p>
            )}
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          <motion.main
            key={title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
