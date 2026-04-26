'use client';

import { useEffect, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { LogoGenerator, type CompanyLogoStyle } from '@/components/LogoGenerator';
import { usePageTracking, useSimulationTracking } from '@/hooks/useAnalytics';
import { logger } from '@/lib/logger';
import { getSimAuthSession } from '@/lib/simAuth';
import { SimulationContext } from '@/lib/simMachine';
import { resolveSimulationPath } from '@/lib/simulationRouting';
import { cn } from '@/lib/utils';
import { CompanyProfile, Industry, MarketLandscape, TimeHorizon } from '@/types';
import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CircleCheckBig,
  Compass,
  DollarSign,
  LayoutGrid,
  LineChart,
  Orbit,
  Rocket,
  Target,
  Wrench,
  Zap,
} from 'lucide-react';

interface SetupData {
  scenarioId: string | null;
  companyName: string;
  logoStyle: CompanyLogoStyle;
  budgetAllocation: {
    brandAwareness: number;
    leadGeneration: number;
    conversionOptimization: number;
  };
}

type SetupStepMeta = {
  label: string;
  title: string;
  summary: string;
  tooltip: string;
  popupTitle: string;
  popupDescription: string;
  nextAction: string;
  nextDetails: string[];
};

const STEP_META: SetupStepMeta[] = [
  {
    label: 'Operating Scenario',
    title: 'Choose your board context',
    summary: 'The scenario sets your budget, market pressure, and the type of leadership mandate you start under.',
    tooltip: 'Scenario selection defines the initial operating environment, starting budget, and the difficulty profile used throughout the simulation.',
    popupTitle: 'What happens after scenario selection?',
    popupDescription: 'Your scenario becomes the baseline for the workspace. The next step names the company and creates the identity shown throughout the simulator.',
    nextAction: 'Next, you will name the workspace and approve the company mark that appears across the CRM shell.',
    nextDetails: [
      'The chosen scenario locks the starting budget and board mandate.',
      'The company profile and market conditions flow into your strategy setup.',
      'The selected scenario preview stays visible in the workspace summary rail.',
    ],
  },
  {
    label: 'Company Identity',
    title: 'Approve the company identity',
    summary: 'Name the business and choose the mark treatment that will represent the workspace in the simulator shell.',
    tooltip: 'The company name and logo style are reused in the workspace header, mobile shell, and review screens.',
    popupTitle: 'What happens after identity approval?',
    popupDescription: 'Once the identity is set, the next step establishes your budget posture so the strategy and quarter views can frame tradeoffs correctly.',
    nextAction: 'Next, you will divide the annual budget across brand, demand, and conversion priorities.',
    nextDetails: [
      'The approved name appears in the sidebar and operating header.',
      'The selected mark style becomes the workspace logo for desktop and mobile views.',
      'A stronger identity makes the next review step easier to scan and validate.',
    ],
  },
  {
    label: 'Budget Philosophy',
    title: 'Set the capital posture',
    summary: 'Allocate 100% of the annual budget so the simulator knows whether you are leaning into brand, pipeline, or conversion efficiency.',
    tooltip: 'Budget posture does not spend money yet. It sets the initial planning bias the simulator carries into strategy and quarterly decision-making.',
    popupTitle: 'What happens after budget setup?',
    popupDescription: 'The final review step turns your selections into an executive brief, then passes you into the strategy session with the scenario and budget posture preloaded.',
    nextAction: 'Next, you will review an executive brief before launching the strategy session.',
    nextDetails: [
      'The budget split is checked for a complete 100% allocation.',
      'The financial summary shows how your posture will be presented back to leadership.',
      'This split follows you into the strategy session as your initial operating philosophy.',
    ],
  },
  {
    label: 'Executive Briefing',
    title: 'Validate the workspace before launch',
    summary: 'Confirm the scenario, identity, and budget posture before entering the strategy session.',
    tooltip: 'Completing setup saves the simulation context locally and routes you into the strategy session with the workspace already configured.',
    popupTitle: 'What happens after setup is complete?',
    popupDescription: 'The simulator saves your workspace, opens the strategy session, and then routes you into Q1 once the strategic foundation is complete.',
    nextAction: 'Next, you will define audience, positioning, and primary channels before the Q1 operating console unlocks.',
    nextDetails: [
      'Setup saves the workspace to local storage for the simulation provider.',
      'You are routed directly to the strategy session after setup.',
      'Once strategy is complete, the CRM-style quarterly console opens in Q1.',
    ],
  },
];

