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
  glowColor = 'rgba(59, 130, 246, 0.2)', // Default blue glow
  hoverEffect = true,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      {...props}
      whileHover={hoverEffect ? { 
        y: -4, 
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        boxShadow: `0 0 20px ${glowColor}`
      } : {}}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-colors duration-300',
        className
      )}
    >
      {/* Subtle Inner Glow */}
      <div 
        className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 50%)`,
        }}
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
