'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { X, ArrowLeft, ArrowRight, Check, BookOpen, Lightbulb, AlertTriangle, GraduationCap } from 'lucide-react';
import { ComprehensiveTutorialStep } from '@/lib/comprehensiveTutorialData';
import { InlineDefinition } from '@/components/ui/DefinitionTooltip';

interface ComprehensiveTutorialProps {
  steps: ComprehensiveTutorialStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  showProgress?: boolean;
  skipable?: boolean;
}

export function ComprehensiveTutorial({
  steps,
  isOpen,
  onClose,
  onComplete,
  showProgress = true,
  skipable = true,
}: ComprehensiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0, visible: false });

  useEffect(() => {
    if (!isOpen || !steps[currentStep]) return;

    const findTarget = () => {
      if (steps[currentStep].target) {
        const element = document.querySelector(steps[currentStep].target) as HTMLElement;
        if (element) {
          setTargetElement(element);
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });

          setTimeout(() => {
            const rect = element.getBoundingClientRect();
            const scrollX = window.pageXOffset;
            const scrollY = window.pageYOffset;
            const position = steps[currentStep].position || 'bottom';

            let x = 0, y = 0;
            switch (position) {
              case 'top':
                x = rect.left + scrollX + rect.width / 2;
                y = rect.top + scrollY - 20;
                break;
              case 'bottom':
                x = rect.left + scrollX + rect.width / 2;
                y = rect.bottom + scrollY + 20;
                break;
              case 'left':
                x = rect.left + scrollX - 20;
                y = rect.top + scrollY + rect.height / 2;
                break;
              case 'right':
                x = rect.right + scrollX + 20;
                y = rect.top + scrollY + rect.height / 2;
                break;
              case 'center':
                x = window.innerWidth / 2;
                y = window.innerHeight / 2;
                break;
            }

            setTooltipPosition({ x, y, visible: true });

            // Highlight element
            element.style.position = 'relative';
            element.style.zIndex = '1001';
            element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 2px white';
            element.style.borderRadius = '8px';
            element.style.transition = 'all 0.3s ease';
          }, 500);
        }
      } else {
        // Center position for steps without targets
        setTooltipPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          visible: true,
        });
      }
    };

    const timeoutId = setTimeout(findTarget, 100);

    return () => {
      clearTimeout(timeoutId);
      if (targetElement) {
        targetElement.style.position = '';
        targetElement.style.zIndex = '';
        targetElement.style.boxShadow = '';
        targetElement.style.borderRadius = '';
        targetElement.style.transition = '';
      }
      setTooltipPosition(prev => ({ ...prev, visible: false }));
    };
  }, [currentStep, isOpen, steps, targetElement]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    onClose();
  };

  if (!isOpen || !steps[currentStep]) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
          onClick={skipable ? skipTour : undefined}
        />
      </AnimatePresence>

      {/* Tutorial Card */}
      <AnimatePresence mode="wait">
        {tooltipPosition.visible && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className={`fixed z-[1002] ${
              step.position === 'center' ? 'w-[600px] max-w-[90vw]' : 'w-[500px] max-w-[90vw]'
            }`}
            style={{
              left: step.position === 'center' ? '50%' : tooltipPosition.x,
              top: step.position === 'center' ? '50%' : tooltipPosition.y,
              transform: step.position === 'center'
                ? 'translate(-50%, -50%)'
                : step.position === 'top' || step.position === 'bottom'
                  ? 'translateX(-50%)'
                  : step.position === 'left'
                    ? 'translateX(-100%) translateY(-50%)'
                    : 'translateY(-50%)',
            }}
          >
            <Card className="shadow-2xl border-2 border-primary/30 bg-background">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    >
                      {currentStep + 1}
                    </motion.div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{step.title}</CardTitle>
                      {showProgress && (
                        <div className="text-xs text-muted-foreground">
                          Step {currentStep + 1} of {steps.length}
                        </div>
                      )}
                    </div>
                  </div>
                  {skipable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={skipTour}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Progress Bar */}
                {showProgress && (
                  <div className="mt-4">
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Main Content */}
                <div className="text-foreground leading-relaxed">
                  {typeof step.content === 'string' ? (
                    <p className="text-base">{step.content}</p>
                  ) : (
                    step.content
                  )}
                </div>

                {/* Detailed Explanation (Expandable) */}
                {step.detailedExplanation && (
                  <details className="bg-muted/50 rounded-lg p-3">
                    <summary className="cursor-pointer font-semibold text-sm text-primary hover:text-primary/80 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Learn More (Expert Explanation)
                    </summary>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {step.detailedExplanation}
                    </p>
                  </details>
                )}

                {/* Key Terms */}
                {step.keyTerms && step.keyTerms.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="font-semibold text-blue-900 text-sm mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Key Terms to Know:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.keyTerms.map((termId) => (
                        <InlineDefinition key={termId} termId={termId}>
                          <Badge variant="outline" className="text-xs cursor-pointer hover:bg-blue-100">
                            {termId.replace(/-/g, ' ')}
                          </Badge>
                        </InlineDefinition>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                {step.tips && step.tips.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="font-semibold text-green-900 text-sm mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Pro Tips:
                    </p>
                    <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                      {step.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Common Mistakes */}
                {step.commonMistakes && step.commonMistakes.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="font-semibold text-yellow-900 text-sm mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Common Mistakes to Avoid:
                    </p>
                    <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                      {step.commonMistakes.map((mistake, index) => (
                        <li key={index}>{mistake}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Expert Insight */}
                {step.expertInsight && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="font-semibold text-purple-900 text-sm mb-2">
                      💡 Expert Insight:
                    </p>
                    <p className="text-sm text-purple-800 leading-relaxed">
                      {step.expertInsight}
                    </p>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t">
                  {/* Step Indicators */}
                  <div className="flex gap-1.5">
                    {steps.map((_, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`h-2 rounded-full transition-all ${
                          index === currentStep
                            ? 'bg-primary w-8'
                            : index < currentStep
                              ? 'bg-primary/50 w-2'
                              : 'bg-muted w-2'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    {!isFirst && (
                      <Button variant="outline" size="sm" onClick={prevStep}>
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back
                      </Button>
                    )}
                    <Button size="sm" onClick={nextStep}>
                      {isLast ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Complete Tutorial
                        </>
                      ) : (
                        <>
                          Next
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