const LOGO_STYLE_OPTIONS: Array<{
  id: CompanyLogoStyle;
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    id: 'orb',
    label: 'Executive Orb',
    description: 'Rounded and polished. Best for software-forward or growth-stage brands.',
    icon: Orbit,
  },
  {
    id: 'badge',
    label: 'Ledger Badge',
    description: 'Structured and stable. Good for service, operational, or institutional brands.',
    icon: LayoutGrid,
  },
  {
    id: 'monogram',
    label: 'Monogram Plate',
    description: 'Minimal and formal. Best when you want a sharper corporate identity.',
    icon: Building2,
  },
];

const BUDGET_GUIDANCE: Array<{
  key: keyof SetupData['budgetAllocation'];
  label: string;
  shortLabel: string;
  description: string;
  detail: string;
  accent: string;
  track: string;
}> = [
  {
    key: 'brandAwareness',
    label: 'Brand Formation',
    shortLabel: 'Brand',
    description: 'Long-term equity, memory structure, positioning, and category ownership.',
    detail: 'Higher investment here improves durable visibility and supports slower-burn growth bets.',
    accent: 'text-violet-300',
    track: 'accent-violet-400',
  },
  {
    key: 'leadGeneration',
    label: 'Demand Generation',
    shortLabel: 'Demand',
    description: 'Traffic, lead capture, pipeline creation, and market activation.',
    detail: 'Higher investment here biases the workspace toward near-term acquisition and opportunity creation.',
    accent: 'text-sky-300',
    track: 'accent-sky-400',
  },
  {
    key: 'conversionOptimization',
    label: 'Performance / Conversion',
    shortLabel: 'Conversion',
    description: 'Sales enablement, closing efficiency, retargeting, and revenue capture.',
    detail: 'Higher investment here favors efficiency, monetization, and lower-funnel execution.',
    accent: 'text-emerald-300',
    track: 'accent-emerald-400',
  },
];

export const SCENARIOS = [
  {
    id: 'turnaround',
    name: 'The Turnaround',
    description: 'A legacy brand steadily losing market share. Your job is to stop the bleeding and revitalize the brand before cash runs out.',
    icon: Target,
    color: 'text-amber-300 bg-amber-500/10 border-amber-400/20',
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
      customerSatisfaction: 35,
    },
    executiveMandate: 'Immediate stabilization and return to profitability.',
  },
  {
    id: 'hyper-growth',
    name: 'Hyper-Growth SaaS',
    description: 'A heavily funded Series B startup. The board demands aggressive acquisition at all costs to hit unicorn valuation.',
    icon: Rocket,
    color: 'text-violet-300 bg-violet-500/10 border-violet-400/20',
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
      customerSatisfaction: 85,
    },
    executiveMandate: 'Triple-digit YoY growth. Unit economics secondary.',
  },
  {
    id: 'challenger',
    name: 'The Challenger Brand',
    description: 'A lean startup trying to disrupt a massive incumbent. You must be resourceful, loud, and strategic to survive.',
    icon: Zap,
    color: 'text-emerald-300 bg-emerald-500/10 border-emerald-400/20',
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
      customerSatisfaction: 90,
    },
    executiveMandate: 'Build an obsessed cult-following over 5 years.',
  },
];

