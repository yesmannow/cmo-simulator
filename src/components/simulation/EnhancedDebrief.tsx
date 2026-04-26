"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
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
  Save,
  Clipboard,
  TrendingUp,
  Target,
  Users,
  Award,
  Zap,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Lightbulb,
  Crosshair,
  Compass,
  AlertTriangle,
  CalendarCheck,
  Mail,
  Megaphone
} from "lucide-react";
import { SimulationContext } from "@/lib/simMachine";
import CountUp from "react-countup";
import { buildTeachingReport } from "@/lib/simulationInsights";

interface EnhancedDebriefProps {
  context: SimulationContext;
  onExportPDF: () => void;
  onSaveRun: () => void;
  saveDisabled?: boolean;
  onRestart: () => void;
  onShare?: () => void;
}

export function EnhancedDebrief({ context, onExportPDF, onSaveRun, saveDisabled = false, onRestart }: EnhancedDebriefProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

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
  const report = buildTeachingReport(context);
  const contactUrl = process.env.NEXT_PUBLIC_COMPANY_CONTACT_URL || "https://darlingmartech.com/contact?source=cmo-simulator";

  // Phase 3 Calculations
  // 1. Archetype Assignment
  const getArchetype = () => {
    // Collect all tactics used
    const allTactics = [
      ...(context.quarters.Q1.tactics || []),
      ...(context.quarters.Q2.tactics || []),
      ...(context.quarters.Q3.tactics || []),
      ...(context.quarters.Q4.tactics || []),
    ];
    
    let digitalSpend = 0;
    let traditionalSpend = 0;
    let eventsSpend = 0;
    let brandSpend = 0;

    allTactics.forEach(t => {
      if (t.category === 'digital') digitalSpend += t.cost;
      if (t.category === 'traditional') traditionalSpend += t.cost;
      if (t.category === 'events') eventsSpend += t.cost;
      if (t.category === 'content' || t.name.toLowerCase().includes('brand')) brandSpend += t.cost;
    });

    const maxSpend = Math.max(digitalSpend, traditionalSpend, eventsSpend, brandSpend);
    if (maxSpend === 0) return { name: "Budget Hoarder", icon: AlertTriangle, desc: "You barely spent your budget. Marketing requires fuel.", advice: "Don't be afraid to deploy capital. A defensive posture rarely wins market share." };
    if (maxSpend === digitalSpend) return { name: "Performance Maximalist", icon: Zap, desc: "You heavily favored direct-response digital channels for immediate ROI.", advice: "Watch for performance plateau. Digital CAC rises rapidly when brand awareness is neglected." };
    if (maxSpend === traditionalSpend) return { name: "Broadcast Traditionalist", icon: Megaphone, desc: "You relied on established, high-reach television and out-of-home campaigns.", advice: "While reach is great, traditional media is hard to attribute. Ensure you have lower-funnel capture mechanics in place." };
    if (maxSpend === eventsSpend) return { name: "Experiential Operator", icon: Award, desc: "You leaned into physical experiences and high-touch event marketing.", advice: "Events create incredible loyalty but scale poorly. Blend digital amplification with your event strategy next time." };
    return { name: "Brand Builder", icon: ShieldCheck, desc: "You focused on long-term equity, content, and category narrative.", advice: "Brand takes time to compound. Make sure you don't run out of immediate cash flow while waiting for the brand halo effect." };
  };

  const archetype = getArchetype();

  const handleCopyBriefing = async () => {
    const briefing = [
      "CMO Simulator Growth Briefing",
      "",
      `Strategic score: ${overallScore}`,
      `Leadership archetype: ${archetype.name}`,
      "",
      `Outcome: ${report.outcome}`,
      `Why: ${report.why}`,
      `Tradeoff: ${report.tradeoff}`,
      `Recommended next move: ${report.nextMove}`,
      `Growth leader takeaway: ${report.growthLeaderTakeaway}`,
    ].join("\n");

    if (!window.isSecureContext || !navigator.clipboard?.writeText) {
      setCopyStatus("Clipboard access is unavailable here. Export the briefing instead.");
      return;
    }

    try {
      await navigator.clipboard.writeText(briefing);
      setCopyStatus("Briefing copied.");
    } catch {
      setCopyStatus("Copy failed. Export the briefing instead.");
    }
  };

  // 2. Turning Points
  const getTurningPoint = () => {
    let bestDelta = 0;
    let bestQ = "Q1";
    let priorRev = 0; // Baseline before simulation

    quarterlyData.forEach((q) => {
      const delta = q.revenue - priorRev;
      if (delta > bestDelta) {
        bestDelta = delta;
        bestQ = q.quarter;
      }
      priorRev = q.revenue;
    });

    return {
      quarter: bestQ,
      insight: `Your largest revenue surge ($${(bestDelta/1000).toFixed(0)}k jump) occurred in ${bestQ}.`,
      lesson: `Actions prior to ${bestQ} created compounding momentum, or your ${bestQ} deployments were highly resonant.`
    };
  };

  const turningPoint = getTurningPoint();

  const slides = [
    {
      id: "teaching-report",
      title: "Teaching + Proof Report",
      subtitle: "Structured debrief for growth leaders",
      content: (
        <div className="grid md:grid-cols-2 gap-6 py-4">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-xs uppercase tracking-widest text-blue-300/70 mb-2">Outcome</p>
            <p className="text-slate-100">{report.outcome}</p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-xs uppercase tracking-widest text-blue-300/70 mb-2">Why</p>
            <p className="text-slate-100">{report.why}</p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-xs uppercase tracking-widest text-blue-300/70 mb-2">Tradeoff</p>
            <p className="text-slate-100">{report.tradeoff}</p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-xs uppercase tracking-widest text-blue-300/70 mb-2">Recommended Next Move</p>
            <p className="text-slate-100">{report.nextMove}</p>
          </div>
          <div className="md:col-span-2 p-6 bg-blue-500/10 rounded-2xl border border-blue-400/20">
            <p className="text-xs uppercase tracking-widest text-blue-300/70 mb-2">Growth Leader Takeaway</p>
            <p className="text-blue-100">{report.growthLeaderTakeaway}</p>
          </div>
        </div>
      ),
    },
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
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`}
                domain={[0, (dataMax: number) => Math.max(dataMax, 500000)]}
              />
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
    },
    {
      id: "strategic-archetype",
      title: "CMO Strategic Archetype",
      subtitle: "What your decisions say about your leadership style",
      content: (
        <div className="flex flex-col items-center justify-center space-y-8 py-4">
          <div className="p-8 bg-slate-900/50 rounded-[30px] border border-blue-500/30 flex flex-col items-center w-full shadow-[0_0_50px_rgba(59,130,246,0.1)]">
            <archetype.icon className="w-20 h-20 text-blue-400 mb-6 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            <h3 className="text-4xl font-black text-white uppercase tracking-widest text-center">{archetype.name}</h3>
            <p className="text-blue-200/60 mt-4 text-center max-w-lg text-lg italic leading-relaxed">
              {archetype.desc}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 w-full mt-4">
            <div className="p-6 bg-white/5 border border-white/5 rounded-2xl flex items-start gap-4">
              <Crosshair className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Strengths</p>
                <p className="text-sm text-slate-300">Aligned heavily with your primary budget allocations. Created strong narrative consistency in your chosen channels.</p>
              </div>
            </div>
            <div className="p-6 bg-white/5 border border-white/5 rounded-2xl flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Blindspots</p>
                <p className="text-sm text-slate-300">Lack of diversification may expose the brand to channel saturation or competitor flanking.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "turning-points",
      title: "Campaign Turning Point",
      subtitle: "The moment momentum shifted",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10 h-full">
          <div className="h-full bg-slate-900/40 rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center p-6 relative">
             {/* Simple timeline visualization */}
             <div className="absolute inset-y-10 left-12 w-1 bg-white/10 rounded-full" />
             <div className="flex flex-col justify-between w-full h-full pl-8">
               {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
                 <div key={q} className="relative flex items-center gap-6">
                   <div className={`w-8 h-8 rounded-full border-4 ${q === turningPoint.quarter ? 'bg-emerald-500 border-emerald-900 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-slate-800 border-slate-900'} z-10 -ml-[19px] shrink-0`} />
                   <div>
                     <p className={`font-black uppercase tracking-widest ${q === turningPoint.quarter ? 'text-emerald-400 text-xl' : 'text-slate-500'}`}>{q}</p>
                     {q === turningPoint.quarter && (
                       <p className="text-xs text-emerald-500/60 font-bold uppercase tracking-widest mt-1">Maximum Inflection</p>
                     )}
                   </div>
                 </div>
               ))}
             </div>
          </div>
          <div className="space-y-6 flex flex-col justify-center">
             <div className="p-8 bg-emerald-500/10 rounded-[30px] border border-emerald-500/20">
               <TrendingUp className="w-10 h-10 text-emerald-400 mb-6" />
               <h3 className="text-2xl font-bold text-white mb-2">Momentum Spike in {turningPoint.quarter}</h3>
               <p className="text-emerald-100/70 leading-relaxed mb-6">{turningPoint.insight}</p>
               <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 border-l-emerald-500 border-l-4">
                 <p className="text-sm text-slate-300 italic">{turningPoint.lesson}</p>
               </div>
             </div>
          </div>
        </div>
      )
    },
    {
      id: "alternative-path",
      title: "Alternative Path Coaching",
      subtitle: "If you rerun this scenario, try this",
      content: (
        <div className="flex flex-col items-center justify-center space-y-8 py-10 h-full">
           <div className="p-10 w-full max-w-2xl bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[30px] border border-indigo-500/30 text-center relative overflow-hidden">
             <Compass className="w-16 h-16 text-indigo-400 mx-auto mb-6 opacity-80" />
             <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-4">Strategic Recommendation</h3>
             
             <p className="text-lg text-indigo-100/80 leading-relaxed max-w-xl mx-auto">
               {archetype.advice}
             </p>
             
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none" />
           </div>
           
           <div className="flex gap-4 items-center">
             <Lightbulb className="w-5 h-5 text-amber-400" />
             <p className="text-sm font-black uppercase text-amber-400 tracking-widest">Replay the simulator to test a different archetype.</p>
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
          <div className="flex flex-col gap-5 mt-12 pt-8 border-t border-white/5 lg:flex-row lg:items-center lg:justify-between">
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

            <div className="flex flex-wrap gap-3">
               <Button
                onClick={onSaveRun}
                disabled={saveDisabled}
                variant="outline"
                className="border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl px-6 h-12 font-bold flex items-center gap-2 disabled:opacity-40"
               >
                <Save className="w-4 h-4" /> Save Run
               </Button>
               <Button onClick={onExportPDF} variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl px-6 h-12 font-bold flex items-center gap-2">
                <Download className="w-4 h-4" /> Export Briefing
               </Button>
               <Button onClick={handleCopyBriefing} variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl px-6 h-12 font-bold flex items-center gap-2">
                <Clipboard className="w-4 h-4" /> Copy Summary
               </Button>
               {currentSlide === slides.length - 1 && (
                 <Button onClick={onRestart} className="bg-white text-slate-950 hover:bg-slate-200 rounded-xl px-8 h-12 font-black transition-transform active:scale-95 shadow-xl shadow-white/10">
                   RESTART CAMPAIGN
                 </Button>
               )}
            </div>
          </div>
          {copyStatus && (
            <p className="mt-4 text-sm font-medium text-blue-200">{copyStatus}</p>
          )}
        </div>
      </motion.div>

      <section className="mt-6 w-full max-w-5xl rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-white">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-300">Turn the run into a real growth conversation</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">Use this debrief as the starting point for a strategy review.</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Bring the briefing into a real conversation about budget allocation, positioning, channel risk, and the next 90 days of execution.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={contactUrl}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-5 text-sm font-black text-slate-950 hover:bg-slate-200"
            >
              <CalendarCheck className="mr-2 h-4 w-4" />
              Request Review
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent("CMO Simulator Growth Briefing")}&body=${encodeURIComponent(report.growthLeaderTakeaway)}`}
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white hover:bg-white/10"
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Takeaway
            </a>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <div className="mt-8 flex items-center gap-3 opacity-20 hover:opacity-100 transition-opacity">
        <ShieldCheck className="w-5 h-5 text-white" />
        <span className="text-xs font-black text-white uppercase tracking-[0.5em]">CMO SIMULATOR | BOARDROOM EDITION 2026</span>
      </div>
    </div>
  );
}
