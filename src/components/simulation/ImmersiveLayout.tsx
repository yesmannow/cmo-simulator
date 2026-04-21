'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImmersiveLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  quarter?: string;
}

export function ImmersiveLayout({
  children,
  title,
  subtitle,
  quarter
}: ImmersiveLayoutProps) {
  return (
    <div className="relative w-full min-h-screen bg-slate-50 text-slate-950">
      <div className="relative z-10 mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="sr-only"
        >
          {quarter && (
            <p>{quarter}</p>
          )}
          <h1>{title}</h1>
          {subtitle && (
            <p>{subtitle}</p>
          )}
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