function formatBudget(value: number) {
  return `$${(value / 1_000_000).toFixed(1)}M`;
}

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [guideOpen, setGuideOpen] = useState(false);
  const [data, setData] = useState<SetupData>({
    scenarioId: null,
    companyName: '',
    logoStyle: 'monogram',
    budgetAllocation: {
      brandAwareness: 33,
      leadGeneration: 34,
      conversionOptimization: 33,
    },
  });

  usePageTracking();
  const { trackStart } = useSimulationTracking();

  const [hasSavedRun, setHasSavedRun] = useState(false);
  const [savedRunContext, setSavedRunContext] = useState<Partial<SimulationContext> | null>(null);
  const [savedRunPhase, setSavedRunPhase] = useState<string>('idle');

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;
  const budgetTotal =
    data.budgetAllocation.brandAwareness +
    data.budgetAllocation.leadGeneration +
    data.budgetAllocation.conversionOptimization;
  const selectedScenario = SCENARIOS.find((scenario) => scenario.id === data.scenarioId);
  const SelectedScenarioIcon = selectedScenario?.icon;
  const stepMeta = STEP_META[step - 1];

  useEffect(() => {
    const session = getSimAuthSession();
    if (!session) return;

    const loadLatestRun = async () => {
      try {
        const response = await fetch(`/api/simulations/latest?userId=${encodeURIComponent(session.userId)}`);
        if (!response.ok) return;
        const responseData = await response.json();
        if (responseData?.run?.context) {
          setHasSavedRun(true);
          setSavedRunContext(responseData.run.context as Partial<SimulationContext>);
          setSavedRunPhase(responseData.run.current_phase || 'idle');
        }
      } catch (error) {
        logger.error('Failed to load latest saved run', error);
      }
    };

    void loadLatestRun();
  }, []);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((current) => current + 1);
      return;
    }

    void saveAndContinue();
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((current) => current - 1);
    }
  };

  const saveAndContinue = async () => {
    try {
      const scenario = SCENARIOS.find((entry) => entry.id === data.scenarioId);
      if (!scenario) throw new Error('Scenario missing');

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
      };

      localStorage.setItem('cmo-sim-state-v2', JSON.stringify(initialState));

      trackStart({
        industry: scenario.industry,
        difficulty: 'intermediate',
        timeHorizon: scenario.timeHorizon,
        totalBudget: scenario.budget,
      });

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
        logoStyle: 'monogram',
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
      case 1:
        return data.scenarioId !== null;
      case 2:
        return data.companyName.trim().length >= 2;
      case 3:
        return budgetTotal === 100;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const updateBudgetAllocation = (key: keyof SetupData['budgetAllocation'], value: number) => {
    setData((current) => ({
      ...current,
      budgetAllocation: {
        ...current.budgetAllocation,
        [key]: value,
      },
    }));
  };

  const completedSteps = STEP_META.slice(0, step - 1);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
        <div className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_34%),linear-gradient(135deg,#0f172a_0%,#172554_48%,#1e293b_100%)] px-6 py-6 text-white sm:px-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-100">
                <Wrench className="h-3.5 w-3.5" />
                Workspace Setup
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Configure the operating workspace</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
                This setup flow now mirrors the CRM-style simulator shell. Each decision becomes part of the executive context used by strategy and quarterly operations.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px]">
              <Button
                type="button"
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:bg-white/16 hover:text-white"
                onClick={launchGuidedDemo}
              >
                Start Guided Demo Run
              </Button>
              {hasSavedRun ? (
                <Button
                  type="button"
                  variant="outline"
                  className="border-emerald-300/30 bg-emerald-400/12 text-emerald-50 hover:bg-emerald-400/18 hover:text-white"
                  onClick={resumeSavedRun}
                >
                  Resume Latest Saved Run
                </Button>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-200">
                  Guided setup builds a fresh workspace if no prior run exists.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-6 py-5 sm:px-8 lg:grid-cols-[minmax(0,1.5fr)_320px]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {stepMeta.label}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="text-lg font-semibold text-slate-950">
                    Step {step} of {totalSteps}
                  </div>
                  <InfoTooltip iconOnly content={stepMeta.tooltip} />
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                onClick={() => setGuideOpen(true)}
              >
                What happens next?
              </Button>
            </div>
            <div className="mt-4">
              <Progress value={progress} className="h-2.5 bg-slate-200" />
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>{stepMeta.summary}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Next action</div>
            <p className="mt-2 text-sm font-semibold text-slate-900">{stepMeta.nextAction}</p>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              {stepMeta.nextDetails.map((detail) => (
                <div key={detail} className="flex items-start gap-2">
                  <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_320px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {step === 1 && (
              <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
                <CardHeader className="border-b border-slate-200 bg-slate-50/80">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-2xl font-semibold tracking-tight text-slate-950">Select the operating scenario</CardTitle>
                        <InfoTooltip iconOnly content="This selection sets your budget, time horizon, and the baseline level of pressure carried into the simulation." />
                      </div>
                      <CardDescription className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                        Choose the board context you want to run. The selected scenario drives the workspace brief, starting budget, and difficulty conditions.
                      </CardDescription>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                      Select one scenario to unlock identity setup.
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-5 lg:grid-cols-3">
                    {SCENARIOS.map((scenario) => {
                      const Icon = scenario.icon;
                      const isSelected = data.scenarioId === scenario.id;

                      return (
                        <button
                          key={scenario.id}
                          type="button"
                          className={cn(
                            'group h-full rounded-3xl border p-5 text-left transition-all',
                            isSelected
                              ? 'border-slate-900 bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.2)]'
                              : 'border-slate-200 bg-slate-50/70 text-slate-950 hover:border-slate-300 hover:bg-white',
                          )}
                          onClick={() => setData((current) => ({ ...current, scenarioId: scenario.id }))}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className={cn('rounded-2xl border p-3', isSelected ? 'border-white/10 bg-white/10' : scenario.color)}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <Badge
                              className={cn(
                                'border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]',
                                isSelected
                                  ? 'border-white/10 bg-white/10 text-white'
                                  : 'border-slate-200 bg-white text-slate-600',
                              )}
                            >
                              {scenario.difficulty}
                            </Badge>
                          </div>

                          <div className="mt-5">
                            <h3 className="text-xl font-semibold tracking-tight">{scenario.name}</h3>
                            <p className={cn('mt-3 text-sm leading-6', isSelected ? 'text-slate-200' : 'text-slate-600')}>
                              {scenario.description}
                            </p>
                          </div>

                          <div className={cn('mt-5 grid grid-cols-2 gap-3 rounded-2xl border p-4', isSelected ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white')}>
                            <div>
                              <div className={cn('text-[10px] font-semibold uppercase tracking-[0.18em]', isSelected ? 'text-slate-300' : 'text-slate-500')}>
                                Budget
                              </div>
                              <div className="mt-1 text-lg font-semibold">{formatBudget(scenario.budget)}</div>
                            </div>
                            <div>
                              <div className={cn('text-[10px] font-semibold uppercase tracking-[0.18em]', isSelected ? 'text-slate-300' : 'text-slate-500')}>
                                Horizon
                              </div>
                              <div className="mt-1 text-lg font-semibold">{scenario.timeHorizon}</div>
                            </div>
                          </div>

                          <div className={cn('mt-4 rounded-2xl border p-4 text-sm leading-6', isSelected ? 'border-amber-300/18 bg-amber-300/10 text-amber-50' : 'border-slate-200 bg-white text-slate-600')}>
                            <div className={cn('text-[10px] font-semibold uppercase tracking-[0.18em]', isSelected ? 'text-amber-100' : 'text-slate-500')}>
                              Board mandate
                            </div>
                            <p className="mt-2">{scenario.executiveMandate}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
                <CardHeader className="border-b border-slate-200 bg-slate-50/80">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                      <Building2 className="h-6 w-6 text-slate-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-2xl font-semibold tracking-tight text-slate-950">Name the workspace</CardTitle>
                        <InfoTooltip iconOnly content="The approved identity becomes the persistent workspace label and company mark in the CRM-style simulator shell." />
                      </div>
                      <CardDescription className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                        Replace the placeholder feel with a cleaner corporate identity. The company mark previews exactly how the workspace will appear in the simulator shell.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_280px]">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="company-name" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                          Official company name
                        </Label>
                        <Input
                          id="company-name"
                          placeholder="e.g., Apex Health, Marketline Systems, Northstar Legal"
                          value={data.companyName}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            setData((current) => ({ ...current, companyName: event.target.value }))
                          }
                          className="h-14 border-slate-200 bg-white text-lg font-semibold text-slate-950 placeholder:text-slate-400"
                          autoFocus
                        />
                        <p className="text-sm text-slate-500">
                          Use the operating name leadership would expect to see in a CRM header or board summary.
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Mark treatment</div>
                          <InfoTooltip iconOnly content="The generator now uses more restrained corporate treatments instead of playful default shapes." />
                        </div>
                        <div className="mt-3 grid gap-3 md:grid-cols-3">
                          {LOGO_STYLE_OPTIONS.map((option) => {
                            const Icon = option.icon;
                            const isSelected = data.logoStyle === option.id;

                            return (
                              <button
                                key={option.id}
                                type="button"
                                className={cn(
                                  'rounded-2xl border p-4 text-left transition-all',
                                  isSelected
                                    ? 'border-slate-900 bg-slate-950 text-white shadow-[0_14px_30px_rgba(15,23,42,0.16)]'
                                    : 'border-slate-200 bg-slate-50/70 text-slate-900 hover:border-slate-300 hover:bg-white',
                                )}
                                onClick={() => setData((current) => ({ ...current, logoStyle: option.id }))}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={cn('rounded-xl border p-2.5', isSelected ? 'border-white/10 bg-white/10' : 'border-slate-200 bg-white')}>
                                    <Icon className="h-5 w-5" />
                                  </div>
                                  <div className="text-sm font-semibold">{option.label}</div>
                                </div>
                                <p className={cn('mt-3 text-sm leading-6', isSelected ? 'text-slate-200' : 'text-slate-600')}>
                                  {option.description}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                        <div className="flex items-center gap-2">
                          <Compass className="h-4 w-4 text-slate-500" />
                          <div className="text-sm font-semibold text-slate-900">After identity approval</div>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          The next step establishes the annual capital posture. That budget philosophy will appear in the executive brief and carry forward into strategy.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Workspace identity preview</div>
                      <div className="mt-4 flex justify-center">
                        <LogoGenerator
                          companyName={data.companyName}
                          industry={selectedScenario?.industry || 'saas'}
                          style={data.logoStyle}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
                <CardHeader className="border-b border-slate-200 bg-slate-50/80">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-2xl font-semibold tracking-tight text-slate-950">Set the initial budget philosophy</CardTitle>
                        <InfoTooltip iconOnly content="These allocations do not execute tactics yet. They establish the financial posture carried into strategy and quarterly planning." />
                      </div>
                      <CardDescription className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                        Distribute the starting {selectedScenario ? formatBudget(selectedScenario.budget) : '$0.0M'} annual budget across brand, demand, and conversion priorities.
                      </CardDescription>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Allocation status</div>
                      <div className="mt-1 text-2xl font-semibold text-slate-950">{budgetTotal}%</div>
                      <div className={cn('mt-1 text-xs', budgetTotal === 100 ? 'text-emerald-600' : 'text-rose-600')}>
                        {budgetTotal === 100 ? 'Balanced and ready for review' : 'Must total exactly 100%'}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 p-6">
                  {BUDGET_GUIDANCE.map((item) => (
                    <div key={item.key} className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-2xl">
                          <div className="flex items-center gap-2">
                            <div className={cn('text-lg font-semibold tracking-tight text-slate-950', item.accent)}>
                              {item.label}
                            </div>
                            <InfoTooltip iconOnly content={item.detail} />
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                        </div>
                        <div className={cn('text-2xl font-semibold', item.accent)}>
                          {data.budgetAllocation[item.key]}%
                        </div>
                      </div>

                      <div className="mt-4">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={data.budgetAllocation[item.key]}
                          onChange={(event) => updateBudgetAllocation(item.key, parseInt(event.target.value, 10))}
                          className={cn('h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200', item.track)}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                      <div className="flex items-center gap-2">
                        <LineChart className="h-4 w-4 text-slate-500" />
                        <div className="text-sm font-semibold text-slate-900">Why this matters</div>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        This capital posture becomes the frame for the executive brief. Strategy decisions and quarter-by-quarter tactics will inherit the orientation you set here.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Current split</div>
                      <div className="mt-3 space-y-2">
                        {BUDGET_GUIDANCE.map((item) => (
                          <div key={item.key} className="flex items-center justify-between text-sm text-slate-700">
                            <span>{item.shortLabel}</span>
                            <span className="font-semibold text-slate-950">{data.budgetAllocation[item.key]}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 4 && selectedScenario && (
              <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
                <CardHeader className="border-b border-slate-200 bg-slate-50/80 pb-6 text-center">
                  <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
                    <LogoGenerator companyName={data.companyName} industry={selectedScenario.industry} style={data.logoStyle} />
                    <CardTitle className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">Executive workspace brief</CardTitle>
                    <CardDescription className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                      Review the final operating context before handing the workspace into the strategy session.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 p-6">
                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Campaign context</div>
                      <div className="mt-4 flex items-start gap-4">
                        <div className={cn('rounded-2xl border p-3', selectedScenario.color)}>
                          {SelectedScenarioIcon ? <SelectedScenarioIcon className="h-6 w-6" /> : null}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold tracking-tight text-slate-950">{selectedScenario.name}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{selectedScenario.description}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Badge className="border border-slate-200 bg-white text-slate-700">{selectedScenario.timeHorizon}</Badge>
                            <Badge className="border border-slate-200 bg-white text-slate-700">{selectedScenario.difficulty}</Badge>
                            <Badge className="border border-slate-200 bg-white text-slate-700 capitalize">
                              {selectedScenario.industry.replace('-', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Financial philosophy</div>
                      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                          <div>
                            <div className="text-sm font-semibold text-slate-600">Annual Budget</div>
                            <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
                              {formatBudget(selectedScenario.budget)}
                            </div>
                          </div>
                          <DollarSign className="h-8 w-8 text-emerald-600" />
                        </div>
                        <div className="mt-4 space-y-3">
                          {BUDGET_GUIDANCE.map((item) => (
                            <div key={item.key} className="flex items-center justify-between text-sm">
                              <span className="font-medium text-slate-600">{item.shortLabel}</span>
                              <span className="font-semibold text-slate-950">{data.budgetAllocation[item.key]}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">CEO mandate</div>
                        <p className="mt-2 text-sm font-medium leading-6 text-amber-900">{selectedScenario.executiveMandate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-950 px-5 py-4 text-white">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">What launches next</div>
                    <p className="mt-2 text-sm leading-6 text-slate-200">
                      Completing setup saves this workspace, opens the strategy session, and then unlocks the Q1 operating console once audience, positioning, and channels are defined.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        <aside className="space-y-5">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold tracking-tight text-slate-950">Workspace summary</CardTitle>
              <CardDescription>Live view of what the simulator will carry into strategy.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Scenario</div>
                <div className="mt-2 text-sm font-semibold text-slate-950">
                  {selectedScenario ? selectedScenario.name : 'Awaiting selection'}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  {selectedScenario ? `${formatBudget(selectedScenario.budget)} annual budget` : 'Choose a board context to continue.'}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Identity</div>
                <div className="mt-2 text-sm font-semibold text-slate-950">
                  {data.companyName.trim() || 'Name not approved yet'}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  {LOGO_STYLE_OPTIONS.find((option) => option.id === data.logoStyle)?.label}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Budget posture</div>
                <div className="mt-2 space-y-2">
                  {BUDGET_GUIDANCE.map((item) => (
                    <div key={item.key} className="flex items-center justify-between text-sm text-slate-700">
                      <span>{item.shortLabel}</span>
                      <span className="font-semibold text-slate-950">{data.budgetAllocation[item.key]}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold tracking-tight text-slate-950">Completion rail</CardTitle>
              <CardDescription>Clear status on what is done and what still follows.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {STEP_META.map((item, index) => {
                const isComplete = index < step - 1;
                const isActive = index === step - 1;

                return (
                  <div
                    key={item.label}
                    className={cn(
                      'rounded-2xl border px-4 py-3',
                      isActive
                        ? 'border-slate-900 bg-slate-950 text-white'
                        : isComplete
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                          : 'border-slate-200 bg-slate-50/80 text-slate-600',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn('mt-0.5 rounded-full p-1', isActive ? 'bg-white/10' : isComplete ? 'bg-emerald-100' : 'bg-white')}>
                        <CircleCheckBig className={cn('h-4 w-4', isActive ? 'text-white' : isComplete ? 'text-emerald-700' : 'text-slate-400')} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{item.label}</div>
                        <div className={cn('mt-1 text-xs leading-5', isActive ? 'text-slate-200' : isComplete ? 'text-emerald-800' : 'text-slate-500')}>
                          {isActive ? item.nextAction : isComplete ? 'Completed and committed to the workspace brief.' : item.summary}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {completedSteps.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500">
                  No setup steps completed yet. Start with the operating scenario.
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>

      <div className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          className={cn('justify-start px-0 text-slate-600 hover:bg-transparent hover:text-slate-950', step === 1 && 'pointer-events-none opacity-0')}
        >
          Go Back
        </Button>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <div className="text-sm text-slate-500">
            {canProceed()
              ? 'This step is complete and ready to advance.'
              : step === 3
                ? 'Budget allocation must equal 100% before you continue.'
                : 'Complete the current step to continue.'}
          </div>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="h-12 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400"
          >
            {step === totalSteps ? (
              <span className="flex items-center gap-2">
                Commence Strategy Session
                <Rocket className="h-4 w-4" />
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continue
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      </div>

      <Dialog open={guideOpen} onOpenChange={setGuideOpen}>
        <DialogContent className="max-w-2xl border-slate-200 bg-white text-slate-950">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold tracking-tight">{stepMeta.popupTitle}</DialogTitle>
            <DialogDescription className="text-sm leading-6 text-slate-600">
              {stepMeta.popupDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Immediate next action</div>
              <p className="mt-2 text-sm font-semibold text-slate-950">{stepMeta.nextAction}</p>
            </div>

            <div className="space-y-3">
              {stepMeta.nextDetails.map((detail) => (
                <div key={detail} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <p className="text-sm leading-6 text-slate-600">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
