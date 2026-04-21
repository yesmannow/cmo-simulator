'use client';

import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  hoverEffect?: boolean;
}

export function GlassCard({
  children,
  className,
  glowColor: _glowColor = 'transparent',
  hoverEffect = true,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      {...props}
      whileHover={hoverEffect ? { y: -1 } : {}}
      className={cn(
        'relative overflow-hidden rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm transition-colors duration-200',
        className
      )}
    >
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
