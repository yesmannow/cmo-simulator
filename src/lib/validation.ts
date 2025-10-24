/**
 * Validation System
 * Type-safe validation with detailed error messages
 */

import { SimulatorError, ErrorCode, createValidationError, createBudgetError } from './errors';

export interface ValidationResult {
  valid: boolean;
  errors: SimulatorError[];
  warnings?: string[];
}

export interface ValidationRule<T = any> {
  validate: (value: T, context?: any) => ValidationResult;
  message?: string;
}

/**
 * Common Validators
 */
export class Validators {
  /**
   * Required field validator
   */
  static required(fieldName: string): ValidationRule {
    return {
      validate: (value: any) => {
        const isEmpty = value === null || 
                       value === undefined || 
                       value === '' || 
                       (Array.isArray(value) && value.length === 0);

        if (isEmpty) {
          return {
            valid: false,
            errors: [createValidationError(
              fieldName,
              `${fieldName} is required`
            )]
          };
        }

        return { valid: true, errors: [] };
      }
    };
  }

  /**
   * String length validator
   */
  static stringLength(fieldName: string, min?: number, max?: number): ValidationRule<string> {
    return {
      validate: (value: string) => {
        const errors: SimulatorError[] = [];

        if (min !== undefined && value.length < min) {
          errors.push(createValidationError(
            fieldName,
            `${fieldName} must be at least ${min} characters`
          ));
        }

        if (max !== undefined && value.length > max) {
          errors.push(createValidationError(
            fieldName,
            `${fieldName} must be no more than ${max} characters`
          ));
        }

        return {
          valid: errors.length === 0,
          errors
        };
      }
    };
  }

  /**
   * Number range validator
   */
  static numberRange(fieldName: string, min?: number, max?: number): ValidationRule<number> {
    return {
      validate: (value: number) => {
        const errors: SimulatorError[] = [];

        if (typeof value !== 'number' || isNaN(value)) {
          errors.push(createValidationError(
            fieldName,
            `${fieldName} must be a valid number`
          ));
          return { valid: false, errors };
        }

        if (min !== undefined && value < min) {
          errors.push(createValidationError(
            fieldName,
            `${fieldName} must be at least ${min}`
          ));
        }

        if (max !== undefined && value > max) {
          errors.push(createValidationError(
            fieldName,
            `${fieldName} must be no more than ${max}`
          ));
        }

        return {
          valid: errors.length === 0,
          errors
        };
      }
    };
  }

  /**
   * Email validator
   */
  static email(fieldName: string): ValidationRule<string> {
    return {
      validate: (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(value)) {
          return {
            valid: false,
            errors: [createValidationError(
              fieldName,
              'Please enter a valid email address'
            )]
          };
        }

        return { valid: true, errors: [] };
      }
    };
  }

  /**
   * Pattern validator (regex)
   */
  static pattern(fieldName: string, pattern: RegExp, message: string): ValidationRule<string> {
    return {
      validate: (value: string) => {
        if (!pattern.test(value)) {
          return {
            valid: false,
            errors: [createValidationError(fieldName, message)]
          };
        }

        return { valid: true, errors: [] };
      }
    };
  }

  /**
   * Custom validator
   */
  static custom<T>(
    fieldName: string,
    validatorFn: (value: T) => boolean,
    message: string
  ): ValidationRule<T> {
    return {
      validate: (value: T) => {
        if (!validatorFn(value)) {
          return {
            valid: false,
            errors: [createValidationError(fieldName, message)]
          };
        }

        return { valid: true, errors: [] };
      }
    };
  }

  /**
   * One of validator (enum)
   */
  static oneOf<T>(fieldName: string, allowedValues: T[]): ValidationRule<T> {
    return {
      validate: (value: T) => {
        if (!allowedValues.includes(value)) {
          return {
            valid: false,
            errors: [createValidationError(
              fieldName,
              `${fieldName} must be one of: ${allowedValues.join(', ')}`
            )]
          };
        }

        return { valid: true, errors: [] };
      }
    };
  }
}

/**
 * Simulation-Specific Validators
 */
