"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect, type ChangeEvent } from 'react';
import { useSimulation } from '@/hooks/useSimulation';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Compass,
  DollarSign,
  Globe,
  Handshake,
  Megaphone,
  Newspaper,
  Presentation,
  Target,
  Tv,
  Users,
} from 'lucide-react';

import { ImmersiveLayout } from '@/components/simulation/ImmersiveLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type StrategyFormData = {
  targetAudience: string;
  brandPositioning: string;
  primaryChannels: string[];
  customAudience: string;
  customPositioning: string;
};

const CHANNEL_OPTIONS = [
  { id: 'digital', name: 'Digital Marketing', icon: Globe, description: 'Paid digital, web acquisition, and measurable demand capture.' },
  { id: 'social', name: 'Social Media', icon: Megaphone, description: 'Organic and paid social momentum, community, and visibility.' },
  { id: 'traditional', name: 'Traditional Media', icon: Tv, description: 'Broadcast and broad-reach brand investment.' },
  { id: 'content', name: 'Content Marketing', icon: Newspaper, description: 'Thought leadership, education, and long-tail audience capture.' },
  { id: 'events', name: 'Events & Experiences', icon: Presentation, description: 'Field marketing, launches, activations, and in-person demand.' },
  { id: 'partnerships', name: 'Partnerships', icon: Handshake, description: 'Distribution leverage, channel relationships, and co-marketing.' },
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
  const { guidedDemo, targetAudience, brandPositioning, primaryChannels } = context.strategy;

  const [formData, setFormData] = useState<StrategyFormData>({
    targetAudience: targetAudience || '',
    brandPositioning: brandPositioning || '',
    primaryChannels: primaryChannels || [],
    customAudience: '',
    customPositioning: '',
  });

  const handleChannelToggle = (channelId: string) => {
    const nextChannels = formData.primaryChannels.includes(channelId)
      ? formData.primaryChannels.filter((id) => id !== channelId)
      : [...formData.primaryChannels, channelId];

    setFormData((current) => ({ ...current, primaryChannels: nextChannels }));
    setStrategy({ primaryChannels: nextChannels });
  };

  const handleAudienceSelect = (audience: string) => {
    setFormData((current) => ({ ...current, targetAudience: audience }));
    setStrategy({ targetAudience: audience });
  };

  const handlePositioningSelect = (positioning: string) => {
    setFormData((current) => ({ ...current, brandPositioning: positioning }));
    setStrategy({ brandPositioning: positioning });
  };

  const handleCustomAudience = () => {
    if (formData.customAudience.trim()) {
      handleAudienceSelect(formData.customAudience.trim());
      setFormData((current) => ({ ...current, customAudience: '' }));
    }
  };

  const handleCustomPositioning = () => {
    if (formData.customPositioning.trim()) {
      handlePositioningSelect(formData.customPositioning.trim());
      setFormData((current) => ({ ...current, customPositioning: '' }));
    }
  };

  const handleComplete = () => {
    startSimulation();
    completeStrategySession();
    router.push('/sim/q1');
  };

  const canComplete = Boolean(
    formData.targetAudience && formData.brandPositioning && formData.primaryChannels.length > 0
  );

  useEffect(() => {
    const guidedDemoReady =
      guidedDemo && targetAudience && brandPositioning && (primaryChannels?.length || 0) > 0;

    if (guidedDemoReady) {
      startSimulation();
      completeStrategySession();
      router.replace('/sim/q1');
    }
  }, [brandPositioning, completeStrategySession, guidedDemo, primaryChannels?.length, router, startSimulation, targetAudience]);

  return (
    <ImmersiveLayout
      title="Strategic Foundation"
      subtitle="Define the audience, market stance, and go-to-market channels that the operating console will carry into Q1."
      quarter="Strategy Session"
    >
      <div className="max-w-5xl mx-auto space-y-10 pb-20">
        <GlassCard className="border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#172554_42%,#1e293b_100%)] text-white">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-100">
                  <Compass className="h-3.5 w-3.5" />
                  Strategy Controls
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight">Translate setup into an operating plan</h2>
                <p className="mt-3 text-sm leading-6 text-slate-200">
                  This page now acts like a control layer rather than a playful chooser. Once complete, the simulator launches the CRM-style Q1 console with your audience, positioning, and channels preloaded.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:w-[340px]">
                <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">What unlocks next</div>
                  <div className="mt-2 text-sm font-semibold text-white">Q1 Operating Console</div>
                  <div className="mt-1 text-sm text-slate-200">Budget, readiness, and tactical deployment open after strategy is complete.</div>
                </div>
                <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">Required</div>
                  <div className="mt-2 text-sm font-semibold text-white">Audience, Positioning, Channels</div>
                  <div className="mt-1 text-sm text-slate-200">These fields shape which tactics make sense in the simulation.</div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Budget Overview */}
        <GlassCard className="border-slate-200 bg-white">
          <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-slate-50 border border-slate-200">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-950 mb-1">Annual Marketing Budget</h3>
                <p className="text-slate-600 text-sm">Allocated across 4 quarters for maximum impact</p>
              </div>
            </div>
            <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-950">
              ${context.totalBudget.toLocaleString()}
            </div>
          </div>
        </GlassCard>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Target Audience */}
          <GlassCard className="h-full">
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-950">
                  <Users className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Target Audience</h3>
                  <InfoTooltip iconOnly content="Your audience focus informs tactic selection, market response, and how efficiently different channels convert." />
                </div>
                <p className="text-slate-600 text-sm">
                  Who is your primary customer segment?
                </p>
              </div>

              <div className="grid gap-3">
                {AUDIENCE_OPTIONS.map((audience) => (
                  <Button
                    key={audience}
                    variant="outline"
                    className={cn(
                      "justify-start h-auto p-4 transition-all duration-300",
                      formData.targetAudience === audience 
                        ? "border-slate-900 bg-slate-900 text-white shadow-sm" 
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    )}
                    onClick={() => handleAudienceSelect(audience)}
                  >
                    {audience}
                  </Button>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200">
                <Label htmlFor="custom-audience" className="text-slate-900 font-semibold">Custom Audience</Label>
                <div className="flex gap-2">
                  <Input
                    id="custom-audience"
                    placeholder="Define your own..."
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                    value={formData.customAudience}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData((current) => ({ ...current, customAudience: e.target.value }))
                    }
                  />
                  <Button 
                    onClick={handleCustomAudience} 
                    disabled={!formData.customAudience.trim()}
                    className="bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    Add
                  </Button>
                </div>
              </div>

              {formData.targetAudience && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                >
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Selected Focus</p>
                  <p className="text-slate-950 font-semibold text-lg">{formData.targetAudience}</p>
                </motion.div>
              )}
            </div>
          </GlassCard>

          {/* Brand Positioning */}
          <GlassCard className="h-full">
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-950">
                  <Target className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Brand Positioning</h3>
                  <InfoTooltip iconOnly content="Positioning frames your market stance and influences how brand and demand investments are interpreted later in the simulation." />
                </div>
                <p className="text-slate-600 text-sm">
                  How do you want to be perceived in the market?
                </p>
              </div>

              <div className="grid gap-3">
                {POSITIONING_OPTIONS.map((positioning) => (
                  <Button
                    key={positioning}
                    variant="outline"
                    className={cn(
                      "justify-start h-auto p-4 transition-all duration-300",
                      formData.brandPositioning === positioning 
                        ? "border-slate-900 bg-slate-900 text-white shadow-sm" 
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    )}
                    onClick={() => handlePositioningSelect(positioning)}
                  >
                    {positioning}
                  </Button>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200">
                <Label htmlFor="custom-positioning" className="text-slate-900 font-semibold">Custom Positioning</Label>
                <div className="flex gap-2">
                  <Input
                    id="custom-positioning"
                    placeholder="Define your own..."
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                    value={formData.customPositioning}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData((current) => ({ ...current, customPositioning: e.target.value }))
                    }
                  />
                  <Button 
                    onClick={handleCustomPositioning} 
                    disabled={!formData.customPositioning.trim()}
                    className="bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    Add
                  </Button>
                </div>
              </div>

              {formData.brandPositioning && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                >
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Market Stance</p>
                  <p className="text-slate-950 font-semibold text-lg">{formData.brandPositioning}</p>
                </motion.div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Primary Channels */}
        <GlassCard>
          <div className="p-8 space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-950">
                <Megaphone className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Primary Marketing Channels</h3>
                <InfoTooltip iconOnly content="These are the operating lanes you expect to emphasize first. They provide the starting logic for tactical planning in Q1." />
              </div>
              <p className="text-slate-600 text-sm">
                Select 2-4 channels that align with your strategy (minimum 1 required)
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {CHANNEL_OPTIONS.map((channel) => (
                <Button
                  key={channel.id}
                  variant="outline"
                  className={cn(
                    "h-auto p-4 flex flex-col items-start gap-3 text-left transition-all duration-300",
                    formData.primaryChannels.includes(channel.id)
                      ? "border-slate-900 bg-slate-900 text-white shadow-sm scale-[1.02]"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  )}
                  onClick={() => handleChannelToggle(channel.id)}
                >
                  <ChannelIcon icon={channel.icon} selected={formData.primaryChannels.includes(channel.id)} />
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.18em]">{channel.name}</div>
                    <div className={cn("mt-2 text-xs leading-5", formData.primaryChannels.includes(channel.id) ? "text-slate-200" : "text-slate-500")}>
                      {channel.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            {formData.primaryChannels.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-200"
              >
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4">Tactical Matrix Channels</p>
                <div className="flex flex-wrap gap-3">
                  {formData.primaryChannels.map((channelId: string) => {
                    const channel = CHANNEL_OPTIONS.find(c => c.id === channelId);
                    return (
                      <Badge key={channelId} variant="secondary" className="bg-white text-slate-700 border-slate-200 px-3 py-1 text-sm font-semibold">
                        {channel?.name}
                      </Badge>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </GlassCard>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-4 pt-10">
          <Button
            size="lg"
            onClick={handleComplete}
            disabled={!canComplete}
            className={cn(
              "px-12 py-8 text-xl font-black rounded-full transition-all duration-500",
              canComplete 
                ? "bg-slate-900 hover:bg-slate-800 text-white shadow-sm" 
                : "bg-slate-200 text-slate-400"
            )}
          >
            Launch Q1 Operations
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
          
          {!canComplete && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-500 font-medium italic"
            >
              Strategize your foundation to unlock the command center
            </motion.p>
          )}
        </div>
      </div>
    </ImmersiveLayout>
  );
}

function ChannelIcon({ icon: Icon, selected }: { icon: LucideIcon; selected: boolean }) {
  return (
    <div className={cn("rounded-xl border p-2.5", selected ? "border-white/10 bg-white/10" : "border-slate-200 bg-slate-50")}>
      <Icon className="h-5 w-5" />
    </div>
  );
}
