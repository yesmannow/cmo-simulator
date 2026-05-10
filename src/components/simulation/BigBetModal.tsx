'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, AlertTriangle, Target, Award, BarChart3, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SIM_CARD_SURFACE, SIM_MODAL_DIALOG_BASE } from '@/lib/simDialogStyles';
import { BigBetOption } from '@/lib/talentMarket';

interface BigBetModalProps {
  bigBets: BigBetOption[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (bigBet: BigBetOption) => void;
  availableBudget: number;
  currentKPIs: {
    revenue: number;
    marketShare: number;
    customerSatisfaction: number;
    brandAwareness: number;
  };
}

function getRiskPresentation(risk: number) {
  if (risk <= 0.3) {
    return {
      label: 'Lower risk',
      className: 'border-emerald-200 bg-emerald-50 font-medium text-emerald-900',
    };
  }
  if (risk <= 0.6) {
    return {
      label: 'Moderate risk',
      className: 'border-amber-200 bg-amber-50 font-medium text-amber-950',
    };
  }
  return {
    label: 'Higher risk',
    className: 'border-rose-200 bg-rose-50 font-medium text-rose-900',
  };
}

export function BigBetModal({
  bigBets,
  isOpen,
  onClose,
  onSelect,
  availableBudget,
  currentKPIs,
}: BigBetModalProps) {
  const [selectedBet, setSelectedBet] = useState<BigBetOption | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [outcome, setOutcome] = useState<'success' | 'failure' | null>(null);

  const handleSelectBet = (bet: BigBetOption) => {
    setSelectedBet(bet);

    const successProbability = Math.max(
      0.2,
      Math.min(
        0.8,
        (currentKPIs.revenue / 1000000) * 0.1 +
          (currentKPIs.marketShare / 100) * 0.3 +
          (1 - bet.risk) * 0.4,
      ),
    );

    const isSuccess = Math.random() < successProbability;
    setOutcome(isSuccess ? 'success' : 'failure');
    setShowOutcome(true);
  };

  const handleConfirmBet = () => {
    if (selectedBet) {
      onSelect(selectedBet);
      onClose();
      setSelectedBet(null);
      setShowOutcome(false);
      setOutcome(null);
    }
  };

  const canAfford = (bet: BigBetOption) => {
    return availableBudget >= bet.cost;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(SIM_MODAL_DIALOG_BASE, 'max-w-6xl', '[&_.text-muted-foreground]:text-slate-600')}
      >
        <div className="shrink-0 border-b border-slate-200 px-6 pb-4 pt-6">
          <DialogHeader className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-800">
                <Flag className="size-5" aria-hidden />
              </div>
              <div className="min-w-0 space-y-1.5">
                <DialogTitle className="text-xl font-semibold tracking-tight text-slate-950">
                  Q4 executive commitment — big bet
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-slate-600">
                  Allocate a major investment with explicit upside and downside. Model shows implied success rate from
                  current performance and initiative risk.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <AnimatePresence mode="wait">
            {!showOutcome ? (
              <motion.div
                key="selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <div className="grid gap-3">
                  {bigBets.map((bet, index) => {
                    const risk = getRiskPresentation(bet.risk);
                    return (
                      <motion.div
                        key={bet.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card
                          role="button"
                          tabIndex={0}
                          className={cn(
                            SIM_CARD_SURFACE,
                            'cursor-pointer gap-0 py-0 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2',
                            selectedBet?.id === bet.id
                              ? 'ring-2 ring-slate-900 ring-offset-2 ring-offset-white'
                              : 'hover:shadow-md',
                            !canAfford(bet) && 'opacity-55',
                          )}
                          onClick={() => canAfford(bet) && handleSelectBet(bet)}
                          onKeyDown={(e) => {
                            if (!canAfford(bet)) return;
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleSelectBet(bet);
                            }
                          }}
                        >
                          <CardHeader className="border-b border-slate-100 px-4 py-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0 space-y-1">
                                <CardTitle className="text-lg font-semibold text-slate-950">{bet.name}</CardTitle>
                                <p className="text-sm leading-relaxed text-slate-600">{bet.description}</p>
                              </div>
                              <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                                <Badge variant="outline" className={risk.className}>
                                  {risk.label}
                                </Badge>
                                <div className="text-right">
                                  <div className="text-lg font-semibold tabular-nums text-slate-950">
                                    ${bet.cost.toLocaleString()}
                                  </div>
                                  <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                    Investment
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="space-y-4 px-4 py-4">
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-center">
                                <div className="flex items-center justify-center gap-1 text-sm font-semibold text-emerald-700">
                                  <TrendingUp className="size-4" aria-hidden />
                                  <span>+{(bet.potentialImpact.revenue / 1000).toFixed(0)}K</span>
                                </div>
                                <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                  Revenue
                                </div>
                              </div>
                              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-center">
                                <div className="flex items-center justify-center gap-1 text-sm font-semibold text-slate-900">
                                  <BarChart3 className="size-4 text-slate-600" aria-hidden />
                                  <span>+{bet.potentialImpact.marketShare}%</span>
                                </div>
                                <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                  Market share
                                </div>
                              </div>
                              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-center">
                                <div className="flex items-center justify-center gap-1 text-sm font-semibold text-slate-900">
                                  <Award className="size-4 text-slate-600" aria-hidden />
                                  <span>+{bet.potentialImpact.brandAwareness}%</span>
                                </div>
                                <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                  Brand
                                </div>
                              </div>
                              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-center">
                                <div className="flex items-center justify-center gap-1 text-sm font-semibold text-slate-900">
                                  <Target className="size-4 text-slate-600" aria-hidden />
                                  <span>+{bet.potentialImpact.customerSatisfaction}%</span>
                                </div>
                                <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                  Satisfaction
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm font-medium text-slate-700">
                                <span>Implied success rate</span>
                                <span className="tabular-nums text-slate-950">{Math.round((1 - bet.risk) * 100)}%</span>
                              </div>
                              <Progress
                                value={(1 - bet.risk) * 100}
                                className="h-2 bg-slate-200"
                                indicatorClassName="bg-slate-800"
                              />
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                              <span className="font-semibold text-slate-900">Strategy: </span>
                              {bet.strategy}
                            </div>

                            {!canAfford(bet) && (
                              <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-center text-sm font-medium text-rose-900">
                                Insufficient budget (need ${(bet.cost - availableBudget).toLocaleString()} more)
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="outcome"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="space-y-4 text-center">
                  <div
                    className={cn(
                      'mx-auto flex size-20 items-center justify-center rounded-full border',
                      outcome === 'success'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : 'border-rose-200 bg-rose-50 text-rose-800',
                    )}
                  >
                    {outcome === 'success' ? (
                      <Award className="size-10" aria-hidden />
                    ) : (
                      <AlertTriangle className="size-10" aria-hidden />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">
                      {outcome === 'success' ? 'Initiative landed' : 'Initiative underperformed'}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {outcome === 'success'
                        ? `Your investment in ${selectedBet?.name} is tracking ahead of the conservative case.`
                        : `Your investment in ${selectedBet?.name} did not hit plan in the window modeled here.`}
                    </p>
                  </div>
                </div>

                {selectedBet && (
                  <Card className={cn(SIM_CARD_SURFACE, 'gap-0 py-0')}>
                    <CardHeader className="border-b border-slate-100 px-4 py-3">
                      <CardTitle className="text-base font-semibold text-slate-950">Impact summary</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 px-4 py-4">
                      <div className="space-y-1">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Revenue</div>
                        <div
                          className={cn(
                            'text-lg font-semibold tabular-nums',
                            outcome === 'success' ? 'text-emerald-700' : 'text-red-700',
                          )}
                        >
                          {`${outcome === 'success' ? '+' : '-'}$${Math.round(selectedBet.potentialImpact.revenue * (outcome === 'success' ? 1 : 0.3)).toLocaleString()}`}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Market share</div>
                        <div
                          className={cn(
                            'text-lg font-semibold tabular-nums',
                            outcome === 'success' ? 'text-emerald-700' : 'text-red-700',
                          )}
                        >
                          {outcome === 'success' ? '+' : '-'}
                          {Math.round(
                            selectedBet.potentialImpact.marketShare * (outcome === 'success' ? 1 : 0.3),
                          )}
                          %
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Brand awareness
                        </div>
                        <div
                          className={cn(
                            'text-lg font-semibold tabular-nums',
                            outcome === 'success' ? 'text-emerald-700' : 'text-red-700',
                          )}
                        >
                          {outcome === 'success' ? '+' : '-'}
                          {Math.round(
                            selectedBet.potentialImpact.brandAwareness * (outcome === 'success' ? 1 : 0.3),
                          )}
                          %
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Customer satisfaction
                        </div>
                        <div
                          className={cn(
                            'text-lg font-semibold tabular-nums',
                            outcome === 'success' ? 'text-emerald-700' : 'text-red-700',
                          )}
                        >
                          {outcome === 'success' ? '+' : '-'}
                          {Math.round(
                            selectedBet.potentialImpact.customerSatisfaction *
                              (outcome === 'success' ? 1 : 0.3),
                          )}
                          %
                        </div>
                      </div>
                      <div className="col-span-2 border-t border-slate-100 pt-3 text-sm text-slate-600">
                        {outcome === 'success'
                          ? 'Narrative: capital and focus shifted results in-market; maintain execution tempo into next planning cycle.'
                          : 'Narrative: external friction or execution gaps reduced realized lift; capture lessons for the next commitment.'}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-slate-200 bg-slate-50/80 px-6 py-4">
          {!showOutcome ? (
            <>
              <Button type="button" variant="outline" className="border-slate-300 bg-white" onClick={onClose}>
                Pass on big bet
              </Button>
              {selectedBet && (
                <Button
                  type="button"
                  onClick={handleConfirmBet}
                  disabled={!canAfford(selectedBet)}
                  className="bg-slate-950 text-white hover:bg-slate-800"
                >
                  Authorize {selectedBet.name} — ${selectedBet.cost.toLocaleString()}
                </Button>
              )}
            </>
          ) : (
            <Button type="button" onClick={handleConfirmBet} className="bg-slate-950 text-white hover:bg-slate-800">
              Continue to results
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
