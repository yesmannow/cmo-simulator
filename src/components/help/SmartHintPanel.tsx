'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X, Sparkles, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getBestHint, generateSmartHints, formatHintForDisplay, type HintContext } from '@/lib/smartHints';
import { SimulationContext } from '@/lib/simMachine';

interface SmartHintPanelProps {
  context: SimulationContext;
  currentQuarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  tacticsSelected: number;
  className?: string;
}

export function SmartHintPanel({
  context,
  currentQuarter,
  tacticsSelected,
  className = '',
}: SmartHintPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [hints, setHints] = useState<any[]>([]);

  useEffect(() => {
    const hintContext: HintContext = {
      currentQuarter,
      ytdRevenue: Object.values(context.quarters).reduce((sum, q) => sum + (q.results.revenue || 0), 0),
      remainingBudget: context.remainingBudget,
      currentMarketShare: context.kpis.marketShare,
      tacticsSelected,
      previousQuarterRevenue: currentQuarter !== 'Q1'
        ? context.quarters[currentQuarter === 'Q2' ? 'Q1' : currentQuarter === 'Q3' ? 'Q2' : 'Q3'].results.revenue
        : undefined,
      isFirstQuarter: currentQuarter === 'Q1',
    };

    const generatedHints = generateSmartHints(hintContext, context);
    setHints(generatedHints);
    setCurrentHintIndex(0);
  }, [context, currentQuarter, tacticsSelected]);

  if (hints.length === 0) return null;

  const currentHint = hints[currentHintIndex];
  const formattedHint = formatHintForDisplay(currentHint);

  return (
    <div className={className}>
      {/* Hint Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Lightbulb className="h-4 w-4" />
        Get a Tip
        {hints.length > 1 && (
          <Badge variant="secondary" className="ml-1">
            {hints.length}
          </Badge>
        )}
      </Button>

      {/* Hint Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-4 right-4 w-[400px] max-w-[90vw] z-50"
            >
              <Card className="shadow-2xl border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Lightbulb className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{formattedHint.title}</CardTitle>
                        <p className="text-xs text-muted-foreground">Hintful guidance, not answers</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Hint Message */}
                  <div className="bg-white/80 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm leading-relaxed text-foreground">
                      {formattedHint.message}
                    </p>
                  </div>

                  {/* Real World Wisdom */}
                  {formattedHint.wisdom && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-blue-900 mb-1">Real-World Wisdom:</p>
                          <p className="text-xs text-blue-800 leading-relaxed">
                            {formattedHint.wisdom}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  {hints.length > 1 && (
                    <div className="flex items-center justify-between pt-3 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentHintIndex((prev) => (prev > 0 ? prev - 1 : hints.length - 1))}
                        disabled={hints.length === 1}
                      >
                        <ChevronUp className="h-4 w-4" />
                        Previous
                      </Button>
                      <div className="text-xs text-muted-foreground">
                        {currentHintIndex + 1} of {hints.length}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentHintIndex((prev) => (prev < hints.length - 1 ? prev + 1 : 0))}
                        disabled={hints.length === 1}
                      >
                        Next
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="flex items-center justify-center">
                    <Badge variant="outline" className="text-xs">
                      {currentHint.category} • {currentHint.cleverness} hint
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

