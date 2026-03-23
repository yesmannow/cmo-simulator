"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import HeroVisual from "@/components/ui/HeroVisual";
import { ArrowRight, BarChart3, Users, Zap, GraduationCap, Play, X } from "lucide-react";

export default function LandingPage() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <main className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* 3D Background */}
      <HeroVisual />

      {/* Hero Content */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="inline-flex items-center px-3 py-1 text-sm font-medium border border-blue-500/30 rounded-full bg-blue-500/10 text-blue-400 backdrop-blur-md mb-4">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse" />
            2026 Executive Edition
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-tight">
            Master the Art of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600 drop-shadow-sm">
              Marketing Strategy
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed">
            Step into the boardroom of a high-growth enterprise. Launch campaigns, manage 
            budgets, and navigate market crises in a world-class CMO simulation engine.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-10 justify-center">
            <Link 
              href="/sim/setup"
              className="group relative px-8 py-4 bg-white text-slate-950 font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center">
                Launch Simulation <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            
            <button 
              onClick={() => setShowDemo(true)}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900/50 text-white font-bold rounded-xl border border-slate-700 hover:bg-slate-800 transition-all backdrop-blur-md hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-blue-500 transition-colors">
                <Play className="w-4 h-4 text-white group-hover:translate-x-[1px] transition-transform" />
              </div>
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-32 w-full text-left">
          {[
            { 
              icon: BarChart3, 
              title: "Proprietary Scoring", 
              desc: "23 advanced metrics tracking every decision impact.",
              color: "text-blue-400"
            },
            { 
              icon: Users, 
              title: "Market Dynamics", 
              desc: "Real-time Bass Diffusion and competitive response models.",
              color: "text-indigo-400"
            },
            { 
              icon: Zap, 
              title: "Crisis Handling", 
              desc: "Navigate wildcards and internal corporate events.",
              color: "text-amber-400"
            },
            { 
              icon: GraduationCap, 
              title: "EdTech First", 
              desc: "Designed to train the next generation of marketing leaders.",
              color: "text-emerald-400"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.5, duration: 0.6 }}
              className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-xl hover:bg-slate-800/60 transition-colors group"
            >
              <feature.icon className={`w-10 h-10 mb-4 ${feature.color} group-hover:scale-110 transition-transform`} />
              <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Watch Demo Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl transition-opacity"
              onClick={() => setShowDemo(false)}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl aspect-video bg-slate-900 rounded-2xl sm:rounded-[32px] border border-slate-700 shadow-[0_0_50px_rgba(59,130,246,0.2)] overflow-hidden flex flex-col items-center justify-center"
            >
              <button
                onClick={() => setShowDemo(false)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-10"
              >
                <X className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              {/* Placeholder for actual video - You can replace this with an iframe */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center">
                <div className="relative group cursor-pointer" onClick={() => {/* Handle actual play logic if needed */}}>
                   <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/40 transition-colors duration-500" />
                   <div className="relative w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform duration-500">
                     <Play className="w-10 h-10 text-white ml-2" />
                   </div>
                </div>
                <h3 className="mt-8 text-2xl font-bold text-white tracking-tight">CMO Simulator Overview</h3>
                <p className="mt-2 text-slate-400">Interactive simulation engine demonstration video goes here.</p>
                <div className="mt-6 inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-mono text-slate-400">
                  src/app/landing/page.tsx: Replace with an iframe to connect.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
