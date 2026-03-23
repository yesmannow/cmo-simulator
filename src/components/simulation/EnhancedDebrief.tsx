"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Download,
  TrendingUp,
  Target,
  Users,
  DollarSign,
  Award,
  Zap,
  Calendar,
  Share2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2
} from "lucide-react";
import { SimulationContext } from "@/lib/simMachine";
import CountUp from "react-countup";

interface EnhancedDebriefProps {
  context: SimulationContext;
  onExportPDF: () => void;
  onRestart: () => void;
  onShare?: () => void;
}

export function EnhancedDebrief({ context, onExportPDF, onRestart, onShare }: EnhancedDebriefProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Calculate metrics
  const quarterlyData = [
    { quarter: "Q1", revenue: context.quarters.Q1.results.revenue, share: context.quarters.Q1.results.marketShare },
    { quarter: "Q2", revenue: context.quarters.Q2.results.revenue, share: context.quarters.Q2.results.marketShare },
    { quarter: "Q3", revenue: context.quarters.Q3.results.revenue, share: context.quarters.Q3.results.marketShare },
    { quarter: "Q4", revenue: context.quarters.Q4.results.revenue, share: context.quarters.Q4.results.marketShare },
  ];

  const totalRevenue = quarterlyData.reduce((sum, q) => sum + q.revenue, 0);
  const finalMarketShare = context.quarters.Q4.results.marketShare;
  
  const getGrade = (score: number) => {
    if (score >= 90) return { grade: "L", label: "LEGENDARY", color: "text-blue-400", border: "border-blue-500/50", glow: "shadow-blue-500/20" };
    if (score >= 80) return { grade: "A", label: "EXECUTIVE", color: "text-emerald-400", border: "border-emerald-500/50", glow: "shadow-emerald-500/20" };
    if (score >= 70) return { grade: "B", label: "STRATEGIST", color: "text-indigo-400", border: "border-indigo-500/50", glow: "shadow-indigo-500/20" };
    return { grade: "C", label: "MANAGER", color: "text-amber-400", border: "border-amber-500/50", glow: "shadow-amber-500/20" };
  };

  const overallScore = Math.round((totalRevenue / 2000000) * 50 + finalMarketShare * 2);
  const gradeInfo = getGrade(overallScore);

  const slides = [
    {
      id: "executive-summary",
      title: "Executive Summary",
      subtitle: "Fiscal Year results and strategic positioning",
      content: (
        <div className="flex flex-col items-center justify-center space-y-8 py-10">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12 }}
            className={`w-48 h-48 rounded-full border-8 ${gradeInfo.border} flex flex-col items-center justify-center bg-slate-900/80 shadow-[0_0_50px_rgba(0,0,0,0.5)] ${gradeInfo.glow} relative`}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-20" />
            <span className={`text-8xl font-black ${gradeInfo.color} tracking-tighter`}>{gradeInfo.grade}</span>
            <span className="text-[10px] font-black text-slate-500 tracking-[0.3em] mt-[-10px] uppercase">{gradeInfo.label}</span>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-10 w-full max-w-2xl px-10">
            <div className="text-center space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Rank</p>
              <p className="text-3xl font-bold text-white uppercase">TOP 12%</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Strategic Score</p>
              <p className="text-3xl font-bold text-white"><CountUp end={overallScore} duration={2} />pts</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "revenue-performance",
      title: "Revenue Trajectory",
      subtitle: "Compounded growth rates across FY cycles",
      content: (
        <div className="w-full h-[400px] mt-8 bg-white/5 rounded-3xl p-6 border border-white/5 shadow-inner">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={quarterlyData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="quarter" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #ffffff10", borderRadius: "12px", color: "white" }}
                itemStyle={{ color: "#3b82f6" }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )
    },
    {
      id: "market-dominance",
      title: "Market Dominance",
      subtitle: "Competitive landscape penetration",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10">
          <div className="space-y-6 flex flex-col justify-center">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-blue-400">
                <Target className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Final Market Share</span>
              </div>
              <p className="text-5xl font-black text-white">{finalMarketShare.toFixed(1)}%</p>
              <p className="text-xs text-slate-500">Relative to industry benchmarks (2026 Avg: 18.4%)</p>
            </div>
            
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <Users className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Customer Trust Index</span>
              </div>
              <p className="text-5xl font-black text-white">{context.quarters.Q4.results.customerSatisfaction.toFixed(1)}%</p>
              <p className="text-xs text-slate-500">Premium brand perception achieved</p>
            </div>
          </div>
          <div className="h-[300px] md:h-full bg-slate-900/40 rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center p-6">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={quarterlyData}>
                  <Bar dataKey="share" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center py-10 px-4 mt-[-40px]">
      <motion.div 
        layout
        className="w-full max-w-5xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl rounded-[40px] shadow-2xl relative overflow-hidden"
      >
        {/* Progress header */}
        <div className="flex gap-1 p-6">
          {slides.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= currentSlide ? "bg-blue-500" : "bg-white/10"}`} />
          ))}
        </div>

        <div className="px-12 pb-12">
          {/* Slide Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <motion.h1 
                key={`title-${currentSlide}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-black text-white uppercase tracking-tight"
              >
                {slides[currentSlide].title}
              </motion.h1>
              <p className="text-slate-500 font-medium text-sm">{slides[currentSlide].subtitle}</p>
            </div>
            <Building2 className="w-8 h-8 text-white/10" />
          </div>

          {/* Slide Content */}
          <div className="relative min-h-[450px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 50, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.98 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {slides[currentSlide].content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/5">
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                onClick={prevSlide}
                className="rounded-full w-12 h-12 p-0 bg-white/5 hover:bg-white/10 text-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={nextSlide}
                className="rounded-full w-12 h-12 p-0 bg-white/5 hover:bg-white/10 text-white"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex gap-4">
               <Button onClick={onExportPDF} variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl px-6 h-12 font-bold flex items-center gap-2">
                <Download className="w-4 h-4" /> Export Briefing
               </Button>
               {currentSlide === slides.length - 1 && (
                 <Button onClick={onRestart} className="bg-white text-slate-950 hover:bg-slate-200 rounded-xl px-8 h-12 font-black transition-transform active:scale-95 shadow-xl shadow-white/10">
                   RESTART CAMPAIGN
                 </Button>
               )}
            </div>
          </div>
        </div>
        
        {/* Subtle decorative elements */}
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-[100px]" />
      </motion.div>

      {/* Footer Branding */}
      <div className="mt-8 flex items-center gap-3 opacity-20 hover:opacity-100 transition-opacity">
        <ShieldCheck className="w-5 h-5 text-white" />
        <span className="text-xs font-black text-white uppercase tracking-[0.5em]">CMO SIMULATOR | BOARDROOM EDITION 2026</span>
      </div>
    </div>
  );
}
