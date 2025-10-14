'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Clock, 
  Briefcase, 
  Target, 
  TrendingUp,
  Zap,
  Users,
  Rocket,
  ArrowRight,
  Sparkles,
  Play,
  Lock,
  Star
} from 'lucide-react';

interface GuestSetupData {
  companyName: string;
  timeHorizon: '1-year' | '3-year' | '5-year' | null;
  industry: 'healthcare' | 'legal' | 'ecommerce' | null;
  companyProfile: 'startup' | 'enterprise' | null;
  marketLandscape: 'disruptor' | 'crowded' | 'frontier' | null;
  budgetAllocation: {
    brandAwareness: number;
    leadGeneration: number;
    conversionOptimization: number;
  };
}

const TIME_HORIZONS = [
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

const INDUSTRIES = [
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
  }
];

const COMPANY_PROFILES = [
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

const MARKET_LANDSCAPES = [
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

export default function GuestPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<GuestSetupData>({
    companyName: '',
    timeHorizon: null,
    industry: null,
    companyProfile: null,
    marketLandscape: null,
    budgetAllocation: {
      brandAwareness: 33,
      leadGeneration: 34,
      conversionOptimization: 33
    }
  });

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Start guest simulation
      startGuestSimulation();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const startGuestSimulation = () => {
    // Save guest simulation data to localStorage
    const guestSimulation = {
      type: 'guest',
      config: {
        companyName: data.companyName,
        timeHorizon: data.timeHorizon || '1-year',
        industry: data.industry || 'ecommerce',
        companyProfile: data.companyProfile || 'startup',
        marketLandscape: data.marketLandscape || 'crowded',
        totalBudget: data.timeHorizon ? TIME_HORIZONS.find(h => h.id === data.timeHorizon)?.budget || 500000 : 500000,
        budgetAllocation: data.budgetAllocation,
      },
      currentQuarter: 'strategy',
      status: 'in_progress',
      totalBudget: data.timeHorizon ? TIME_HORIZONS.find(h => h.id === data.timeHorizon)?.budget || 500000 : 500000,
      budgetRemaining: data.timeHorizon ? TIME_HORIZONS.find(h => h.id === data.timeHorizon)?.budget || 500000 : 500000,
      totalRevenue: 0,
      totalProfit: 0,
      brandEquity: 50.0,
      teamMorale: 75.0,
      currentMarketShare: 5.0,
      competitorSpend: 0,
      marketSaturation: 0.3,
      quarterlyResults: [],
      seoInvestments: [],
      wildcardEvents: [],
      decisions: [],
    };

    localStorage.setItem('cmo-sim-guest-state', JSON.stringify(guestSimulation));
    
    // Navigate to guest simulation
    router.push('/guest/sim');
  };

  const canProceed = () => {
    switch (step) {
      case 1: return data.companyName.trim().length >= 2;
      case 2: return data.timeHorizon !== null;
      case 3: return data.industry !== null;
      case 4: return data.companyProfile !== null;
      case 5: return data.marketLandscape !== null;
      case 6: {
        const total = data.budgetAllocation.brandAwareness + 
                     data.budgetAllocation.leadGeneration + 
                     data.budgetAllocation.conversionOptimization;
        return total === 100;
      }
      default: return false;
    }
  };

  const updateBudgetAllocation = (key: keyof GuestSetupData['budgetAllocation'], value: number) => {
    setData({
      ...data,
      budgetAllocation: {
        ...data.budgetAllocation,
        [key]: value
      }
    });
  };

  const selectedBudget = data.timeHorizon
    ? TIME_HORIZONS.find(h => h.id === data.timeHorizon)?.budget || 0
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-orange-500/10 rounded-full"
          >
            <Play className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-500">Guest Mode - Try Before You Sign Up</span>
          </motion.div>
          
          <h1 className="text-4xl font-bold mb-2">Experience the CMO Simulator</h1>
          <p className="text-muted-foreground text-lg">
            Try the full simulation experience without creating an account
          </p>
          
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Full simulation access</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>No account required</span>
            </div>
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
            {/* Step 1: Company Name */}
            {step === 1 && (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-primary" />
                    Name Your Company
                  </CardTitle>
                  <CardDescription>
                    Every great venture needs an identity. What will you call your company?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      placeholder="e.g., Apex Health, Innovate Legal, Urban Outfitters Co."
                      value={data.companyName}
                      onChange={(e) => setData({ ...data, companyName: e.target.value })}
                      className="text-lg h-12"
                      autoFocus
                    />
                  </div>
                  
                  {data.companyName && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border-2 border-primary/20"
                    >
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">
                          {data.companyName}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Ready to make your mark in the market
                        </p>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Time Horizon */}
            {step === 2 && (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-6 w-6 text-primary" />
                    Choose Your Time Horizon
                  </CardTitle>
                  <CardDescription>
                    This determines your budget, strategy focus, and risk tolerance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {TIME_HORIZONS.map((horizon) => {
                      const Icon = horizon.icon;
                      const isSelected = data.timeHorizon === horizon.id;
                      
                      return (
                        <motion.div
                          key={horizon.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-2 border-primary shadow-lg' 
                                : 'border hover:border-primary/50'
                            }`}
                            onClick={() => setData({ ...data, timeHorizon: horizon.id })}
                          >
                            <CardHeader>
                              <Icon className={`h-8 w-8 mb-2 ${horizon.color}`} />
                              <CardTitle className="text-lg">{horizon.name}</CardTitle>
                              <CardDescription className="text-xs">
                                {horizon.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="text-2xl font-bold text-primary">
                                ${(horizon.budget / 1000000).toFixed(1)}M
                              </div>
                              <div className="space-y-1">
                                {horizon.characteristics.map((char) => (
                                  <div key={char} className="flex items-center gap-2 text-xs">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    <span>{char}</span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Industry */}
            {step === 3 && (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-6 w-6 text-primary" />
                    Select Your Industry
                  </CardTitle>
                  <CardDescription>
                    Each industry has unique challenges and opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {INDUSTRIES.map((industry) => {
                      const isSelected = data.industry === industry.id;
                      
                      return (
                        <motion.div
                          key={industry.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all h-full ${
                              isSelected 
                                ? 'border-2 border-primary shadow-lg' 
                                : 'border hover:border-primary/50'
                            }`}
                            onClick={() => setData({ ...data, industry: industry.id })}
                          >
                            <CardHeader>
                              <div className="text-4xl mb-2">{industry.icon}</div>
                              <CardTitle className="text-lg">{industry.name}</CardTitle>
                              <CardDescription className="text-xs">
                                {industry.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Avg. Customer Value</span>
                                <span className="font-semibold">${industry.avgCustomerValue.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Sales Cycle</span>
                                <Badge variant="outline" className="text-xs">{industry.salesCycle}</Badge>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Competition</span>
                                <Badge variant="outline" className="text-xs">{industry.competitionLevel}</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Company Profile */}
            {step === 4 && (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    Define Your Company Profile
                  </CardTitle>
                  <CardDescription>
                    Your company size determines available resources and constraints
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {COMPANY_PROFILES.map((profile) => {
                      const Icon = profile.icon;
                      const isSelected = data.companyProfile === profile.id;
                      
                      return (
                        <motion.div
                          key={profile.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all h-full ${
                              isSelected 
                                ? 'border-2 border-primary shadow-lg' 
                                : 'border hover:border-primary/50'
                            }`}
                            onClick={() => setData({ ...data, companyProfile: profile.id })}
                          >
                            <CardHeader>
                              <Icon className="h-10 w-10 mb-2 text-primary" />
                              <CardTitle>{profile.name}</CardTitle>
                              <CardDescription>{profile.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Team Size</p>
                                <p className="font-semibold">{profile.teamSize}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm text-muted-foreground mb-2">Advantages</p>
                                <div className="space-y-1">
                                  {profile.advantages.map((adv) => (
                                    <div key={adv} className="flex items-center gap-2 text-sm">
                                      <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                      <span>{adv}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <p className="text-sm text-muted-foreground mb-2">Challenges</p>
                                <div className="space-y-1">
                                  {profile.challenges.map((chal) => (
                                    <div key={chal} className="flex items-center gap-2 text-sm">
                                      <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                      <span>{chal}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Market Landscape */}
            {step === 5 && (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-6 w-6 text-primary" />
                    Analyze the Competitive Landscape
                  </CardTitle>
                  <CardDescription>
                    Choose your battlefield - each scenario presents unique challenges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {MARKET_LANDSCAPES.map((landscape) => {
                      const isSelected = data.marketLandscape === landscape.id;
                      
                      return (
                        <motion.div
                          key={landscape.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-2 border-primary shadow-lg' 
                                : 'border hover:border-primary/50'
                            }`}
                            onClick={() => setData({ ...data, marketLandscape: landscape.id })}
                          >
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="text-3xl">{landscape.icon}</div>
                                  <div>
                                    <CardTitle className="text-lg">{landscape.name}</CardTitle>
                                    <CardDescription>{landscape.description}</CardDescription>
                                  </div>
                                </div>
                                <Badge variant={
                                  landscape.difficulty === 'Medium' ? 'default' :
                                  landscape.difficulty === 'Hard' ? 'secondary' : 'destructive'
                                }>
                                  {landscape.difficulty}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground mb-1">Competitor Profile</p>
                                  <p className="font-medium">{landscape.competitorProfile}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground mb-1">Opportunity Level</p>
                                  <p className="font-medium">{landscape.opportunity}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 6: Budget Allocation */}
            {step === 6 && (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    Set Annual Budget Allocation
                  </CardTitle>
                  <CardDescription>
                    Allocate your ${(selectedBudget / 1000000).toFixed(1)}M budget across three strategic buckets (must total 100%)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Brand Awareness */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-base">Brand Awareness (Top of Funnel)</Label>
                        <p className="text-xs text-muted-foreground">Content, SEO, Social Presence</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {data.budgetAllocation.brandAwareness}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ${((selectedBudget * data.budgetAllocation.brandAwareness) / 100).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={data.budgetAllocation.brandAwareness}
                      onChange={(e) => updateBudgetAllocation('brandAwareness', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Lead Generation */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-base">Lead Generation (Mid-Funnel)</Label>
                        <p className="text-xs text-muted-foreground">Google Ads, Social Ads, Webinars</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {data.budgetAllocation.leadGeneration}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ${((selectedBudget * data.budgetAllocation.leadGeneration) / 100).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={data.budgetAllocation.leadGeneration}
                      onChange={(e) => updateBudgetAllocation('leadGeneration', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Conversion Optimization */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-base">Conversion Optimization (Bottom of Funnel)</Label>
                        <p className="text-xs text-muted-foreground">A/B Testing, Website, CRO</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {data.budgetAllocation.conversionOptimization}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ${((selectedBudget * data.budgetAllocation.conversionOptimization) / 100).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={data.budgetAllocation.conversionOptimization}
                      onChange={(e) => updateBudgetAllocation('conversionOptimization', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Total */}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Allocation</span>
                      <span className={`text-2xl font-bold ${
                        data.budgetAllocation.brandAwareness + 
                        data.budgetAllocation.leadGeneration + 
                        data.budgetAllocation.conversionOptimization === 100
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}>
                        {data.budgetAllocation.brandAwareness + 
                         data.budgetAllocation.leadGeneration + 
                         data.budgetAllocation.conversionOptimization}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            size="lg"
          >
            {step === totalSteps ? (
              <>
                Start Guest Simulation
                <Play className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Guest Mode Notice */}
        <div className="mt-8 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-white font-bold">!</span>
            </div>
            <div>
              <h4 className="font-medium text-orange-800 dark:text-orange-200">Guest Mode Limitations</h4>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                Your simulation progress will not be saved. To save your results and compete on leaderboards, 
                <Button variant="link" className="p-0 h-auto text-orange-600 dark:text-orange-400" onClick={() => router.push('/signup')}>
                  create a free account
                </Button>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
