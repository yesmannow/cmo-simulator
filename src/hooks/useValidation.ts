/**
 * React Hooks for Validation
 * Provides easy-to-use validation hooks for forms
 */

import { useState, useCallback, useMemo } from 'react';
import { FormValidator, ValidationResult, SimulationValidators } from '@/lib/validation';
import { SimulatorError } from '@/lib/errors';

export interface FieldError {
  field: string;
  message: string;
  suggestions?: string[];
}

export interface UseValidationReturn {
  errors: Map<string, FieldError>;
  hasErrors: boolean;
  validate: (data: Record<string, any>) => boolean;
  validateField: (fieldName: string, value: any, context?: any) => boolean;
  clearErrors: () => void;
  clearFieldError: (fieldName: string) => void;
  getFieldError: (fieldName: string) => FieldError | undefined;
  setCustomError: (fieldName: string, message: string) => void;
}

/**
 * Hook for form validation
 */
export function useValidation(validator: FormValidator): UseValidationReturn {
  const [errors, setErrors] = useState<Map<string, FieldError>>(new Map());

  const hasErrors = useMemo(() => errors.size > 0, [errors]);

  const convertToFieldErrors = useCallback((validationErrors: SimulatorError[]): Map<string, FieldError> => {
    const fieldErrors = new Map<string, FieldError>();

    validationErrors.forEach(error => {
      const field = error.context.field || 'general';
      fieldErrors.set(field, {
        field,
        message: error.context.userMessage,
        suggestions: error.context.suggestions
      });
    });

    return fieldErrors;
  }, []);

  const validate = useCallback((data: Record<string, any>): boolean => {
    const result: ValidationResult = validator.validate(data);
    
    if (!result.valid) {
      setErrors(convertToFieldErrors(result.errors));
      return false;
    }

    setErrors(new Map());
    return true;
  }, [validator, convertToFieldErrors]);

  const validateField = useCallback((
    fieldName: string,
    value: any,
    context?: any
  ): boolean => {
    const result: ValidationResult = validator.validateField(fieldName, value, context);
    
    if (!result.valid) {
      setErrors(prev => {
        const newErrors = new Map(prev);
        const fieldErrors = convertToFieldErrors(result.errors);
        fieldErrors.forEach((error, field) => {
          newErrors.set(field, error);
        });
        return newErrors;
      });
      return false;
    }

    // Clear error for this field if validation passed
    setErrors(prev => {
      const newErrors = new Map(prev);
      newErrors.delete(fieldName);
      return newErrors;
    });

    return true;
  }, [validator, convertToFieldErrors]);

  const clearErrors = useCallback(() => {
    setErrors(new Map());
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = new Map(prev);
      newErrors.delete(fieldName);
      return newErrors;
    });
  }, []);

  const getFieldError = useCallback((fieldName: string): FieldError | undefined => {
    return errors.get(fieldName);
  }, [errors]);

  const setCustomError = useCallback((fieldName: string, message: string) => {
    setErrors(prev => {
      const newErrors = new Map(prev);
      newErrors.set(fieldName, { field: fieldName, message });
      return newErrors;
    });
  }, []);

  return {
    errors,
    hasErrors,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
    getFieldError,
    setCustomError
  };
}

/**
 * Hook for budget allocation validation
 */
export function useBudgetValidation() {
  const [error, setError] = useState<string | null>(null);

  const validateAllocation = useCallback((allocation: {
    brandAwareness: number;
    leadGeneration: number;
    conversionOptimization: number;
  }): boolean => {
    const result = SimulationValidators.budgetAllocation(allocation);
    
    if (!result.valid && result.errors.length > 0) {
      setError(result.errors[0].context.userMessage);
      return false;
    }

    setError(null);
    return true;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    validateAllocation,
    clearError
  };
}

/**
 * Hook for channel spend validation
 */
export function useChannelSpendValidation(totalBudget: number) {
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  const validateSpend = useCallback((
    channelSpends: Record<string, number>
  ): boolean => {
    const result = SimulationValidators.channelSpend(channelSpends, totalBudget);
    
    if (!result.valid) {
      const newErrors = new Map<string, string>();
      result.errors.forEach(error => {
        const field = error.context.field || 'total';
        newErrors.set(field, error.context.userMessage);
      });
      setErrors(newErrors);
      return false;
    }

    setErrors(new Map());
    return true;
  }, [totalBudget]);

  const getChannelError = useCallback((channel: string): string | undefined => {
    return errors.get(channel);
  }, [errors]);

  const clearErrors = useCallback(() => {
    setErrors(new Map());
  }, []);

  return {
    errors,
    validateSpend,
    getChannelError,
    clearErrors,
    hasErrors: errors.size > 0
  };
}

/**
 * Hook for real-time field validation
 */
export function useFieldValidation<T>(
  validator: (value: T) => ValidationResult,
  debounceMs: number = 300
) {
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const validate = useCallback((value: T) => {
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setIsValidating(true);

    // Debounce validation
    const newTimeoutId = setTimeout(() => {
      const result = validator(value);
      
      if (!result.valid && result.errors.length > 0) {
        setError(result.errors[0].context.userMessage);
      } else {
        setError(null);
      }

      setIsValidating(false);
    }, debounceMs);

    setTimeoutId(newTimeoutId);
  }, [validator, debounceMs, timeoutId]);

  const clearError = useCallback(() => {
    setError(null);
    setIsValidating(false);
  }, []);

  return {
    error,
    isValidating,
    validate,
    clearError
  };
}
