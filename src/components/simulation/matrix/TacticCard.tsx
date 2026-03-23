"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { EnrichedTactic } from '@/lib/tactics';
import { BrainCircuit, Zap, RefreshCw } from 'lucide-react';

interface TacticCardProps {
  tactic: EnrichedTactic;
  isSelected: boolean;
  onAdd: () => void;
}

export function TacticCard({ tactic, isSelected, onAdd }: TacticCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative z-10 w-full min-h-[300px] sm:min-h-[320px] group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="w-full h-full relative"
        initial={false}
        animate={{ rotateY: isHovered ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 25 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* =======================
            FRONT FACE 
        ========================*/}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ backfaceVisibility: "hidden" }}
        >
          <GlassCard 
            className={cn(
              "w-full h-full flex flex-col justify-between transition-colors duration-300",
              isSelected ? "border-primary/50 bg-primary/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]" : "border-white/5 hover:border-primary/30"
            )}
          >
            <div className="p-6 space-y-4 h-full flex flex-col">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold text-white transition-colors">{tactic.name}</h4>
                  <p className="text-xs font-black uppercase tracking-widest text-blue-200/40 mt-1">{tactic.category}</p>
                  {tactic.strategicRationale && (
                    <p className="text-sm text-blue-100/60 mt-3 leading-relaxed border-l-2 border-primary/30 pl-3 italic line-clamp-3">
                      {tactic.strategicRationale}
                    </p>
                  )}
                </div>
                {isSelected && (
                  <Badge className="bg-primary text-white border-none animate-pulse shrink-0 ml-2">Selected</Badge>
                )}
                {!isSelected && (
                   <RefreshCw className="h-4 w-4 text-white/20 mt-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              
              <div className="flex justify-between items-end pt-4 mt-auto">
                <div className="space-y-1">
                  <p className="text-xs text-blue-200/40 uppercase font-bold tracking-tighter">Required Investment</p>
                  <p className="text-2xl font-black text-white">${tactic.cost?.toLocaleString()}</p>
                </div>
                
                <Button
                  onClick={(e) => { e.stopPropagation(); onAdd(); }}
                  disabled={isSelected}
                  className={cn(
                    "rounded-full px-6 transition-all duration-300 font-bold",
                    isSelected 
                      ? "bg-white/10 text-white/40 cursor-not-allowed" 
                      : "bg-primary hover:bg-primary/80 text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                  )}
                >
                  {isSelected ? 'In Strategy' : 'Add to Plan'}
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* =======================
            BACK FACE 
        ========================*/}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <GlassCard 
            className={cn(
              "w-full h-full flex flex-col border-cyan-500/50 shadow-[0_10px_40px_rgba(6,182,212,0.15)] overflow-hidden",
              isSelected ? "bg-primary/10" : "bg-slate-900/95"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent pointer-events-none" />
            <div className="p-6 h-full relative z-10 flex flex-col">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-3">
                <div className="flex items-center gap-2 text-cyan-400">
                  <BrainCircuit className="h-5 w-5" />
                  <h5 className="text-[11px] font-black uppercase tracking-widest">Theoretical Baseline</h5>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-sm text-cyan-50/90 leading-relaxed font-medium">
                  {tactic.marketingPrinciple || "This tactic drives standard KPI acquisition modeling based on budget deployment."}
                </p>
                
                {tactic.synergyTags && tactic.synergyTags.length > 0 && (
                  <div className="pt-4 mt-4 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 mb-2 uppercase tracking-widest">
                      <Zap className="h-3.5 w-3.5" />
                      Synergy Profile
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tactic.synergyTags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/30 px-2 py-0">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button on Back as well so users can click without flipping back */}
              <div className="pt-4 mt-auto flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-150">
                <div className="space-y-1">
                   <p className="text-xs text-blue-200/40 uppercase font-bold tracking-tighter">Investment</p>
                   <p className="text-xl font-black text-white">${tactic.cost?.toLocaleString()}</p>
                </div>
                <Button
                  onClick={(e) => { e.stopPropagation(); onAdd(); }}
                  disabled={isSelected}
                  className={cn(
                    "rounded-full px-6 transition-all duration-300 font-bold shadow-lg shadow-primary/20",
                    isSelected 
                      ? "bg-white/10 text-white/40 cursor-not-allowed border-none" 
                      : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                  )}
                >
                  {isSelected ? 'In Strategy' : 'Add to Plan'}
                </Button>
              </div>

            </div>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
}
