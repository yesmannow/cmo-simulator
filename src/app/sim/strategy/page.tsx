"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSimulation } from '@/hooks/useSimulation';
import { ArrowRight, Target, Users, Megaphone, DollarSign } from 'lucide-react';
import { TutorialOnboardingPopup } from '@/components/onboarding/TutorialOnboardingPopup';
import { ImmersiveLayout } from '@/components/simulation/ImmersiveLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
  const [showTutorialPopup, setShowTutorialPopup] = useState(false);

  const [formData, setFormData] = useState({
    targetAudience: context.strategy.targetAudience || '',
    brandPositioning: context.strategy.brandPositioning || '',
    primaryChannels: context.strategy.primaryChannels || [],
    customAudience: '',
    customPositioning: '',
  });

  // Show tutorial popup on first visit
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenTutorial = localStorage.getItem('cmo-sim-tutorial-offered');
      if (!hasSeenTutorial) {
        setShowTutorialPopup(true);
        localStorage.setItem('cmo-sim-tutorial-offered', 'true');
      }
    }
  }, []);

  const handleChannelToggle = (channelId: string) => {
    const updatedChannels = formData.primaryChannels.includes(channelId)
      ? formData.primaryChannels.filter((id: string) => id !== channelId)
      : [...formData.primaryChannels, channelId];

    setFormData({ ...formData, primaryChannels: updatedChannels });
    setStrategy({ primaryChannels: updatedChannels });
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

  const handleComplete = () => {
    startSimulation();
    completeStrategySession();
    router.push('/sim/q1');
  };

  const canComplete = formData.targetAudience && formData.brandPositioning && formData.primaryChannels.length > 0;

  return (
    <ImmersiveLayout
      title="Build Your Company"
      subtitle="Define your strategic foundation for the next 12 months. Your choices here will influence the tactics available and their effectiveness throughout the simulation."
      quarter="Strategy Session"
    >
      <TutorialOnboardingPopup
        isOpen={showTutorialPopup}
        onStartTutorial={() => {
          setShowTutorialPopup(false);
          // Tutorial will handle its own display
        }}
        onSkip={() => setShowTutorialPopup(false)}
        onClose={() => setShowTutorialPopup(false)}
      />

      <div className="max-w-5xl mx-auto space-y-10 pb-20">
        {/* Budget Overview */}
        <GlassCard className="border-primary/20 bg-primary/5">
          <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-primary/20 border border-primary/30">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Annual Marketing Budget</h3>
                <p className="text-blue-200/60 text-sm font-medium">Allocated across 4 quarters for maximum impact</p>
              </div>
            </div>
            <div className="text-5xl font-black bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              ${context.totalBudget.toLocaleString()}
            </div>
          </div>
        </GlassCard>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Target Audience */}
          <GlassCard className="h-full">
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <Users className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">Target Audience</h3>
                </div>
                <p className="text-blue-200/60 text-sm font-medium">
                  Who is your primary customer segment?
                </p>
              </div>

              <div className="grid gap-3">
                {AUDIENCE_OPTIONS.map((audience) => (
                  <Button
                    key={audience}
                    variant={formData.targetAudience === audience ? "default" : "outline"}
                    className={cn(
                      "justify-start h-auto p-4 transition-all duration-300",
                      formData.targetAudience === audience 
                        ? "bg-primary text-white scale-[1.02]" 
                        : "bg-white/5 border-white/10 text-blue-100 hover:bg-white/10"
                    )}
                    onClick={() => handleAudienceSelect(audience)}
                  >
                    {audience}
                  </Button>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <Label htmlFor="custom-audience" className="text-white font-semibold">Custom Audience</Label>
                <div className="flex gap-2">
                  <Input
                    id="custom-audience"
                    placeholder="Define your own..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-blue-200/30"
                    value={formData.customAudience}
                    onChange={(e) => setFormData({ ...formData, customAudience: e.target.value })}
                  />
                  <Button 
                    onClick={handleCustomAudience} 
                    disabled={!formData.customAudience.trim()}
                    className="bg-white/10 hover:bg-white/20 text-white"
                  >
                    Add
                  </Button>
                </div>
              </div>

              {formData.targetAudience && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-primary/20 rounded-xl border border-primary/30"
                >
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Selected Focus</p>
                  <p className="text-white font-bold text-lg">{formData.targetAudience}</p>
                </motion.div>
              )}
            </div>
          </GlassCard>

          {/* Brand Positioning */}
          <GlassCard className="h-full">
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <Target className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">Brand Positioning</h3>
                </div>
                <p className="text-blue-200/60 text-sm font-medium">
                  How do you want to be perceived in the market?
                </p>
              </div>

              <div className="grid gap-3">
                {POSITIONING_OPTIONS.map((positioning) => (
                  <Button
                    key={positioning}
                    variant={formData.brandPositioning === positioning ? "default" : "outline"}
                    className={cn(
                      "justify-start h-auto p-4 transition-all duration-300",
                      formData.brandPositioning === positioning 
                        ? "bg-primary text-white scale-[1.02]" 
                        : "bg-white/5 border-white/10 text-blue-100 hover:bg-white/10"
                    )}
                    onClick={() => handlePositioningSelect(positioning)}
                  >
                    {positioning}
                  </Button>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <Label htmlFor="custom-positioning" className="text-white font-semibold">Custom Positioning</Label>
                <div className="flex gap-2">
                  <Input
                    id="custom-positioning"
                    placeholder="Define your own..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-blue-200/30"
                    value={formData.customPositioning}
                    onChange={(e) => setFormData({ ...formData, customPositioning: e.target.value })}
                  />
                  <Button 
                    onClick={handleCustomPositioning} 
                    disabled={!formData.customPositioning.trim()}
                    className="bg-white/10 hover:bg-white/20 text-white"
                  >
                    Add
                  </Button>
                </div>
              </div>

              {formData.brandPositioning && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-primary/20 rounded-xl border border-primary/30"
                >
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Market Stance</p>
                  <p className="text-white font-bold text-lg">{formData.brandPositioning}</p>
                </motion.div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Primary Channels */}
        <GlassCard>
          <div className="p-8 space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white">
                <Megaphone className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">Primary Marketing Channels</h3>
              </div>
              <p className="text-blue-200/60 text-sm font-medium">
                Select 2-4 channels that align with your strategy (minimum 1 required)
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {CHANNEL_OPTIONS.map((channel) => (
                <Button
                  key={channel.id}
                  variant={formData.primaryChannels.includes(channel.id) ? "default" : "outline"}
                  className={cn(
                    "h-auto p-6 flex flex-col items-center gap-3 transition-all duration-300",
                    formData.primaryChannels.includes(channel.id)
                      ? "bg-primary text-white scale-105"
                      : "bg-white/5 border-white/10 text-blue-100 hover:bg-white/10"
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
                className="mt-6 p-6 bg-white/5 rounded-2xl border border-white/10"
              >
                <p className="text-xs font-bold text-blue-200/60 uppercase tracking-wider mb-4">Tactical Matrix Channels</p>
                <div className="flex flex-wrap gap-3">
                  {formData.primaryChannels.map((channelId: string) => {
                    const channel = CHANNEL_OPTIONS.find(c => c.id === channelId);
                    return (
                      <Badge key={channelId} variant="secondary" className="bg-primary/20 text-primary border-primary/30 px-3 py-1 text-sm font-bold">
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
                ? "bg-primary hover:bg-primary/80 text-white shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(59,130,246,0.7)] scale-110" 
                : "bg-white/5 text-blue-200/20 border-white/5"
            )}
          >
            Launch Q1 Operations
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
          
          {!canComplete && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-blue-200/40 font-medium italic"
            >
              Strategize your foundation to unlock the command center
            </motion.p>
          )}
        </div>
      </div>
    </ImmersiveLayout>
  );
}
