"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  Heart,
  Activity,
  ShieldCheck,
  Zap
} from "lucide-react";
import { SimulationContext } from "@/lib/simMachine";
import CountUp from "react-countup";

interface KPIDashboardProps {
  context: SimulationContext;
  quarter?: "Q1" | "Q2" | "Q3" | "Q4";
  showQuarterlyBreakdown?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function KPIDashboard({ context, quarter, showQuarterlyBreakdown = false }: KPIDashboardProps) {
  const calculateTotalRevenue = () => {
    let total = 0;
    const quarters = ["Q1", "Q2", "Q3", "Q4"] as const;
    quarters.forEach((q) => {
      const quarterData = context.quarters[q];
      if (quarterData?.results?.revenue !== undefined) {
        if (quarterData.tactics.length > 0 || quarterData.results.revenue > 0) {
          total += quarterData.results.revenue;
        }
      }
    });
    return total > 0 ? total : (context.kpis.revenue || 0);
  };

  const getCurrentMetrics = () => {
    const quarters = ["Q4", "Q3", "Q2", "Q1"] as const;
    for (const q of quarters) {
      const quarterData = context.quarters[q];
      if (quarterData?.results && (quarterData.tactics.length > 0 || quarterData.results.revenue > 0)) {
        return {
          marketShare: quarterData.results.marketShare || context.kpis.marketShare,
          customerSatisfaction: quarterData.results.customerSatisfaction || context.kpis.customerSatisfaction,
          brandAwareness: quarterData.results.brandAwareness || context.kpis.brandAwareness,
        };
      }
    }
    return {
      marketShare: context.kpis.marketShare,
      customerSatisfaction: context.kpis.customerSatisfaction,
      brandAwareness: context.kpis.brandAwareness,
    };
  };

  const totalRevenue = calculateTotalRevenue();
  const currentMetrics = getCurrentMetrics();

  const kpis = [
    {
      title: "Revenue",
      value: totalRevenue,
      prefix: "$",
      icon: DollarSign,
      color: "from-emerald-400 to-teal-500",
      target: 2000000,
      description: "Total generated revenue",
    },
    {
      title: "Market Share",
      value: currentMetrics.marketShare,
      suffix: "%",
      icon: Target,
      color: "from-blue-400 to-indigo-500",
      target: 25,
      description: "Market penetration",
    },
    {
      title: "Loyalty",
      value: currentMetrics.customerSatisfaction,
      suffix: "%",
      icon: Heart,
      color: "from-pink-400 to-rose-500",
      target: 85,
      description: "Customer satisfaction",
    },
    {
      title: "Reach",
      value: currentMetrics.brandAwareness,
      suffix: "%",
      icon: Users,
      color: "from-purple-400 to-violet-500",
      target: 60,
      description: "Brand recognition",
    },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header Info */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          Command Center Results
        </h2>
        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 backdrop-blur-md">
          {quarter || "Live Session"}
        </Badge>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          const progress = Math.min((kpi.value / kpi.target) * 100, 100);
          const isImproving = true; // Logic could be added here

          return (
            <motion.div key={kpi.title} variants={itemVariants}>
              <Card className="relative overflow-hidden bg-slate-900/40 border-white/5 backdrop-blur-xl group hover:border-white/10 transition-all">
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${kpi.color}`} />
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                      <Icon className="h-5 w-5 text-white/70" />
                    </div>
                    {isImproving ? (
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-rose-400" />
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{kpi.title}</p>
                    <div className="text-3xl font-bold text-white tracking-tight">
                      {kpi.prefix}
                      <CountUp end={kpi.value} decimals={kpi.suffix === "%" ? 1 : 0} duration={2} separator="," />
                      {kpi.suffix}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                      <span>PROGRESS</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + idx * 0.1 }}
                        className={`h-full bg-gradient-to-r ${kpi.color}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Score Tracker & Budget Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Score Tracker */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full bg-slate-900/40 border-white/5 backdrop-blur-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck className="w-24 h-24 text-blue-500" />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Strategic Performance</h3>
                  <p className="text-sm text-slate-400">Live projection based on market dynamics</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-white px-3 py-1 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
                    B
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-bold uppercase">Current Score</p>
                  <p className="text-3xl font-bold text-white">
                    <CountUp end={1250} duration={2} />
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                    <Zap className="w-3 h-3" />
                    +120 VELOCITY
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-bold uppercase">Projected End</p>
                  <p className="text-3xl font-bold text-blue-400">
                    <CountUp end={4500} duration={2} />
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Estimated Goal</p>
                </div>

                <div className="flex flex-col justify-center gap-2">
                  <div className="px-3 py-2 bg-white/5 border border-white/5 rounded-xl">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>GLOBAL PERCENTILE</span>
                      <span className="text-blue-400">72nd</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[72%] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Budget Circular Gauge (Simplified) */}
        <motion.div variants={itemVariants}>
          <Card className="h-full bg-slate-900/40 border-white/5 backdrop-blur-xl">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/5"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="364.4"
                    initial={{ strokeDashoffset: 364.4 }}
                    animate={{ strokeDashoffset: 364.4 * (context.remainingBudget / context.totalBudget) }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-bold text-slate-400">REM.</span>
                  <span className="text-lg font-black text-white">
                    {Math.round((context.remainingBudget / context.totalBudget) * 100)}%
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-widest">Budget Remaining</h3>
              <p className="text-2xl font-bold text-blue-400">${context.remainingBudget.toLocaleString()}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quarterly Breakdown - Minimalist version */}
      {showQuarterlyBreakdown && (
        <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4">
          {(["Q1", "Q2", "Q3", "Q4"] as const).map((q) => {
            const quarterData = context.quarters[q];
            const isActive = quarter === q;
            const hasResults = quarterData.tactics.length > 0 || (quarterData.results.revenue !== undefined && quarterData.results.revenue > 0);

            return (
              <div key={q} className={`p-4 rounded-xl border transition-all ${
                isActive 
                  ? "bg-blue-500/10 border-blue-500/30 text-white" 
                  : "bg-slate-900/20 border-white/5 text-slate-500"
              }`}>
                <div className="flex items-center justify-between mb-3 text-xs font-black uppercase tracking-widest">
                  <span>{q} STAGE</span>
                  {isActive && <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />}
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold">
                    ${(quarterData.results.revenue || 0).toLocaleString()}
                  </p>
                  <p className="text-[10px] font-bold uppercase text-slate-500">REVENUE IMPACT</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
