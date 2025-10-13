'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  Zap,
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  HeartPulse,
  Sparkles,
  CircleDot,
  Star,
  Gem,
  Crown,
} from 'lucide-react';
import type { EnhancedWildcardEvent } from '@/lib/enhancedWildcards';

interface WildcardModalProps {
  wildcard: EnhancedWildcardEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onChoose: (choiceId: string) => void;
}

export function WildcardModal({ wildcard, isOpen, onClose, onChoose }: WildcardModalProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  if (!wildcard) return null;

  const getTypeIcon = (type: EnhancedWildcardEvent['type']) => {
    switch (type) {
      case 'crisis': return AlertTriangle;
      case 'opportunity': return Zap;
      case 'market_shift': return TrendingDown;
      case 'competitor_action': return Users;
      default: return AlertTriangle;
    }
  };

  const getTypeColor = (type: EnhancedWildcardEvent['type']) => {
    switch (type) {
      case 'crisis': return 'text-red-600 bg-red-100';
      case 'opportunity': return 'text-green-600 bg-green-100';
      case 'market_shift': return 'text-orange-600 bg-orange-100';
      case 'competitor_action': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const rarityStyles: Record<NonNullable<EnhancedWildcardEvent['rarity']>, { label: string; className: string; Icon: typeof CircleDot }> = {
    common: { label: 'Common', className: 'bg-slate-200 text-slate-900', Icon: CircleDot },
    uncommon: { label: 'Uncommon', className: 'bg-emerald-200 text-emerald-900', Icon: Star },
    rare: { label: 'Rare', className: 'bg-indigo-200 text-indigo-900', Icon: Gem },
    legendary: { label: 'Legendary', className: 'bg-amber-200 text-amber-900', Icon: Crown },
  };

  const rarityConfig = wildcard.rarity ? rarityStyles[wildcard.rarity] : null;
  const RarityIcon = rarityConfig?.Icon;

  const handleChoose = () => {
    if (selectedChoice) {
      onChoose(selectedChoice);
      setSelectedChoice(null);
      onClose();
    }
  };

  const TypeIcon = getTypeIcon(wildcard.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getTypeColor(wildcard.type)}`}>
                <TypeIcon className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl">{wildcard.title}</DialogTitle>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-medium">
                  <Badge className={getTypeColor(wildcard.type).replace('text-', 'bg-').replace('bg-', 'text-')}>
                    {wildcard.type.replace('_', ' ')}
                  </Badge>
                  {rarityConfig && RarityIcon && (
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${rarityConfig.className}`}>
                      <RarityIcon className="h-3 w-3" />
                      {rarityConfig.label} Event
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogDescription className="text-base leading-relaxed">
            {wildcard.description}
          </DialogDescription>
          {wildcard.teamMoraleDescription && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-border/60 bg-muted/40 p-3 text-sm">
              <HeartPulse className="mt-0.5 h-4 w-4 text-rose-500" />
              <span>
                <span className="font-semibold text-foreground">Team Pulse:</span> {wildcard.teamMoraleDescription}
              </span>
            </div>
          )}
        </DialogHeader>

        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Choose Your Response:</h3>

          <div className="grid gap-4">
            {wildcard.choices.map((choice) => {
              const moraleChange = wildcard.moraleImpact
                ? wildcard.moraleImpact.base + (wildcard.moraleImpact.choiceModifiers?.[choice.id] ?? 0)
                : 0;
              const brandEquityChange = wildcard.brandEquityImpact
                ? wildcard.brandEquityImpact.base + (wildcard.brandEquityImpact.choiceModifiers?.[choice.id] ?? 0)
                : 0;

              return (
                <Card
                  key={choice.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedChoice === choice.id
                      ? 'ring-2 ring-primary shadow-lg'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedChoice(choice.id)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span>{choice.title}</span>
                    <div className="flex items-center gap-4 text-sm">
                      {choice.cost > 0 && (
                        <div className="flex items-center gap-1 text-red-600">
                          <DollarSign className="h-4 w-4" />
                          ${choice.cost.toLocaleString()}
                        </div>
                      )}
                      {choice.timeRequired > 0 && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Clock className="h-4 w-4" />
                          {choice.timeRequired}h
                        </div>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{choice.description}</p>
                  
                  {/* Impact Preview */}
                  <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 text-sm">
                    <div className="text-center">
                      <div className={`font-semibold ${
                        choice.impact.revenue >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {choice.impact.revenue >= 0 ? '+' : ''}${choice.impact.revenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Revenue</div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`font-semibold ${
                        choice.impact.profit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {choice.impact.profit >= 0 ? '+' : ''}${choice.impact.profit.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Profit</div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`font-semibold ${
                        choice.impact.marketShare >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {choice.impact.marketShare >= 0 ? '+' : ''}{choice.impact.marketShare}%
                      </div>
                      <div className="text-xs text-muted-foreground">Market Share</div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`font-semibold ${
                        choice.impact.customerSatisfaction >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {choice.impact.customerSatisfaction >= 0 ? '+' : ''}{choice.impact.customerSatisfaction}%
                      </div>
                      <div className="text-xs text-muted-foreground">Satisfaction</div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`font-semibold ${
                        choice.impact.brandAwareness >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {choice.impact.brandAwareness >= 0 ? '+' : ''}{choice.impact.brandAwareness}%
                      </div>
                      <div className="text-xs text-muted-foreground">Awareness</div>
                    </div>
                    {wildcard.moraleImpact && (
                      <div className="text-center">
                        <div className={`font-semibold ${
                          moraleChange >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {moraleChange >= 0 ? '+' : ''}{moraleChange}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                          <HeartPulse className="h-3 w-3" />
                          Morale
                        </div>
                      </div>
                    )}
                    {wildcard.brandEquityImpact && (
                      <div className="text-center">
                        <div className={`font-semibold ${
                          brandEquityChange >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {brandEquityChange >= 0 ? '+' : ''}{brandEquityChange}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Brand Eq.
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleChoose}
              disabled={!selectedChoice}
            >
              Confirm Choice
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
