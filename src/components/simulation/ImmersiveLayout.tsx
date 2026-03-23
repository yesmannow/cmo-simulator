'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroVisual from '@/components/ui/HeroVisual';

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
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#020617] text-white">
      {/* Persistent Background Visuals */}
      <div className="fixed inset-0 z-0">
        <HeroVisual />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Cinematic Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 space-y-4"
        >
          {quarter && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="px-4 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase">
                {quarter}
              </span>
            </motion.div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-white via-white/80 to-white/60 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          
          {subtitle && (
            <p className="text-lg text-blue-200/60 max-w-2xl mx-auto font-medium">
              {subtitle}
            </p>
          )}
        </motion.header>

        {/* Cinematic Page Transition Wrapper */}
        <AnimatePresence mode="wait">
          <motion.main
            key={title}
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-full"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
      
      {/* Subtle HUD scanline effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}
