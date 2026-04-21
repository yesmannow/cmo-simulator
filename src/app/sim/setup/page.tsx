'use client';

import { useState, useEffect } from 'react';
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
  TrendingUp,
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
    industry: 'retail' as Industry,
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

const _TIME_HORIZONS = [
  {
    id: '1-year' as const,
    name: '1-Year Sprint',
    description: 'Aggressive growth tactics, high-risk/high-reward plays',
    icon: Zap,
    color: 'text-red-500',
    budget: 500000,
    characteristics: ['Fast results', 'Higher risk', 'Tactical focus']
  },
  {
    id: '3-year' as const,
    name: '3-Year Growth',
    description: 'Balanced approach with sustainable scaling',
    icon: TrendingUp,
    color: 'text-blue-500',
    budget: 1000000,
    characteristics: ['Balanced growth', 'Moderate risk', 'Strategic focus']
  },
  {
    id: '5-year' as const,
    name: '5-Year Long Game',
    description: 'Brand building and market dominance strategy',
    icon: Target,
    color: 'text-purple-500',
    budget: 2000000,
    characteristics: ['Long-term value', 'Lower risk', 'Brand focus']
  }
];

const _INDUSTRIES = [
  {
    id: 'healthcare' as const,
    name: 'Healthcare',
    icon: '🏥',
    description: 'Medical services, health tech, wellness',
    avgCustomerValue: 5000,
    salesCycle: 'Long',
    competitionLevel: 'High'
  },
  {
    id: 'legal' as const,
    name: 'Legal Services',
    icon: '⚖️',
    description: 'Law firms, legal tech, consulting',
    avgCustomerValue: 8000,
    salesCycle: 'Very Long',
    competitionLevel: 'Medium'
  },
  {
    id: 'ecommerce' as const,
    name: 'E-commerce',
    icon: '🛒',
    description: 'Online retail, DTC brands, marketplaces',
    avgCustomerValue: 150,
    salesCycle: 'Short',
    competitionLevel: 'Very High'
  },
  {
    id: 'saas' as const,
    name: 'SaaS/Software',
    icon: '💻',
    description: 'B2B software, productivity tools, cloud services',
    avgCustomerValue: 2500,
    salesCycle: 'Medium',
    competitionLevel: 'Very High'
  },
  {
    id: 'fintech' as const,
    name: 'Fintech',
    icon: '💰',
    description: 'Financial technology, payments, banking apps',
    avgCustomerValue: 1200,
    salesCycle: 'Medium',
    competitionLevel: 'High'
  },
  {
    id: 'education' as const,
    name: 'Education Tech',
    icon: '📚',
    description: 'Online learning platforms, tutoring, corporate training',
    avgCustomerValue: 800,
    salesCycle: 'Medium',
    competitionLevel: 'High'
  },
  {
    id: 'real-estate' as const,
    name: 'Real Estate',
    icon: '🏠',
    description: 'Property sales, rentals, property management',
    avgCustomerValue: 15000,
    salesCycle: 'Very Long',
    competitionLevel: 'Medium'
  },
  {
    id: 'food-delivery' as const,
    name: 'Food Delivery',
    icon: '🍕',
    description: 'Restaurant delivery, meal kits, food platforms',
    avgCustomerValue: 35,
    salesCycle: 'Very Short',
    competitionLevel: 'Very High'
  },
  {
    id: 'fitness' as const,
    name: 'Fitness & Wellness',
    icon: '💪',
    description: 'Gym franchises, fitness apps, wellness products',
    avgCustomerValue: 200,
    salesCycle: 'Short',
    competitionLevel: 'High'
  },
  {
    id: 'automotive' as const,
    name: 'Automotive',
    icon: '🚗',
    description: 'Car dealerships, auto parts, electric vehicles',
    avgCustomerValue: 25000,
    salesCycle: 'Long',
    competitionLevel: 'Medium'
  },
  {
    id: 'travel' as const,
    name: 'Travel & Hospitality',
    icon: '✈️',
    description: 'Hotels, airlines, booking platforms, tourism',
    avgCustomerValue: 300,
    salesCycle: 'Medium',
    competitionLevel: 'High'
  },
  {
    id: 'gaming' as const,
    name: 'Gaming',
    icon: '🎮',
    description: 'Video games, esports, gaming platforms',
    avgCustomerValue: 60,
    salesCycle: 'Very Short',
    competitionLevel: 'Very High'
  },
  {
    id: 'fashion' as const,
    name: 'Fashion & Apparel',
    icon: '👗',
    description: 'Clothing brands, luxury goods, fashion retail',
    avgCustomerValue: 120,
    salesCycle: 'Short',
    competitionLevel: 'Very High'
  },
  {
    id: 'construction' as const,
    name: 'Construction',
    icon: '🏗️',
    description: 'Building contractors, construction services, materials',
    avgCustomerValue: 50000,
    salesCycle: 'Very Long',
    competitionLevel: 'Medium'
  },
  {
    id: 'energy' as const,
    name: 'Clean Energy',
    icon: '⚡',
    description: 'Solar, wind, EV charging, sustainable energy',
    avgCustomerValue: 8000,
    salesCycle: 'Very Long',
    competitionLevel: 'Medium'
  },
  {
    id: 'agritech' as const,
    name: 'AgriTech',
    icon: '🌾',
    description: 'Farm technology, precision agriculture, food tech',
    avgCustomerValue: 10000,
    salesCycle: 'Long',
    competitionLevel: 'Low'
  },
  {
    id: 'manufacturing' as const,
    name: 'Manufacturing',
    icon: '🏭',
    description: 'Industrial equipment, B2B manufacturing, supply chain',
    avgCustomerValue: 75000,
    salesCycle: 'Very Long',
    competitionLevel: 'Medium'
  },
  {
    id: 'nonprofit' as const,
    name: 'Non-Profit',
    icon: '🤝',
    description: 'Charities, foundations, social impact organizations',
    avgCustomerValue: 250,
    salesCycle: 'Medium',
    competitionLevel: 'Low'
  },
  {
    id: 'music' as const,
    name: 'Music & Entertainment',
    icon: '🎵',
    description: 'Streaming services, artists, music platforms',
    avgCustomerValue: 15,
    salesCycle: 'Very Short',
    competitionLevel: 'Very High'
  },
  {
    id: 'sports' as const,
    name: 'Sports',
    icon: '⚽',
    description: 'Sports teams, equipment, fan engagement',
    avgCustomerValue: 80,
    salesCycle: 'Short',
    competitionLevel: 'High'
  },
  {
    id: 'pet-care' as const,
    name: 'Pet Care',
    icon: '🐕',
    description: 'Pet food, veterinary services, pet tech',
    avgCustomerValue: 180,
    salesCycle: 'Short',
    competitionLevel: 'High'
  },
  {
    id: 'home-services' as const,
    name: 'Home Services',
    icon: '🔧',
    description: 'Cleaning, repairs, home improvement, maintenance',
    avgCustomerValue: 150,
    salesCycle: 'Short',
    competitionLevel: 'High'
  },
  {
    id: 'cannabis' as const,
    name: 'Cannabis Industry',
    icon: '🌿',
    description: 'Cannabis products, dispensaries, wellness brands',
    avgCustomerValue: 90,
    salesCycle: 'Short',
    competitionLevel: 'Medium'
  },
  {
    id: 'space' as const,
    name: 'Space Technology',
    icon: '🚀',
    description: 'Satellite services, space tourism, aerospace',
    avgCustomerValue: 500000,
    salesCycle: 'Very Long',
    competitionLevel: 'Very Low'
  }
];

