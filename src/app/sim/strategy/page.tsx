"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useSimulation } from '@/hooks/useSimulation';
import {
  ArrowRight,
  Target,
  Users,
  Megaphone,
  DollarSign,
  Building2,
  Globe2,
  PieChart,
} from 'lucide-react';
import {
  BUDGET_BUCKETS,
  COMPANY_SIZE_OPTIONS,
  DEFAULT_BUDGET_ALLOCATION,
  MARKET_LANDSCAPE_OPTIONS,
  TIME_HORIZON_OPTIONS,
  type BudgetBucketKey,
  type CompanySizeValue,
  type MarketLandscapeValue,
  type TimeHorizonValue,
} from '@/lib/strategyOptions';

type StrategyFormState = {
  companyName: string;
  industry: string;
  companySize: CompanySizeValue | '';
  marketLandscape: MarketLandscapeValue | '';
  timeHorizon: TimeHorizonValue | '';
  targetAudience: string;
  brandPositioning: string;
  primaryChannels: string[];
  budgetAllocation: Record<BudgetBucketKey, number>;
  customAudience: string;
  customPositioning: string;
};

const CHANNEL_OPTIONS = [
  { id: 'digital', name: 'Digital Marketing', icon: '💻' },
  { id: 'social', name: 'Social Media', icon: '📱' },
  { id: 'traditional', name: 'Traditional Media', icon: '📺' },
  { id: 'content', name: 'Content Marketing', icon: '📝' },
  { id: 'events', name: 'Events & Experiences', icon: '🎪' },
  { id: 'partnerships', name: 'Partnerships', icon: '🤝' },
];

const AUDIENCE_OPTIONS = [
  'Young Professionals (25-35)',
  'Families with Children',
  'Tech-Savvy Millennials',
  'Budget-Conscious Consumers',
  'Premium/Luxury Seekers',
  'Small Business Owners',
];

const POSITIONING_OPTIONS = [
  'Premium Quality Leader',
  'Best Value for Money',
  'Innovation & Technology',
  'Sustainability & Ethics',
  'Customer Service Excellence',
  'Convenience & Speed',
];

