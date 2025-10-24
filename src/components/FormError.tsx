'use client';

/**
 * Form Error Display Components
 * Beautiful, accessible error messages for forms
 */

import { AlertCircle, AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface FormErrorProps {
  message?: string;
  suggestions?: string[];
  className?: string;
  variant?: 'error' | 'warning' | 'info' | 'success';
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function FormError({
  message,
  suggestions,
  className,
  variant = 'error',
  dismissible = false,
  onDismiss
}: FormErrorProps) {
  if (!message) return null;

  const icons = {
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    success: CheckCircle2
  };

  const colors = {
    error: 'text-destructive',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    success: 'text-green-600'
  };

  const bgColors = {
    error: 'bg-destructive/10',
    warning: 'bg-yellow-50 dark:bg-yellow-950/20',
    info: 'bg-blue-50 dark:bg-blue-950/20',
    success: 'bg-green-50 dark:bg-green-950/20'
  };

  const Icon = icons[variant];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          'rounded-lg p-4 flex gap-3',
          bgColors[variant],
          className
        )}
      >
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', colors[variant])} />
        
        <div className="flex-1 space-y-2">
          <p className={cn('text-sm font-medium', colors[variant])}>
            {message}
          </p>
          
          {suggestions && suggestions.length > 0 && (
            <ul className="space-y-1 text-sm text-muted-foreground">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className={cn(
              'flex-shrink-0 rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/5 transition-colors',
              colors[variant]
            )}
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Inline field error (appears below input)
 */
export interface FieldErrorProps {
  message?: string;
  className?: string;
}

export function FieldError({ message, className }: FieldErrorProps) {
  if (!message) return null;

  return (
    <motion.p
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={cn('text-sm text-destructive mt-1.5 flex items-center gap-1.5', className)}
    >
      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
      <span>{message}</span>
    </motion.p>
  );
}

/**
 * Form-level error summary (shows all errors at once)
 */
export interface ErrorSummaryProps {
  errors: Map<string, { field: string; message: string }>;
  title?: string;
  className?: string;
}

export function ErrorSummary({ errors, title = 'Please fix the following errors:', className }: ErrorSummaryProps) {
  if (errors.size === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-lg border-2 border-destructive/50 bg-destructive/10 p-4',
        className
      )}
    >
      <div className="flex gap-3">
        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-destructive mb-2">{title}</h3>
          <ul className="space-y-1.5">
            {Array.from(errors.values()).map((error, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-destructive mt-0.5">•</span>
                <span>
                  <span className="font-medium">{error.field}:</span>{' '}
                  {error.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Toast-style error notification
 */
export interface ErrorToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function ErrorToast({ message, onClose, duration = 5000 }: ErrorToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed bottom-4 right-4 z-50 max-w-md"
    >
      <div className="rounded-lg border-2 border-destructive/50 bg-background shadow-lg p-4 flex gap-3">
        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
        <p className="text-sm flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

// Add React import for useEffect
import React from 'react';
