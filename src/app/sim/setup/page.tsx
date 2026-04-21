'use client';

import { useState, useEffect, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LogoGenerator } from '@/components/LogoGenerator';
import { usePageTracking, useSimulationTracking } from '@/hooks/useAnalytics';
import { SimulationContext } from '@/lib/simMachine';
import { Industry, TimeHorizon, CompanyProfile, MarketLandscape } from '@/types';
import { logger } from '@/lib/logger';
import { getSimAuthSession } from '@/lib/simAuth';
import { resolveSimulationPath } from '@/lib/simulationRouting';
import {
  Building2,
  Target,
  Zap,
  Rocket,
  ArrowRight,
  Sparkles,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

interface SetupData {
  scenarioId: string | null;
  companyName: string;
  logoStyle: 'orb' | 'badge';
  // Budget Allocation (must sum to 100)
  budgetAllocation: {
    brandAwareness: number;
    leadGeneration: number;
    conversionOptimization: number;
  };
}

export const SCENARIOS = [
  {
    id: 'turnaround',
    name: 'The Turnaround',
    description: 'A legacy brand steadily losing market share. Your job is to stop the bleeding and revitalize the brand before cash runs out.',
    icon: Target,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    timeHorizon: '1-year' as TimeHorizon,
    industry: 'ecommerce' as Industry,
    companyProfile: 'enterprise' as CompanyProfile,
    marketLandscape: 'disruptor' as MarketLandscape,
    difficulty: 'Hard',
    budget: 1500000,
    startingKPIs: {
      revenue: 5000000,
      profit: 0,
      marketShare: 15,
      brandAwareness: 60,
      customerSatisfaction: 35
    },
    executiveMandate: 'Immediate stabilization and return to profitability.'
  },
  {
    id: 'hyper-growth',
    name: 'Hyper-Growth SaaS',
    description: 'A heavily funded Series B startup. The board demands aggressive acquisition at all costs to hit unicorn valuation.',
    icon: Rocket,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    timeHorizon: '3-year' as TimeHorizon,
    industry: 'saas' as Industry,
    companyProfile: 'startup' as CompanyProfile,
    marketLandscape: 'crowded' as MarketLandscape,
    difficulty: 'Very Hard',
    budget: 3500000,
    startingKPIs: {
      revenue: 1200000,
      profit: 0,
      marketShare: 2,
      brandAwareness: 10,
      customerSatisfaction: 85
    },
    executiveMandate: 'Triple-digit YoY growth. Unit economics secondary.'
  },
  {
    id: 'challenger',
    name: 'The Challenger Brand',
    description: 'A lean startup trying to disrupt a massive incumbent. You must be resourceful, loud, and strategic to survive.',
    icon: Zap,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    timeHorizon: '5-year' as TimeHorizon,
    industry: 'fintech' as Industry,
    companyProfile: 'startup' as CompanyProfile,
    marketLandscape: 'disruptor' as MarketLandscape,
    difficulty: 'Medium',
    budget: 500000,
    startingKPIs: {
      revenue: 250000,
      profit: 0,
      marketShare: 1,
      brandAwareness: 5,
      customerSatisfaction: 90
    },
    executiveMandate: 'Build an obsessed cult-following over 5 years.'
  }
];

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<SetupData>({
    scenarioId: null,
    companyName: '',
    logoStyle: 'orb',
    budgetAllocation: {
      brandAwareness: 33,
      leadGeneration: 34,
      conversionOptimization: 33
    }
  });

  // Analytics tracking
  usePageTracking();
  const { trackStart } = useSimulationTracking();

  // Validation state
  const [hasSavedRun, setHasSavedRun] = useState(false);
  const [savedRunContext, setSavedRunContext] = useState<Partial<SimulationContext> | null>(null);
  const [savedRunPhase, setSavedRunPhase] = useState<string>('idle');

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;
  const budgetTotal =
    data.budgetAllocation.brandAwareness +
    data.budgetAllocation.leadGeneration +
    data.budgetAllocation.conversionOptimization;

  useEffect(() => {
    const session = getSimAuthSession();
    if (!session) return;

    const loadLatestRun = async () => {
      try {
        const response = await fetch(`/api/simulations/latest?userId=${encodeURIComponent(session.userId)}`);
        if (!response.ok) return;
        const data = await response.json();
        if (data?.run?.context) {
          setHasSavedRun(true);
          setSavedRunContext(data.run.context as Partial<SimulationContext>);
          setSavedRunPhase(data.run.current_phase || 'idle');
        }
      } catch (error) {
        logger.error('Failed to load latest saved run', error);
      }
    };

    void loadLatestRun();
  }, []);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Save to simulation context and navigate
      saveAndContinue();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const saveAndContinue = async () => {
    try {
      const scenario = SCENARIOS.find(s => s.id === data.scenarioId);
      if (!scenario) throw new Error("Scenario missing");

      // Initialize unified simulation context
      const initialState: Partial<SimulationContext> = {
        scenarioId: scenario.id,
        strategy: {
          companyName: data.companyName.trim(),
          guidedDemo: false,
          industry: scenario.industry,
          logoStyle: data.logoStyle,
          targetAudience: '',
          brandPositioning: '',
          primaryChannels: [],
          budgetAllocation: data.budgetAllocation,
          marketLandscape: scenario.marketLandscape,
          timeHorizon: scenario.timeHorizon,
        },
        kpis: scenario.startingKPIs,
        totalBudget: scenario.budget,
        remainingBudget: scenario.budget,
        // The engine state will be initialized by the default machine context spread
      };

      // Save to localStorage v2 so SimulationProvider mounts it into XState context
      localStorage.setItem('cmo-sim-state-v2', JSON.stringify(initialState));

      trackStart({
        industry: scenario.industry,
        difficulty: 'intermediate',
        timeHorizon: scenario.timeHorizon,
        totalBudget: scenario.budget,
      });

      // Navigate to strategy session
      router.push('/sim/strategy');
    } catch (error) {
      logger.error('Error saving simulation', error);
      alert('Failed to initialize simulation. Please try again.');
    }
  };

  const launchGuidedDemo = () => {
    const demoScenario = SCENARIOS.find((scenario) => scenario.id === 'challenger') || SCENARIOS[0];
    const guidedDemoState: Partial<SimulationContext> = {
      scenarioId: demoScenario.id,
      strategy: {
        companyName: 'Guided Demo Co.',
        guidedDemo: true,
        industry: demoScenario.industry,
        logoStyle: 'orb',
        targetAudience: 'Young Professionals (25-35)',
        brandPositioning: 'Innovation & Technology',
        primaryChannels: ['digital', 'social', 'content'],
        budgetAllocation: {
          brandAwareness: 35,
          leadGeneration: 40,
          conversionOptimization: 25,
        },
        marketLandscape: demoScenario.marketLandscape,
        timeHorizon: demoScenario.timeHorizon,
      },
      kpis: demoScenario.startingKPIs,
      totalBudget: demoScenario.budget,
      remainingBudget: demoScenario.budget,
    };

    localStorage.setItem('cmo-sim-state-v2', JSON.stringify(guidedDemoState));
    router.push('/sim/strategy?demo=1');
  };

  const resumeSavedRun = () => {
    if (!savedRunContext) return;
    localStorage.setItem('cmo-sim-state-v2', JSON.stringify(savedRunContext));
    router.push(resolveSimulationPath(savedRunPhase));
  };


  const canProceed = () => {
    switch (step) {
      case 1: return data.scenarioId !== null;
      case 2: return data.companyName.trim().length >= 2;
      case 3: {
        return budgetTotal === 100;
      }
      case 4: return true; // Review step
      default: return false;
    }
  };

  const updateBudgetAllocation = (key: keyof SetupData['budgetAllocation'], value: number) => {
    setData({
      ...data,
      budgetAllocation: {
        ...data.budgetAllocation,
        [key]: value
      }
    });
  };

  const selectedScenario = SCENARIOS.find(s => s.id === data.scenarioId);
  const SelectedScenarioIcon = selectedScenario?.icon;
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Phase 0: Strategy Session</span>
          </motion.div>

          <h1 className="text-4xl font-bold mb-2">Build Your Company</h1>
          <p className="text-slate-600">
            Define your strategic foundation for the next 12 months
          </p>
          <div className="mt-5">
            <Button
              type="button"
              variant="outline"
              className="border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20"
              onClick={launchGuidedDemo}
            >
              Start Guided Demo Run (2 min)
            </Button>
            {hasSavedRun && (
              <Button
                type="button"
                variant="outline"
                className="ml-2 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20"
                onClick={resumeSavedRun}
              >
                Resume Latest Saved Run
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Scenario Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-black text-slate-950 mb-2">Select Your Scenario</h2>
                  <p className="text-slate-600 font-medium">Your starting conditions, constraints, and board expectations.</p>
                </div>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  {SCENARIOS.map((scenario) => {
                    const Icon = scenario.icon;
                    const isSelected = data.scenarioId === scenario.id;

                    return (
                      <motion.div
                        key={scenario.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setData({ ...data, scenarioId: scenario.id })}
                      >
                        <Card
                          className={`cursor-pointer transition-all h-full bg-white border ${
                            isSelected
                              ? `border-slate-900 shadow-sm`
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <CardHeader className="pb-4">
                            <div className={`p-4 rounded-2xl w-fit mb-4 ${scenario.color}`}>
                              <Icon className="h-8 w-8" />
                            </div>
                            <CardTitle className="text-2xl font-black text-slate-950">{scenario.name}</CardTitle>
                            <Badge className="w-fit mt-2 bg-slate-100 text-slate-700 tracking-widest uppercase font-bold text-[10px]">{scenario.difficulty}</Badge>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <p className="text-sm text-slate-600 leading-relaxed min-h-[80px]">
                              {scenario.description}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                              <div>
                                <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-1">Starting Budget</p>
                                <p className="text-xl font-black text-slate-950">${(scenario.budget / 1000000).toFixed(1)}M</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-1">Horizon</p>
                                <p className="text-xl font-black text-slate-950">{scenario.timeHorizon}</p>
                              </div>
                            </div>
                            
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                              <p className="text-[10px] uppercase tracking-widest font-black text-slate-600 mb-2">Board Mandate</p>
                              <p className="text-sm font-medium text-slate-700 italic">{scenario.executiveMandate}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
            {/* Step 2: Company Name */}
            {step === 2 && (
              <Card className="border border-slate-200 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl font-black text-slate-950">
                    <Building2 className="h-8 w-8 text-primary" />
                    Name Your Company
                  </CardTitle>
                  <CardDescription className="text-slate-600 text-lg">
                    Every great venture needs an identity. What will you call your company?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="company-name" className="text-slate-500 font-black tracking-widest uppercase text-xs">OFFICIAL CORPORATE ENTITY</Label>
                    <Input
                      id="company-name"
                      placeholder="e.g., Apex Health, Innovate Legal, Urban Outfitters Co."
                      value={data.companyName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setData({ ...data, companyName: e.target.value })}
                      className="text-2xl font-bold h-16 bg-white border-slate-200 text-slate-950 placeholder:text-slate-400"
                      autoFocus
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Logo Style</span>
                    <Button
                      type="button"
                      variant="outline"
                      className={data.logoStyle === 'orb' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700'}
                      onClick={() => setData((current) => ({ ...current, logoStyle: 'orb' }))}
                    >
                      Orb
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className={data.logoStyle === 'badge' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700'}
                      onClick={() => setData((current) => ({ ...current, logoStyle: 'badge' }))}
                    >
                      Badge
                    </Button>
                  </div>
                  {data.companyName && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-8 bg-slate-50 rounded-2xl border border-slate-200 mt-8"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left flex-1 space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">APPROVED IDENTITY</p>
                          <div className="text-4xl font-black text-slate-950 tracking-tight">
                            {data.companyName}
                          </div>
                        </div>
                        <div className="ml-6 shrink-0">
                          <LogoGenerator
                            companyName={data.companyName}
                            industry={selectedScenario?.industry || 'saas'}
                            style={data.logoStyle}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Budget Allocation */}
            {step === 3 && (
              <Card className="border border-slate-200 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl font-black text-slate-950">
                    <DollarSign className="h-8 w-8 text-emerald-400" />
                    Initial Budget Philosophy
                  </CardTitle>
                  <CardDescription className="text-slate-600 text-lg">
                    How will you distribute your <span className="text-emerald-600 font-bold">${selectedScenario ? (selectedScenario.budget / 1000000).toFixed(1) : 0}M</span> starting budget across the funnel?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Total allocated indicator */}
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">TOTAL ALLOCATED</p>
                      <div className="text-5xl font-black text-slate-950 tracking-tighter">
                        {budgetTotal}%
                      </div>
                    </div>
                    {budgetTotal !== 100 && (
                      <p className="text-rose-700 font-bold text-sm bg-rose-50 px-4 py-2 rounded-full border border-rose-200">
                        Must equal exactly 100%
                      </p>
                    )}
                  </div>

                  {/* Brand Awareness Slider */}
                  <div className="space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="flex justify-between">
                      <Label className="text-lg font-bold text-slate-950 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        Brand Formation
                      </Label>
                      <span className="text-xl font-black text-purple-400">{data.budgetAllocation.brandAwareness}%</span>
                    </div>
                    <p className="text-sm text-slate-600">Long-term equity, mental availability, and market positioning.</p>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={data.budgetAllocation.brandAwareness}
                      onChange={(e) => updateBudgetAllocation('brandAwareness', parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  {/* Lead Generation Slider */}
                  <div className="space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="flex justify-between">
                      <Label className="text-lg font-bold text-slate-950 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        Demand Generation
                      </Label>
                      <span className="text-xl font-black text-blue-400">{data.budgetAllocation.leadGeneration}%</span>
                    </div>
                    <p className="text-sm text-slate-600">Capturing intent, building pipeline, and driving traffic.</p>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={data.budgetAllocation.leadGeneration}
                      onChange={(e) => updateBudgetAllocation('leadGeneration', parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* Conversion Slider */}
                  <div className="space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="flex justify-between">
                      <Label className="text-lg font-bold text-slate-950 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        Performance / Conversion
                      </Label>
                      <span className="text-xl font-black text-emerald-400">{data.budgetAllocation.conversionOptimization}%</span>
                    </div>
                    <p className="text-sm text-slate-600">Sales enablement, retargeting, and bottom-of-funnel closing.</p>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={data.budgetAllocation.conversionOptimization}
                      onChange={(e) => updateBudgetAllocation('conversionOptimization', parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Final Review */}
            {step === 4 && selectedScenario && (
              <Card className="border border-slate-200 bg-white">
                <CardHeader className="text-center pb-8">
                  <LogoGenerator companyName={data.companyName} industry={selectedScenario.industry} style={data.logoStyle} />
                  <CardTitle className="text-3xl font-black text-slate-950 mt-6">Executive Briefing</CardTitle>
                  <CardDescription className="text-slate-600 text-lg">
                    Review your parameters before commencing simulation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Scenario Block */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-500">Campaign Context</h4>
                      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-4 h-full">
                        <div className={`p-3 rounded-xl ${selectedScenario.color}`}>
                          {SelectedScenarioIcon ? <SelectedScenarioIcon className="w-6 h-6" /> : null}
                        </div>
                        <div>
                          <h5 className="font-black text-xl text-slate-950 tracking-tight">{selectedScenario.name}</h5>
                          <p className="text-sm text-slate-600 mt-2">{selectedScenario.description}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Badge className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50">{selectedScenario.timeHorizon}</Badge>
                            <Badge className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50">{selectedScenario.difficulty}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Financials Block */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-500">Financial Philosophy</h4>
                      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl h-full flex flex-col justify-center">
                        <div className="flex justify-between items-baseline mb-6 border-b border-slate-200 pb-4">
                          <span className="text-sm font-bold text-slate-600">Annual Budget</span>
                          <span className="text-3xl font-black text-slate-950">${(selectedScenario.budget / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="space-y-3">
                           <div className="flex justify-between text-sm">
                             <span className="font-bold text-slate-700">Brand</span>
                             <span className="text-slate-950 font-black">{data.budgetAllocation.brandAwareness}%</span>
                           </div>
                           <div className="flex justify-between text-sm">
                             <span className="font-bold text-slate-700">Demand</span>
                             <span className="text-slate-950 font-black">{data.budgetAllocation.leadGeneration}%</span>
                           </div>
                           <div className="flex justify-between text-sm">
                             <span className="font-bold text-slate-700">Conversion</span>
                             <span className="text-slate-950 font-black">{data.budgetAllocation.conversionOptimization}%</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex gap-4 items-start">
                    <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-black tracking-widest uppercase text-xs text-amber-700 mb-2">CEO Mandate</h4>
                      <p className="text-amber-900/80 italic font-medium">{selectedScenario.executiveMandate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={handleBack}
            className={`text-slate-700 hover:bg-slate-100 ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            Go Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-slate-900 text-white hover:bg-slate-800 px-8 py-6 rounded-xl font-bold text-lg shadow-sm transition-all hover:scale-[1.02] disabled:bg-slate-200 disabled:text-slate-400"
          >
            {step === totalSteps ? (
              <span className="flex items-center gap-2">
                Commence Operations
                <Rocket className="h-5 w-5" />
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continue
                <ArrowRight className="h-5 w-5" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