export default function StrategySessionPage() {
  const router = useRouter();
  const { context, setStrategy, completeStrategySession, startSimulation } = useSimulation();

  const initialBudgetAllocation = useMemo(() => ({
    ...DEFAULT_BUDGET_ALLOCATION,
    ...(context.strategy.budgetAllocation || {}),
  }), [context.strategy.budgetAllocation]);

  const [formData, setFormData] = useState<StrategyFormState>({
    companyName: context.strategy.companyName || '',
    industry: context.strategy.industry || '',
    companySize: context.strategy.companySize || '',
    marketLandscape: context.strategy.marketLandscape || '',
    timeHorizon: context.strategy.timeHorizon || '',
    targetAudience: context.strategy.targetAudience || '',
    brandPositioning: context.strategy.brandPositioning || '',
    primaryChannels: context.strategy.primaryChannels || [],
    budgetAllocation: initialBudgetAllocation,
    customAudience: '',
    customPositioning: '',
  });

  const handleChannelToggle = (channelId: string) => {
    const updatedChannels = formData.primaryChannels.includes(channelId)
      ? formData.primaryChannels.filter(id => id !== channelId)
      : [...formData.primaryChannels, channelId];

    setFormData({ ...formData, primaryChannels: updatedChannels });
    setStrategy({ primaryChannels: updatedChannels });
  };

  const handleCompanySizeSelect = (value: CompanySizeValue) => {
    setFormData(prev => ({ ...prev, companySize: value }));
    setStrategy({ companySize: value });
  };

  const handleMarketLandscapeSelect = (value: MarketLandscapeValue) => {
    setFormData(prev => ({ ...prev, marketLandscape: value }));
    setStrategy({ marketLandscape: value });
  };

  const handleTimeHorizonSelect = (value: TimeHorizonValue) => {
    setFormData(prev => ({ ...prev, timeHorizon: value }));
    setStrategy({ timeHorizon: value });
  };

  const handleAudienceSelect = (audience: string) => {
    setFormData({ ...formData, targetAudience: audience });
    setStrategy({ targetAudience: audience });
  };

  const handlePositioningSelect = (positioning: string) => {
    setFormData({ ...formData, brandPositioning: positioning });
    setStrategy({ brandPositioning: positioning });
  };

  const handleCustomAudience = () => {
    if (formData.customAudience.trim()) {
      handleAudienceSelect(formData.customAudience.trim());
      setFormData({ ...formData, customAudience: '' });
    }
  };

  const handleCustomPositioning = () => {
    if (formData.customPositioning.trim()) {
      handlePositioningSelect(formData.customPositioning.trim());
      setFormData({ ...formData, customPositioning: '' });
    }
  };

  const handleBudgetChange = (bucket: BudgetBucketKey, value: number) => {
    const updatedAllocation = {
      ...formData.budgetAllocation,
      [bucket]: value,
    };

    setFormData(prev => ({ ...prev, budgetAllocation: updatedAllocation }));
    setStrategy({ budgetAllocation: updatedAllocation });
  };

  const handleComplete = () => {
    if (!context.userId) {
      startSimulation('current-user'); // In real app, get from auth
    }
    completeStrategySession();
    router.push('/sim/q1');
  };

  const budgetTotal = Object.values(formData.budgetAllocation).reduce((total, value) => total + value, 0);
  const isBudgetValid = Math.abs(budgetTotal - 100) <= 1;

  const canComplete =
    formData.companyName.trim() &&
    formData.industry.trim() &&
    formData.companySize &&
    formData.marketLandscape &&
    formData.timeHorizon &&
    formData.targetAudience &&
    formData.brandPositioning &&
    formData.primaryChannels.length > 0 &&
    isBudgetValid;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Strategy Session
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Define your marketing strategy for the next 12 months. Your choices here will influence the tactics available and their effectiveness throughout the simulation.
        </p>
      </div>

      {/* Budget Overview */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Annual Marketing Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            ${context.totalBudget.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Allocated across 4 quarters for maximum impact
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Company Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Profile
            </CardTitle>
            <CardDescription>
              Establish the context for your marketing plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                placeholder="e.g. Aurora Labs"
                value={formData.companyName}
                onChange={event => {
                  setFormData(prev => ({ ...prev, companyName: event.target.value }));
                  setStrategy({ companyName: event.target.value });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                placeholder="e.g. Fintech, Consumer Goods"
                value={formData.industry}
                onChange={event => {
                  setFormData(prev => ({ ...prev, industry: event.target.value }));
                  setStrategy({ industry: event.target.value });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Company Size</Label>
              <div className="grid gap-2">
                {COMPANY_SIZE_OPTIONS.map(option => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={formData.companySize === option.value ? 'default' : 'outline'}
                    className="justify-start h-auto p-3"
                    onClick={() => handleCompanySizeSelect(option.value)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Landscape */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe2 className="h-5 w-5" />
              Market Landscape
            </CardTitle>
            <CardDescription>
              Understand your competitive environment and planning horizon.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Market Dynamics</Label>
              <div className="grid gap-2">
                {MARKET_LANDSCAPE_OPTIONS.map(option => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={formData.marketLandscape === option.value ? 'default' : 'outline'}
                    className="justify-start h-auto p-3"
                    onClick={() => handleMarketLandscapeSelect(option.value)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Time Horizon</Label>
              <div className="grid gap-2">
                {TIME_HORIZON_OPTIONS.map(option => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={formData.timeHorizon === option.value ? 'default' : 'outline'}
                    className="justify-start h-auto p-3"
                    onClick={() => handleTimeHorizonSelect(option.value)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      {/* Target Audience */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Target Audience
            </CardTitle>
            <CardDescription>
              Who is your primary customer segment?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              {AUDIENCE_OPTIONS.map((audience) => (
                <Button
                  key={audience}
                  variant={formData.targetAudience === audience ? "default" : "outline"}
                  className="justify-start h-auto p-3"
                  onClick={() => handleAudienceSelect(audience)}
                >
                  {audience}
                </Button>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="custom-audience">Custom Audience</Label>
              <div className="flex gap-2">
                <Input
                  id="custom-audience"
                  placeholder="Define your own target audience..."
                  value={formData.customAudience}
                  onChange={(e) => setFormData({ ...formData, customAudience: e.target.value })}
                />
                <Button onClick={handleCustomAudience} disabled={!formData.customAudience.trim()}>
                  Add
                </Button>
              </div>
            </div>

            {formData.targetAudience && (
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium">Selected:</p>
                <p className="text-primary font-semibold">{formData.targetAudience}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Brand Positioning */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Brand Positioning
            </CardTitle>
            <CardDescription>
              How do you want to be perceived in the market?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              {POSITIONING_OPTIONS.map((positioning) => (
                <Button
                  key={positioning}
                  variant={formData.brandPositioning === positioning ? "default" : "outline"}
                  className="justify-start h-auto p-3"
                  onClick={() => handlePositioningSelect(positioning)}
                >
                  {positioning}
                </Button>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="custom-positioning">Custom Positioning</Label>
              <div className="flex gap-2">
                <Input
                  id="custom-positioning"
                  placeholder="Define your own positioning..."
                  value={formData.customPositioning}
                  onChange={(e) => setFormData({ ...formData, customPositioning: e.target.value })}
                />
                <Button onClick={handleCustomPositioning} disabled={!formData.customPositioning.trim()}>
                  Add
                </Button>
              </div>
            </div>

            {formData.brandPositioning && (
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium">Selected:</p>
                <p className="text-primary font-semibold">{formData.brandPositioning}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Primary Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Primary Marketing Channels
          </CardTitle>
          <CardDescription>
            Select 2-4 channels that align with your strategy (minimum 1 required)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CHANNEL_OPTIONS.map((channel) => (
              <Button
                key={channel.id}
                variant={formData.primaryChannels.includes(channel.id) ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handleChannelToggle(channel.id)}
              >
                <span className="text-2xl">{channel.icon}</span>
                <span className="text-sm font-medium">{channel.name}</span>
              </Button>
            ))}
          </div>
          
          {formData.primaryChannels.length > 0 && (
            <div className="mt-4 p-3 bg-primary/10 rounded-lg">
              <p className="text-sm font-medium mb-2">Selected Channels:</p>
              <div className="flex flex-wrap gap-2">
                {formData.primaryChannels.map((channelId) => {
                  const channel = CHANNEL_OPTIONS.find(c => c.id === channelId);
                  return (
                    <Badge key={channelId} variant="secondary">
                      {channel?.icon} {channel?.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Allocation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Strategic Budget Mix
          </CardTitle>
          <CardDescription>
            Allocate your annual budget across core marketing priorities (must total 100%).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {BUDGET_BUCKETS.map(bucket => (
              <div key={bucket.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{bucket.label}</div>
                    <div className="text-xs text-muted-foreground">{bucket.description}</div>
                  </div>
                  <div className="text-sm font-semibold">{formData.budgetAllocation[bucket.key]}%</div>
                </div>
                <div className={`h-2 rounded-full bg-muted relative overflow-hidden`}>
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${bucket.accent}`}
                    style={{ width: `${formData.budgetAllocation[bucket.key]}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={formData.budgetAllocation[bucket.key]}
                  onChange={event => handleBudgetChange(bucket.key, Number(event.target.value))}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="font-medium">Total Allocation</div>
            <div className={isBudgetValid ? 'text-green-600' : 'text-red-600'}>{budgetTotal}%</div>
          </div>
          {!isBudgetValid && (
            <p className="text-sm text-red-600">
              Adjust the sliders so your allocation adds up to 100%.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center pt-8">
        <Button
          size="lg"
          onClick={handleComplete}
          disabled={!canComplete}
          className="px-8 py-3 text-lg"
        >
          Begin Q1 Planning
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {!canComplete && (
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>Please complete all sections to continue.</p>
          {!isBudgetValid && <p className="text-red-600">Budget allocation must equal 100%.</p>}
        </div>
      )}
    </div>
  );
}
