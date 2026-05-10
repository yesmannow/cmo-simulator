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
import { cn } from '@/lib/utils';
import { SIM_CARD_SURFACE, SIM_MODAL_DIALOG_BASE } from '@/lib/simDialogStyles';
import type { EnhancedWildcardEvent } from '@/lib/enhancedWildcards';

interface WildcardModalProps {
  wildcard: EnhancedWildcardEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onChoose: (choiceId: string) => void;
}

function getTypePresentation(type: EnhancedWildcardEvent['type']) {
  switch (type) {
    case 'crisis':
      return {
        Icon: AlertTriangle,
        iconBox: 'border border-rose-200 bg-rose-50 text-rose-900',
        typeBadge: 'border-rose-200 bg-rose-50 font-medium capitalize text-rose-950',
      };
    case 'opportunity':
      return {
        Icon: Zap,
        iconBox: 'border border-emerald-200 bg-emerald-50 text-emerald-900',
        typeBadge: 'border-emerald-200 bg-emerald-50 font-medium capitalize text-emerald-950',
      };
    case 'market_shift':
      return {
        Icon: TrendingDown,
        iconBox: 'border border-amber-200 bg-amber-50 text-amber-950',
        typeBadge: 'border-amber-200 bg-amber-50 font-medium capitalize text-amber-950',
      };
    case 'competitor_action':
      return {
        Icon: Users,
        iconBox: 'border border-slate-200 bg-slate-100 text-slate-900',
        typeBadge: 'border-slate-200 bg-slate-100 font-medium capitalize text-slate-900',
      };
    default:
      return {
        Icon: AlertTriangle,
        iconBox: 'border border-slate-200 bg-slate-50 text-slate-800',
        typeBadge: 'border-slate-200 bg-slate-50 font-medium capitalize text-slate-800',
      };
  }
}

const rarityStyles: Record<
  NonNullable<EnhancedWildcardEvent['rarity']>,
  { label: string; className: string; Icon: typeof CircleDot }
> = {
  common: {
    label: 'Common',
    className: 'border border-slate-200 bg-slate-50 text-slate-800',
    Icon: CircleDot,
  },
  uncommon: {
    label: 'Uncommon',
    className: 'border border-emerald-200 bg-emerald-50 text-emerald-900',
    Icon: Star,
  },
  rare: {
    label: 'Rare',
    className: 'border border-slate-300 bg-slate-100 text-slate-900',
    Icon: Gem,
  },
  legendary: {
    label: 'Legendary',
    className: 'border border-amber-200 bg-amber-50 text-amber-950',
    Icon: Crown,
  },
};

function formatSignedDollars(value: number) {
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}$${Math.abs(value).toLocaleString()}`;
}

function formatSignedPercent(value: number) {
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}${Math.abs(value)}%`;
}

