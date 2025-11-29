'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

export interface TourStep {
  id: string;
  title: string;
  content: string | React.ReactNode;
  target: string; // CSS selector
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'none';
  highlight?: boolean;
}

interface EnhancedTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  showProgress?: boolean;
  skipable?: boolean;
}

export function EnhancedTour({
  steps,
  isOpen,
  onClose,
  onComplete,
  showProgress = true,
  skipable = true,
}: EnhancedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0, visible: false });

  const { ref: targetRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  useEffect(() => {
    if (!isOpen || !steps[currentStep]) return;

    const findTarget = () => {
      const element = document.querySelector(steps[currentStep].target) as HTMLElement;
      if (element) {
        setTargetElement(element);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Wait for scroll to complete
        setTimeout(() => {
          const rect = element.getBoundingClientRect();
          const scrollX = window.pageXOffset;
          const scrollY = window.pageYOffset;

          let x = 0, y = 0;
          const position = steps[currentStep].position || 'bottom';

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

          // Add highlight
          if (steps[currentStep].highlight !== false) {
            element.style.position = 'relative';
            element.style.zIndex = '1001';
            element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 2px white';
            element.style.borderRadius = '8px';
            element.style.transition = 'all 0.3s ease';
          }
        }, 500);
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

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        {tooltipPosition.visible && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed z-[1002] max-w-sm"
            style={{
              left: step.position === 'center' ? '50%' : tooltipPosition.x,
              top: step.position === 'center' ? '50%' : tooltipPosition.y,
              transform: step.position === 'center'
                ? 'translate(-50%, -50%)'
                : step.position === 'top' || step.position === 'bottom'
                  ? 'translateX(-50%)'
                  : step.position === 'left'
                    ? 'translateX(-100%) translateY(-50%)'
                    : 'translateY(-50%)'
            }}
          >
            <Card className="shadow-2xl border-2 border-primary/30 bg-background/95 backdrop-blur">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm"
                    >
                      {currentStep + 1}
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                      {showProgress && (
                        <div className="text-xs text-muted-foreground mt-1">
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
                  <div className="mb-4">
                    <Progress value={progress} className="h-1.5" />
                  </div>
                )}

                {/* Content */}
                <div className="text-muted-foreground mb-6 leading-relaxed">
                  {typeof step.content === 'string' ? (
                    <p>{step.content}</p>
                  ) : (
                    step.content
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  {/* Step Indicators */}
                  <div className="flex gap-1.5">
                    {steps.map((_, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentStep
                            ? 'bg-primary w-6'
                            : index < currentStep
                              ? 'bg-primary/50'
                              : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    {currentStep > 0 && (
                      <Button variant="outline" size="sm" onClick={prevStep}>
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back
                      </Button>
                    )}

                    <Button size="sm" onClick={nextStep}>
                      {currentStep === steps.length - 1 ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Complete
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

            {/* Arrow pointer */}
            {step.position !== 'center' && (
              <div
                className={`absolute w-3 h-3 bg-background border-l border-t border-primary/30 transform rotate-45 ${
                  step.position === 'top'
                    ? 'bottom-[-6px] left-1/2 -translate-x-1/2'
                    : step.position === 'bottom'
                      ? 'top-[-6px] left-1/2 -translate-x-1/2 rotate-[225deg]'
                      : step.position === 'left'
                        ? 'right-[-6px] top-1/2 -translate-y-1/2 rotate-[135deg]'
                        : 'left-[-6px] top-1/2 -translate-y-1/2 rotate-[315deg]'
                }`}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Hook for managing tour state
export function useEnhancedTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem('cmo-sim-tour-completed');
      if (completed) {
        setHasCompletedTour(true);
      }
    }
  }, []);

  const startTour = () => {
    setIsOpen(true);
  };

  const closeTour = () => {
    setIsOpen(false);
  };

  const completeTour = () => {
    setIsOpen(false);
    setHasCompletedTour(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cmo-sim-tour-completed', 'true');
    }
  };

  const resetTour = () => {
    setHasCompletedTour(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cmo-sim-tour-completed');
    }
  };

  return {
    isOpen,
    hasCompletedTour,
    startTour,
    closeTour,
    completeTour,
    resetTour,
  };
}