const _COMPANY_PROFILES = [
  {
    id: 'startup' as const,
    name: 'Startup / Small Business',
    icon: Rocket,
    description: 'Lean, agile, growth-focused',
    teamSize: '5-20 people',
    advantages: ['Agile', 'Innovative', 'Risk-tolerant'],
    challenges: ['Limited budget', 'Brand recognition', 'Resources']
  },
  {
    id: 'enterprise' as const,
    name: 'Established Enterprise',
    icon: Building2,
    description: 'Mature, resourced, brand-focused',
    teamSize: '100+ people',
    advantages: ['Large budget', 'Brand equity', 'Resources'],
    challenges: ['Slower decisions', 'Market saturation', 'Innovation']
  }
];

const _MARKET_LANDSCAPES = [
  {
    id: 'disruptor' as const,
    name: 'The Disruptor',
    icon: '⚡',
    description: 'Challenge one large, slow-moving incumbent',
    competitorProfile: '1 major player with 5x your budget',
    difficulty: 'Hard',
    opportunity: 'High - exploit their weaknesses'
  },
  {
    id: 'crowded' as const,
    name: 'The Crowded Field',
    icon: '🎯',
    description: 'Compete against many agile startups',
    competitorProfile: 'Multiple competitors, high ad costs',
    difficulty: 'Very Hard',
    opportunity: 'Medium - differentiation is key'
  },
  {
    id: 'frontier' as const,
    name: 'The Open Frontier',
    icon: '🌅',
    description: 'New, unsaturated market with low awareness',
    competitorProfile: 'Few competitors, uneducated customers',
    difficulty: 'Medium',
    opportunity: 'High - educate and capture market'
  }
];

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<SetupData>({
    scenarioId: null,
    companyName: '',
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
  const [budgetError] = useState<string | null>(null);
  const [hasSavedRun, setHasSavedRun] = useState(false);
  const [savedRunContext, setSavedRunContext] = useState<Partial<SimulationContext> | null>(null);
  const [savedRunPhase, setSavedRunPhase] = useState<string>('idle');

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

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
        const total = data.budgetAllocation.brandAwareness +
                     data.budgetAllocation.leadGeneration +
                     data.budgetAllocation.conversionOptimization;
        return total === 100;
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
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-8">
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
          <p className="text-muted-foreground">
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
                  <h2 className="text-3xl font-black text-white mb-2">Select Your Scenario</h2>
                  <p className="text-blue-100/60 font-medium">Your starting conditions, constraints, and board expectations.</p>
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
                          className={`cursor-pointer transition-all h-full bg-slate-900/50 backdrop-blur-xl border ${
                            isSelected
                              ? `border-primary shadow-[0_0_30px_rgba(59,130,246,0.3)] bg-primary/10`
                              : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                          }`}
                        >
                          <CardHeader className="pb-4">
                            <div className={`p-4 rounded-2xl w-fit mb-4 ${scenario.color}`}>
                              <Icon className="h-8 w-8" />
                            </div>
                            <CardTitle className="text-2xl font-black text-white">{scenario.name}</CardTitle>
                            <Badge className="w-fit mt-2 bg-white/10 text-white/70 tracking-widest uppercase font-bold text-[10px]">{scenario.difficulty}</Badge>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <p className="text-sm text-blue-100/70 leading-relaxed min-h-[80px]">
                              {scenario.description}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/10">
                              <div>
                                <p className="text-[10px] uppercase tracking-widest font-black text-blue-100/40 mb-1">Starting Budget</p>
                                <p className="text-xl font-black text-white">${(scenario.budget / 1000000).toFixed(1)}M</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-widest font-black text-blue-100/40 mb-1">Horizon</p>
                                <p className="text-xl font-black text-white">{scenario.timeHorizon}</p>
                              </div>
                            </div>
                            
                            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                              <p className="text-[10px] uppercase tracking-widest font-black text-amber-500/70 mb-2">Board Mandate</p>
                              <p className="text-sm font-medium text-amber-100/80 italic">{scenario.executiveMandate}</p>
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
              <Card className="border border-white/10 bg-slate-900/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl font-black text-white">
                    <Building2 className="h-8 w-8 text-primary" />
                    Name Your Company
                  </CardTitle>
                  <CardDescription className="text-blue-100/60 text-lg">
                    Every great venture needs an identity. What will you call your company?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="company-name" className="text-blue-100/40 font-black tracking-widest uppercase text-xs">OFFICIAL CORPORATE ENTITY</Label>
                    <Input
                      id="company-name"
                      placeholder="e.g., Apex Health, Innovate Legal, Urban Outfitters Co."
                      value={data.companyName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, companyName: e.target.value })}
                      className="text-2xl font-bold h-16 bg-white/5 border-white/10 text-white placeholder:text-white/20"
                      autoFocus
                    />
                  </div>
                  {data.companyName && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-8 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20 mt-8"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left flex-1 space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">APPROVED IDENTITY</p>
                          <div className="text-4xl font-black text-white tracking-tight">
                            {data.companyName}
                          </div>
                        </div>
                        <div className="ml-6 shrink-0">
                          <LogoGenerator
                            companyName={data.companyName}
                            industry={selectedScenario?.industry || 'saas'}
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
              <Card className="border border-white/10 bg-slate-900/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl font-black text-white">
                    <DollarSign className="h-8 w-8 text-emerald-400" />
                    Initial Budget Philosophy
                  </CardTitle>
                  <CardDescription className="text-blue-100/60 text-lg">
                    How will you distribute your <span className="text-emerald-400 font-bold">${selectedScenario ? (selectedScenario.budget / 1000000).toFixed(1) : 0}M</span> starting budget across the funnel?
                  </CardDescription>
                  {budgetError && (
                    <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 font-bold">
                      <AlertTriangle className="h-5 w-5" />
                      {budgetError}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Total allocated indicator */}
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-1">TOTAL ALLOCATED</p>
                      <div className="text-5xl font-black text-white tracking-tighter">
                        {data.budgetAllocation.brandAwareness + data.budgetAllocation.leadGeneration + data.budgetAllocation.conversionOptimization}%
                      </div>
                    </div>
                    {data.budgetAllocation.brandAwareness + data.budgetAllocation.leadGeneration + data.budgetAllocation.conversionOptimization !== 100 && (
                      <p className="text-rose-400 font-bold text-sm bg-rose-500/10 px-4 py-2 rounded-full border border-rose-500/20">
                        Must equal exactly 100%
                      </p>
                    )}
                  </div>

                  {/* Brand Awareness Slider */}
                  <div className="space-y-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex justify-between">
                      <Label className="text-lg font-bold text-white flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        Brand Formation
                      </Label>
                      <span className="text-xl font-black text-purple-400">{data.budgetAllocation.brandAwareness}%</span>
                    </div>
                    <p className="text-sm text-blue-100/40">Long-term equity, mental availability, and market positioning.</p>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={data.budgetAllocation.brandAwareness}
                      onChange={(e) => updateBudgetAllocation('brandAwareness', parseInt(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  {/* Lead Generation Slider */}
                  <div className="space-y-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex justify-between">
                      <Label className="text-lg font-bold text-white flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        Demand Generation
                      </Label>
                      <span className="text-xl font-black text-blue-400">{data.budgetAllocation.leadGeneration}%</span>
                    </div>
                    <p className="text-sm text-blue-100/40">Capturing intent, building pipeline, and driving traffic.</p>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={data.budgetAllocation.leadGeneration}
                      onChange={(e) => updateBudgetAllocation('leadGeneration', parseInt(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* Conversion Slider */}
                  <div className="space-y-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex justify-between">
                      <Label className="text-lg font-bold text-white flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        Performance / Conversion
                      </Label>
                      <span className="text-xl font-black text-emerald-400">{data.budgetAllocation.conversionOptimization}%</span>
                    </div>
                    <p className="text-sm text-blue-100/40">Sales enablement, retargeting, and bottom-of-funnel closing.</p>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={data.budgetAllocation.conversionOptimization}
                      onChange={(e) => updateBudgetAllocation('conversionOptimization', parseInt(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Final Review */}
            {step === 4 && selectedScenario && (
              <Card className="border border-white/10 bg-slate-900/50 backdrop-blur-xl">
                <CardHeader className="text-center pb-8">
                  <LogoGenerator companyName={data.companyName} industry={selectedScenario.industry} />
                  <CardTitle className="text-3xl font-black text-white mt-6">Executive Briefing</CardTitle>
                  <CardDescription className="text-blue-100/60 text-lg">
                    Review your parameters before commencing simulation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Scenario Block */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] uppercase tracking-widest font-black text-blue-100/40">Campaign Context</h4>
                      <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-4 h-full">
                        <div className={`p-3 rounded-xl ${selectedScenario.color}`}>
                           <selectedScenario.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h5 className="font-black text-xl text-white tracking-tight">{selectedScenario.name}</h5>
                          <p className="text-sm text-blue-100/50 mt-2">{selectedScenario.description}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Badge className="bg-white/10 text-white hover:bg-white/20">{selectedScenario.timeHorizon}</Badge>
                            <Badge className="bg-white/10 text-white hover:bg-white/20">{selectedScenario.difficulty}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Financials Block */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] uppercase tracking-widest font-black text-blue-100/40">Financial Philosophy</h4>
                      <div className="p-6 bg-white/5 border border-white/10 rounded-2xl h-full flex flex-col justify-center">
                        <div className="flex justify-between items-baseline mb-6 border-b border-white/10 pb-4">
                          <span className="text-sm font-bold text-blue-100/60">Annual Budget</span>
                          <span className="text-3xl font-black text-emerald-400">${(selectedScenario.budget / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="space-y-3">
                           <div className="flex justify-between text-sm">
                             <span className="font-bold text-purple-400">Brand</span>
                             <span className="text-white font-black">{data.budgetAllocation.brandAwareness}%</span>
                           </div>
                           <div className="flex justify-between text-sm">
                             <span className="font-bold text-blue-400">Demand</span>
                             <span className="text-white font-black">{data.budgetAllocation.leadGeneration}%</span>
                           </div>
                           <div className="flex justify-between text-sm">
                             <span className="font-bold text-emerald-400">Conversion</span>
                             <span className="text-white font-black">{data.budgetAllocation.conversionOptimization}%</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl flex gap-4 items-start">
                    <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-black tracking-widest uppercase text-xs text-amber-500 mb-2">CEO Mandate</h4>
                      <p className="text-amber-100/80 italic font-medium">{selectedScenario.executiveMandate}</p>
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
            className={`text-white hover:bg-white/10 ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            Go Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-primary text-white hover:bg-primary/90 px-8 py-6 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all hover:scale-105"
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
