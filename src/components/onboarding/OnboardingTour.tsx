'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowLeft, ArrowRight, Play, RotateCcw } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'hover' | 'none';
}

interface OnboardingTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function OnboardingTour({ steps, isOpen, onClose, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isOpen || !steps[currentStep]) return;

    const findTarget = () => {
      const element = document.querySelector(steps[currentStep].target) as HTMLElement;
      if (element) {
        setTargetElement(element);
        
        // Calculate tooltip position
        const rect = element.getBoundingClientRect();
        const scrollX = window.pageXOffset;
        const scrollY = window.pageYOffset;
        
        let x = 0, y = 0;
        
        switch (steps[currentStep].position) {
          case 'top':
            x = rect.left + scrollX + rect.width / 2;
            y = rect.top + scrollY - 10;
            break;
          case 'bottom':
            x = rect.left + scrollX + rect.width / 2;
            y = rect.bottom + scrollY + 10;
            break;
          case 'left':
            x = rect.left + scrollX - 10;
            y = rect.top + scrollY + rect.height / 2;
            break;
          case 'right':
            x = rect.right + scrollX + 10;
            y = rect.top + scrollY + rect.height / 2;
            break;
        }
        
        setTooltipPosition({ x, y });
        
        // Add highlight to target element
        element.style.position = 'relative';
        element.style.zIndex = '1001';
        element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 2px white';
        element.style.borderRadius = '8px';
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
      }
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

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-[1000]"
        onClick={skipTour}
      />

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed z-[1002] max-w-sm"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: step.position === 'top' || step.position === 'bottom' 
              ? 'translateX(-50%)' 
              : step.position === 'left' 
                ? 'translateX(-100%) translateY(-50%)'
                : 'translateY(-50%)'
          }}
        >
          <Card className="shadow-2xl border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {currentStep + 1}
                  </div>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={skipTour}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {step.content}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                
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
                        <Play className="h-4 w-4 mr-1" />
                        Start
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
          <div
            className={`absolute w-3 h-3 bg-white border-l border-t border-primary/20 transform rotate-45 ${
              step.position === 'top' 
                ? 'bottom-[-6px] left-1/2 -translate-x-1/2' 
                : step.position === 'bottom'
                  ? 'top-[-6px] left-1/2 -translate-x-1/2 rotate-[225deg]'
                  : step.position === 'left'
                    ? 'right-[-6px] top-1/2 -translate-y-1/2 rotate-[135deg]'
                    : 'left-[-6px] top-1/2 -translate-y-1/2 rotate-[315deg]'
            }`}
          />
        </motion.div>
      </AnimatePresence>
    </>
  );
}

// Hook for managing tour state
export function useOnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('cmo-sim-tour-completed');
    if (completed) {
      setHasCompletedTour(true);
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
    localStorage.setItem('cmo-sim-tour-completed', 'true');
  };

  const resetTour = () => {
    setHasCompletedTour(false);
    localStorage.removeItem('cmo-sim-tour-completed');
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