export class SimulationValidators {
  /**
   * Validate budget allocation (must sum to 100%)
   */
  static budgetAllocation(allocation: {
    brandAwareness: number;
    leadGeneration: number;
    conversionOptimization: number;
  }): ValidationResult {
    const total = allocation.brandAwareness + 
                  allocation.leadGeneration + 
                  allocation.conversionOptimization;

    if (Math.abs(total - 100) > 0.01) { // Allow tiny floating point errors
      return {
        valid: false,
        errors: [new SimulatorError({
          code: ErrorCode.VALIDATION_ALLOCATION_MISMATCH,
          message: `Budget allocation must total 100% (currently ${total.toFixed(1)}%)`,
          details: { allocation, total },
          suggestions: [
            'Adjust your percentages to total exactly 100%',
            `You need to ${total > 100 ? 'decrease' : 'increase'} by ${Math.abs(total - 100).toFixed(1)}%`
          ]
        })]
      };
    }

    // Check individual allocations are valid
    const errors: SimulatorError[] = [];
    
    if (allocation.brandAwareness < 0 || allocation.brandAwareness > 100) {
      errors.push(createValidationError(
        'brandAwareness',
        'Brand Awareness allocation must be between 0% and 100%'
      ));
    }

    if (allocation.leadGeneration < 0 || allocation.leadGeneration > 100) {
      errors.push(createValidationError(
        'leadGeneration',
        'Lead Generation allocation must be between 0% and 100%'
      ));
    }

    if (allocation.conversionOptimization < 0 || allocation.conversionOptimization > 100) {
      errors.push(createValidationError(
        'conversionOptimization',
        'Conversion Optimization allocation must be between 0% and 100%'
      ));
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate channel spend doesn't exceed budget
   */
  static channelSpend(
    channelSpends: Record<string, number>,
    totalBudget: number
  ): ValidationResult {
    const totalSpend = Object.values(channelSpends).reduce((sum, spend) => sum + spend, 0);

    if (totalSpend > totalBudget) {
      return {
        valid: false,
        errors: [createBudgetError(
          `Total channel spend ($${totalSpend.toLocaleString()}) exceeds budget ($${totalBudget.toLocaleString()})`,
          {
            totalSpend,
            totalBudget,
            overspend: totalSpend - totalBudget
          }
        )]
      };
    }

    // Check for negative spends
    const errors: SimulatorError[] = [];
    Object.entries(channelSpends).forEach(([channel, spend]) => {
      if (spend < 0) {
        errors.push(createValidationError(
          channel,
          `${channel} spend cannot be negative`
        ));
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate company name
   */
  static companyName(name: string): ValidationResult {
    const errors: SimulatorError[] = [];

    // Required
    if (!name || name.trim().length === 0) {
      errors.push(createValidationError(
        'companyName',
        'Company name is required'
      ));
      return { valid: false, errors };
    }

    // Length check
    if (name.trim().length < 2) {
      errors.push(createValidationError(
        'companyName',
        'Company name must be at least 2 characters'
      ));
    }

    if (name.length > 100) {
      errors.push(createValidationError(
        'companyName',
        'Company name must be no more than 100 characters'
      ));
    }

    // No special characters except spaces, hyphens, ampersands
    const validPattern = /^[a-zA-Z0-9\s\-&'.]+$/;
    if (!validPattern.test(name)) {
      errors.push(createValidationError(
        'companyName',
        'Company name contains invalid characters'
      ));
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate industry selection
   */
  static industry(industry: string | null): ValidationResult {
    const validIndustries = [
      'healthcare', 'legal', 'ecommerce', 'saas', 'fintech', 'education',
      'real-estate', 'food-delivery', 'fitness', 'automotive', 'travel',
      'gaming', 'fashion', 'construction', 'energy', 'agritech',
      'manufacturing', 'nonprofit', 'music', 'sports', 'pet-care',
      'home-services', 'cannabis', 'space'
    ];

    if (!industry) {
      return {
        valid: false,
        errors: [createValidationError('industry', 'Please select an industry')]
      };
    }

    if (!validIndustries.includes(industry)) {
      return {
        valid: false,
        errors: [createValidationError(
          'industry',
          'Invalid industry selection',
          { industry, validIndustries }
        )]
      };
    }

    return { valid: true, errors: [] };
  }
}

/**
 * Form Validator - validates entire forms
 */
export class FormValidator {
  private rules: Map<string, ValidationRule[]> = new Map();

  /**
   * Add validation rules for a field
   */
  addRule(fieldName: string, rule: ValidationRule): this {
    const existing = this.rules.get(fieldName) || [];
    this.rules.set(fieldName, [...existing, rule]);
    return this;
  }

  /**
   * Validate all fields
   */
  validate(data: Record<string, any>): ValidationResult {
    const allErrors: SimulatorError[] = [];
    const warnings: string[] = [];

    for (const [fieldName, rules] of this.rules.entries()) {
      const fieldValue = data[fieldName];

      for (const rule of rules) {
        const result = rule.validate(fieldValue, data);
        
        if (!result.valid) {
          allErrors.push(...result.errors);
        }

        if (result.warnings) {
          warnings.push(...result.warnings);
        }
      }
    }

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * Validate a single field
   */
  validateField(fieldName: string, value: any, context?: any): ValidationResult {
    const rules = this.rules.get(fieldName);
    
    if (!rules) {
      return { valid: true, errors: [] };
    }

    const errors: SimulatorError[] = [];
    const warnings: string[] = [];

    for (const rule of rules) {
      const result = rule.validate(value, context);
      
      if (!result.valid) {
        errors.push(...result.errors);
      }

      if (result.warnings) {
        warnings.push(...result.warnings);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * Clear all rules
   */
  clear(): this {
    this.rules.clear();
    return this;
  }
}

/**
 * Pre-configured validators for common forms
 */
export const setupFormValidator = new FormValidator()
  .addRule('companyName', Validators.required('Company Name'))
  .addRule('companyName', Validators.stringLength('Company Name', 2, 100))
  .addRule('timeHorizon', Validators.required('Time Horizon'))
  .addRule('industry', Validators.required('Industry'))
  .addRule('companyProfile', Validators.required('Company Profile'))
  .addRule('marketLandscape', Validators.required('Market Landscape'))
  .addRule('difficulty', Validators.required('Difficulty Level'));