function ImpactCell({
  label,
  value,
  formatter,
}: {
  label: string;
  value: number;
  formatter: (v: number) => string;
}) {
  return (
    <div className="text-center">
      <div className={cn('font-semibold tabular-nums', value >= 0 ? 'text-emerald-700' : 'text-red-700')}>
        {formatter(value)}
      </div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

export function WildcardModal({ wildcard, isOpen, onClose, onChoose }: WildcardModalProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  if (!wildcard) return null;

  const handleChoose = () => {
    if (selectedChoice) {
      onChoose(selectedChoice);
      setSelectedChoice(null);
      onClose();
    }
  };

  const { Icon: TypeIcon, iconBox, typeBadge } = getTypePresentation(wildcard.type);
  const rarityConfig = wildcard.rarity ? rarityStyles[wildcard.rarity] : null;
  const RarityIcon = rarityConfig?.Icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(SIM_MODAL_DIALOG_BASE, 'max-w-4xl', '[&_.text-muted-foreground]:text-slate-600')}
      >
        <div className="shrink-0 border-b border-slate-200 px-6 pb-4 pt-6">
          <DialogHeader className="space-y-3 text-left">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-lg', iconBox)}>
                  <TypeIcon className="size-5" aria-hidden />
                </div>
                <div className="min-w-0 space-y-2">
                  <DialogTitle className="text-xl font-semibold tracking-tight text-slate-950">
                    {wildcard.title}
                  </DialogTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={typeBadge}>
                      {wildcard.type.replace('_', ' ')}
                    </Badge>
                    {rarityConfig && RarityIcon && (
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
                          rarityConfig.className,
                        )}
                      >
                        <RarityIcon className="size-3" aria-hidden />
                        {rarityConfig.label} event
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <DialogDescription className="text-base leading-relaxed text-slate-600">
              {wildcard.description}
            </DialogDescription>
            {wildcard.teamMoraleDescription && (
              <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
                <HeartPulse className="mt-0.5 size-4 shrink-0 text-rose-600" aria-hidden />
                <span>
                  <span className="font-semibold text-slate-950">Team pulse:</span>{' '}
                  {wildcard.teamMoraleDescription}
                </span>
              </div>
            )}
          </DialogHeader>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Choose your response</h3>

          <div className="grid gap-3">
            {wildcard.choices.map((choice) => {
              const moraleChange = wildcard.moraleImpact
                ? wildcard.moraleImpact.base + (wildcard.moraleImpact.choiceModifiers?.[choice.id] ?? 0)
                : 0;
              const brandEquityChange = wildcard.brandEquityImpact
                ? wildcard.brandEquityImpact.base + (wildcard.brandEquityImpact.choiceModifiers?.[choice.id] ?? 0)
                : 0;

              const isSelected = selectedChoice === choice.id;

              return (
                <Card
                  key={choice.id}
                  role="button"
                  tabIndex={0}
                  className={cn(
                    SIM_CARD_SURFACE,
                    'cursor-pointer gap-0 py-0 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2',
                    isSelected ? 'ring-2 ring-slate-900 ring-offset-2 ring-offset-white' : 'hover:shadow-md',
                  )}
                  onClick={() => setSelectedChoice(choice.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedChoice(choice.id);
                    }
                  }}
                >
                  <CardHeader className="border-b border-slate-100 px-4 py-4">
                    <CardTitle className="flex flex-col gap-3 text-base font-semibold text-slate-950 sm:flex-row sm:items-start sm:justify-between">
                      <span className="min-w-0">{choice.title}</span>
                      <div className="flex shrink-0 flex-wrap items-center gap-4 text-sm text-slate-700">
                        {choice.cost > 0 && (
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="size-4 text-slate-500" aria-hidden />
                            <span className="font-medium">${choice.cost.toLocaleString()}</span>
                          </div>
                        )}
                        {choice.timeRequired > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="size-4 text-slate-500" aria-hidden />
                            <span className="font-medium">{choice.timeRequired}h</span>
                          </div>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 px-4 py-4 text-slate-950">
                    <p className="text-sm leading-relaxed text-slate-600">{choice.description}</p>

                    <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-[repeat(auto-fit,minmax(112px,1fr))]">
                      <ImpactCell
                        label="Revenue"
                        value={choice.impact.revenue}
                        formatter={(v) => formatSignedDollars(v)}
                      />
                      <ImpactCell
                        label="Profit"
                        value={choice.impact.profit}
                        formatter={(v) => formatSignedDollars(v)}
                      />
                      <ImpactCell
                        label="Market share"
                        value={choice.impact.marketShare}
                        formatter={(v) => formatSignedPercent(v)}
                      />
                      <ImpactCell
                        label="Satisfaction"
                        value={choice.impact.customerSatisfaction}
                        formatter={(v) => formatSignedPercent(v)}
                      />
                      <ImpactCell
                        label="Awareness"
                        value={choice.impact.brandAwareness}
                        formatter={(v) => formatSignedPercent(v)}
                      />
                      {wildcard.moraleImpact && (
                        <div className="text-center">
                          <div
                            className={cn(
                              'font-semibold tabular-nums',
                              moraleChange >= 0 ? 'text-emerald-700' : 'text-red-700',
                            )}
                          >
                            {moraleChange >= 0 ? '+' : ''}
                            {moraleChange}
                          </div>
                          <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                            <HeartPulse className="size-3" aria-hidden />
                            Morale
                          </div>
                        </div>
                      )}
                      {wildcard.brandEquityImpact && (
                        <div className="text-center">
                          <div
                            className={cn(
                              'font-semibold tabular-nums',
                              brandEquityChange >= 0 ? 'text-emerald-700' : 'text-red-700',
                            )}
                          >
                            {brandEquityChange >= 0 ? '+' : ''}
                            {brandEquityChange}
                          </div>
                          <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                            <Sparkles className="size-3" aria-hidden />
                            Brand eq.
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-slate-200 bg-slate-50/80 px-6 py-4">
          <Button type="button" variant="outline" className="border-slate-300 bg-white" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleChoose}
            disabled={!selectedChoice}
            className="bg-slate-950 text-white hover:bg-slate-800"
          >
            Confirm choice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
