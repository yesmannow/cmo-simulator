"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, BookOpen, Target, TrendingUp, Lightbulb } from "lucide-react";

interface TacticDeepDiveProps {
  tacticName: string;
  category: string;
  description: string;
  strategyTip: string;
  marketImpact: string;
}

export function TacticDeepDive({ 
  tacticName, 
  category, 
  description, 
  strategyTip, 
  marketImpact 
}: TacticDeepDiveProps) {
  return (
    <div className="group relative">
      <div className="flex items-center gap-1.5 text-blue-400 cursor-help">
        <Info className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
          Strategic Context
        </span>
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          whileHover={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute z-[100] left-0 bottom-full mb-4 w-80 p-6 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl pointer-events-none opacity-0 transition-opacity"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <BookOpen className="h-4 w-4 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">{tacticName}</h4>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest leading-none">{category}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase">
                  <Target className="w-3 h-3" />
                  Objective
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase">
                  <TrendingUp className="w-3 h-3" />
                  Market Impact
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {marketImpact}
                </p>
              </div>

              <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                <div className="flex items-center gap-1 text-[10px] text-blue-400 font-bold uppercase mb-1">
                  <Lightbulb className="w-3 h-3" />
                  CMO Tip
                </div>
                <p className="text-[11px] text-slate-300 italic px-1">
                  "{strategyTip}"
                </p>
              </div>
            </div>
          </div>
          
          {/* Decorative Triangle */}
          <div className="absolute top-full left-6 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-slate-900 border-r-[8px] border-r-transparent" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
