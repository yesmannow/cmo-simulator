'use client';

import React, { useState } from 'react';
import { HelpCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface TooltipProps {
  content: string;
  title?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, title, position = 'top', children, className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>

      {isVisible && (
        <div className={`absolute ${positionClasses[position]} z-50`}>
          <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 max-w-xs shadow-lg">
            {title && (
              <div className="font-semibold mb-1 text-blue-300">{title}</div>
            )}
            <div className="text-gray-200">{content}</div>
            <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
              position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
              position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
              'right-full top-1/2 -translate-y-1/2 -mr-1'
            }`} />
          </div>
        </div>
      )}
    </div>
  );
}

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  onComplete: () => void;
}

export function TutorialOverlay({ steps, currentStep, onNext, onPrevious, onClose, onComplete }: TutorialOverlayProps) {
  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      onNext();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {step.title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-gray-600 mb-6">
            {step.content}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <div className="flex space-x-2">
              {!isFirst && (
                <button
                  onClick={onPrevious}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
              )}

              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                {isLast ? 'Complete Tutorial' : 'Next'}
                {!isLast && <ChevronRight className="w-4 h-4 ml-1" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface HelpButtonProps {
  onClick: () => void;
  className?: string;
}

export function HelpButton({ onClick, className = '' }: HelpButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors ${className}`}
      title="Help & Tutorial"
    >
      <HelpCircle className="w-5 h-5" />
    </button>
  );
}
