import { Suspense } from 'react';
import Link from 'next/link';
import { SimulationProvider } from '@/components/simulation/SimulationProvider';
import HeroVisual from '@/components/ui/HeroVisual';
import { Sparkles, Activity, Target } from 'lucide-react';

export default function SimulationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden selection:bg-blue-500/30">
      {/* 3D/Animated Background Engine */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
        <HeroVisual />
      </div>

      {/* Ambient Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Glassmorphic Navigation Header */}
      <nav className="relative z-50 border-b border-white/10 bg-slate-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/sim/setup" className="font-extrabold text-xl flex items-center gap-3 group">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              CMO Simulator
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link 
              href="/sim/debrief" 
              className="group flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              <Target className="w-4 h-4 group-hover:text-amber-400 transition-colors" />
              Progress
            </Link>
            <Link 
              href="/engine-demo" 
              className="group flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              <Activity className="w-4 h-4 group-hover:text-emerald-400 transition-colors" />
              Engine Demo
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Simulation Content Wrapper */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <SimulationProvider>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-r-2 border-indigo-400 rounded-full animate-spin-reverse"></div>
              </div>
              <p className="text-blue-400/60 font-medium animate-pulse tracking-widest text-sm uppercase">Initializing Engine...</p>
            </div>
          }>
            {children}
          </Suspense>
        </SimulationProvider>
      </div>
    </div>
  );
}
