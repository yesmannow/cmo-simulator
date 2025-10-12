'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, AlertTriangle, Target, Award, BarChart3, Sparkles } from 'lucide-react';
import { BigBetOption, BigBetOutcome, calculateBigBetOutcome } from '@/lib/talentMarket';
import { SimulationContext } from '@/lib/simMachine';

interface BigBetModalProps {
  bigBets: BigBetOption[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (bigBet: BigBetOption, outcome: BigBetOutcome) => void;
  availableBudget: number;
  currentKPIs: {
    revenue: number;
    marketShare: number;
    customerSatisfaction: number;
    brandAwareness: number;
  };
  simulationContext: SimulationContext;
  hasStrongTeam: boolean;
}

export function BigBetModal({
  bigBets,
  isOpen,
  onClose,
  onSelect,
  availableBudget,
  currentKPIs,
  simulationContext,
  hasStrongTeam,
}: BigBetModalProps) {
  const [selectedBet, setSelectedBet] = useState<BigBetOption | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [outcomeState, setOutcomeState] = useState<'success' | 'failure' | null>(null);
  const [computedOutcome, setComputedOutcome] = useState<BigBetOutcome | null>(null);

  const handleClose = () => {
    setSelectedBet(null);
    setShowOutcome(false);
    setOutcomeState(null);
    setComputedOutcome(null);
    onClose();
  };

  const handleSelectBet = (bet: BigBetOption) => {
    const outcome = calculateBigBetOutcome(bet, simulationContext, hasStrongTeam);
    setSelectedBet(bet);
    setComputedOutcome(outcome);
    setOutcomeState(outcome.success ? 'success' : 'failure');
    setShowOutcome(true);
  };

  const handleConfirmBet = () => {
    if (selectedBet && computedOutcome) {
      onSelect(selectedBet, computedOutcome);
      handleClose();
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 0.3) return 'text-green-600 bg-green-50';
    if (risk <= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRiskLabel = (risk: number) => {
    if (risk <= 0.3) return 'Low Risk';
    if (risk <= 0.6) return 'Medium Risk';
    return 'High Risk';
  };

  const canAfford = (bet: BigBetOption) => availableBudget >= bet.cost;

  const getEstimatedSuccess = (bet: BigBetOption) => {
    const revenueFactor = Math.min(1, Math.max(0, currentKPIs.revenue / 1000000));
    const marketFactor = Math.min(1, Math.max(0, currentKPIs.marketShare / 30));
    const satisfactionFactor = Math.min(1, Math.max(0, currentKPIs.customerSatisfaction / 100));
    const baseChance = 1 - bet.risk;
    const probability =
      baseChance * 0.5 + marketFactor * 0.2 + revenueFactor * 0.2 + satisfactionFactor * 0.1;
    return Math.max(0.2, Math.min(0.9, probability));
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-purple-600" />
            Q4 Big Bet Decision
          </DialogTitle>
          <p className="text-muted-foreground">
            Make a strategic investment that could transform your business. Choose wisely - the stakes are high.
          </p>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!showOutcome ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 mt-6"
            >
              <div className="grid gap-4">
                {bigBets.map((bet, index) => (
                  <motion.div
                    key={bet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedBet?.id === bet.id
                          ? 'ring-2 ring-purple-500 shadow-lg'
                          : 'hover:shadow-md'
                      } ${!canAfford(bet) ? 'opacity-60' : ''}`}
                      onClick={() => canAfford(bet) && handleSelectBet(bet)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-xl">{bet.name}</CardTitle>
                            <p className="text-muted-foreground">{bet.description}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getRiskColor(bet.risk)}>{getRiskLabel(bet.risk)}</Badge>
                            <div className="text-right">
                              <div className="text-lg font-bold">${bet.cost.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground">Investment</div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-green-600">
                              <TrendingUp className="h-4 w-4" />
                              <span className="font-medium">+{(bet.potentialImpact.revenue / 1000).toFixed(0)}K</span>
                            </div>
                            <div className="text-xs text-muted-foreground">Revenue</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-blue-600">
                              <BarChart3 className="h-4 w-4" />
                              <span className="font-medium">+{bet.potentialImpact.marketShare}%</span>
                            </div>
                            <div className="text-xs text-muted-foreground">Market Share</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-purple-600">
                              <Award className="h-4 w-4" />
                              <span className="font-medium">+{bet.potentialImpact.brandAwareness}%</span>
                            </div>
                            <div className="text-xs text-muted-foreground">Brand Awareness</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-orange-600">
                              <Target className="h-4 w-4" />
                              <span className="font-medium">+{bet.potentialImpact.customerSatisfaction}%</span>
                            </div>
                            <div className="text-xs text-muted-foreground">Satisfaction</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Success Probability</span>
                            <span>{Math.round(getEstimatedSuccess(bet) * 100)}%</span>
                          </div>
                          <Progress value={getEstimatedSuccess(bet) * 100} className="h-2" />
                        </div>

                        <div className="text-sm text-muted-foreground">
                          <strong>Strategy:</strong> {bet.strategy}
                        </div>

                        {!canAfford(bet) && (
                          <div className="text-sm text-red-600 font-medium">
                            Insufficient budget (Need ${(bet.cost - availableBudget).toLocaleString()} more)
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button variant="outline" onClick={handleClose}>
                  Skip Big Bet
                </Button>
                {selectedBet && (
                  <Button
                    onClick={handleConfirmBet}
                    disabled={!canAfford(selectedBet) || !computedOutcome}
                    className="px-6 bg-purple-600 hover:bg-purple-700"
                  >
                    Commit to {selectedBet.name} - ${selectedBet.cost.toLocaleString()}
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="outcome"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6 mt-6"
            >
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                    outcomeState === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}
                >
                  {outcomeState === 'success' ? <Award className="h-12 w-12" /> : <AlertTriangle className="h-12 w-12" />}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <h3 className="text-2xl font-bold">
                    {outcomeState === 'success' ? 'Big Bet Pays Off!' : 'Big Bet Falls Short'}
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    {outcomeState === 'success'
                      ? `Your investment in ${selectedBet?.name} has exceeded expectations!`
                      : `Your investment in ${selectedBet?.name} didn't deliver the expected results.`}
                  </p>
                </motion.div>
              </div>

              {selectedBet && computedOutcome && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Impact Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Revenue Impact</div>
                          <div
                            className={`text-lg font-bold ${
                              computedOutcome.actualImpact.revenue >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {computedOutcome.actualImpact.revenue >= 0 ? '+' : '-'}$
                            {Math.abs(computedOutcome.actualImpact.revenue).toLocaleString()}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Market Share</div>
                          <div
                            className={`text-lg font-bold ${
                              computedOutcome.actualImpact.marketShare >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {computedOutcome.actualImpact.marketShare >= 0 ? '+' : '-'}
                            {Math.abs(computedOutcome.actualImpact.marketShare)}%
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Brand Awareness</div>
                          <div
                            className={`text-lg font-bold ${
                              computedOutcome.actualImpact.brandAwareness >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {computedOutcome.actualImpact.brandAwareness >= 0 ? '+' : '-'}
                            {Math.abs(computedOutcome.actualImpact.brandAwareness)}%
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Customer Satisfaction</div>
                          <div
                            className={`text-lg font-bold ${
                              computedOutcome.actualImpact.customerSatisfaction >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {computedOutcome.actualImpact.customerSatisfaction >= 0 ? '+' : '-'}
                            {Math.abs(computedOutcome.actualImpact.customerSatisfaction)}%
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          {outcomeState === 'success'
                            ? 'This strategic investment has positioned your company for accelerated growth and market leadership.'
                            : 'While this investment did not pay off as expected, the learnings will inform future strategic decisions.'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <div className="flex justify-center pt-6 border-t">
                <Button onClick={handleConfirmBet} className="px-8" size="lg" disabled={!computedOutcome}>
                  Continue to Results
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
