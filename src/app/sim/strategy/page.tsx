"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect, type ChangeEvent } from 'react';
import { useSimulation } from '@/hooks/useSimulation';
import { ArrowRight, Target, Users, Megaphone, DollarSign } from 'lucide-react';

import { ImmersiveLayout } from '@/components/simulation/ImmersiveLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  const { guidedDemo, targetAudience, brandPositioning, primaryChannels } = context.strategy;

  const [formData, setFormData] = useState<StrategyFormData>({
    targetAudience: targetAudience || '',
    brandPositioning: brandPositioning || '',
    primaryChannels: primaryChannels || [],
    customAudience: '',
    customPositioning: '',
  });

  const handleChannelToggle = (channelId: string) => {
    setFormData((current) => {
      const nextChannels = current.primaryChannels.includes(channelId)
        ? current.primaryChannels.filter((id) => id !== channelId)
        : [...current.primaryChannels, channelId];
      setStrategy({ primaryChannels: nextChannels });
      return { ...current, primaryChannels: nextChannels };
    });
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
      title="Build Your Company"
      subtitle="Define your strategic foundation for the next 12 months. Your choices here will influence the tactics available and their effectiveness throughout the simulation."
      quarter="Strategy Session"
    >
      <div className="max-w-5xl mx-auto space-y-10 pb-20">
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
                    "h-auto p-6 flex flex-col items-center gap-3 transition-all duration-300",
                    formData.primaryChannels.includes(channel.id)
                      ? "border-slate-900 bg-slate-900 text-white shadow-sm scale-[1.02]"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  )}
                  onClick={() => handleChannelToggle(channel.id)}
                >
                  <span className="text-4xl">{channel.icon}</span>
                  <span className="text-xs font-black uppercase tracking-widest">{channel.name}</span>
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
                        {channel?.icon} {channel?.name}
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
