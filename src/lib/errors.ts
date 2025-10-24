/**
 * Centralized Error Handling System
 * Provides type-safe error handling with detailed context
 */

export enum ErrorCode {
  // Validation Errors (1000-1999)
  VALIDATION_REQUIRED_FIELD = 'VALIDATION_REQUIRED_FIELD',
  VALIDATION_INVALID_FORMAT = 'VALIDATION_INVALID_FORMAT',
  VALIDATION_OUT_OF_RANGE = 'VALIDATION_OUT_OF_RANGE',
  VALIDATION_BUDGET_EXCEEDED = 'VALIDATION_BUDGET_EXCEEDED',
  VALIDATION_ALLOCATION_MISMATCH = 'VALIDATION_ALLOCATION_MISMATCH',
  
  // Simulation Errors (2000-2999)
  SIMULATION_INVALID_STATE = 'SIMULATION_INVALID_STATE',
  SIMULATION_CALCULATION_ERROR = 'SIMULATION_CALCULATION_ERROR',
  SIMULATION_CHANNEL_ERROR = 'SIMULATION_CHANNEL_ERROR',
  SIMULATION_INDUSTRY_NOT_FOUND = 'SIMULATION_INDUSTRY_NOT_FOUND',
  
  // API Errors (3000-3999)
  API_NETWORK_ERROR = 'API_NETWORK_ERROR',
  API_TIMEOUT = 'API_TIMEOUT',
  API_UNAUTHORIZED = 'API_UNAUTHORIZED',
  API_FORBIDDEN = 'API_FORBIDDEN',
  API_NOT_FOUND = 'API_NOT_FOUND',
  API_SERVER_ERROR = 'API_SERVER_ERROR',
  
  // Database Errors (4000-4999)
  DB_CONNECTION_ERROR = 'DB_CONNECTION_ERROR',
  DB_QUERY_ERROR = 'DB_QUERY_ERROR',
  DB_CONSTRAINT_VIOLATION = 'DB_CONSTRAINT_VIOLATION',
  DB_NOT_FOUND = 'DB_NOT_FOUND',
  
  // Auth Errors (5000-5999)
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_SESSION_EXPIRED = 'AUTH_SESSION_EXPIRED',
  AUTH_INSUFFICIENT_PERMISSIONS = 'AUTH_INSUFFICIENT_PERMISSIONS',
  
  // Unknown
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface ErrorContext {
  code: ErrorCode;
  message: string;
  details?: Record<string, any>;
  field?: string;
  timestamp: Date;
  userMessage: string; // User-friendly message
  technicalMessage?: string; // For logging/debugging
  recoverable: boolean;
  suggestions?: string[];
}

export class SimulatorError extends Error {
  public readonly code: ErrorCode;
  public readonly context: ErrorContext;
  public readonly isOperational: boolean;

  constructor(context: Partial<ErrorContext> & { code: ErrorCode; message: string }) {
    super(context.message);
    this.name = 'SimulatorError';
    this.code = context.code;
    this.isOperational = context.recoverable ?? true;
    
    this.context = {
      code: context.code,
      message: context.message,
      details: context.details,
      field: context.field,
      timestamp: new Date(),
      userMessage: context.userMessage || this.getDefaultUserMessage(context.code),
      technicalMessage: context.technicalMessage,
      recoverable: context.recoverable ?? true,
      suggestions: context.suggestions || this.getDefaultSuggestions(context.code)
    };

    // Maintains proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  private getDefaultUserMessage(code: ErrorCode): string {
    const messages: Record<ErrorCode, string> = {
      [ErrorCode.VALIDATION_REQUIRED_FIELD]: 'This field is required',
      [ErrorCode.VALIDATION_INVALID_FORMAT]: 'Invalid format',
      [ErrorCode.VALIDATION_OUT_OF_RANGE]: 'Value is out of acceptable range',
      [ErrorCode.VALIDATION_BUDGET_EXCEEDED]: 'Budget allocation exceeds available budget',
      [ErrorCode.VALIDATION_ALLOCATION_MISMATCH]: 'Budget allocations must total 100%',
      [ErrorCode.SIMULATION_INVALID_STATE]: 'Simulation is in an invalid state',
      [ErrorCode.SIMULATION_CALCULATION_ERROR]: 'Error calculating simulation results',
      [ErrorCode.SIMULATION_CHANNEL_ERROR]: 'Invalid marketing channel configuration',
      [ErrorCode.SIMULATION_INDUSTRY_NOT_FOUND]: 'Selected industry not found',
      [ErrorCode.API_NETWORK_ERROR]: 'Network connection error. Please check your internet.',
      [ErrorCode.API_TIMEOUT]: 'Request timed out. Please try again.',
      [ErrorCode.API_UNAUTHORIZED]: 'Please log in to continue',
      [ErrorCode.API_FORBIDDEN]: 'You don\'t have permission to perform this action',
      [ErrorCode.API_NOT_FOUND]: 'Resource not found',
      [ErrorCode.API_SERVER_ERROR]: 'Server error. Please try again later.',
      [ErrorCode.DB_CONNECTION_ERROR]: 'Database connection error',
      [ErrorCode.DB_QUERY_ERROR]: 'Database query error',
      [ErrorCode.DB_CONSTRAINT_VIOLATION]: 'Data constraint violation',
      [ErrorCode.DB_NOT_FOUND]: 'Record not found',
      [ErrorCode.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password',
      [ErrorCode.AUTH_SESSION_EXPIRED]: 'Your session has expired. Please log in again.',
      [ErrorCode.AUTH_INSUFFICIENT_PERMISSIONS]: 'Insufficient permissions',
      [ErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred'
    };
    
    return messages[code] || 'An error occurred';
  }

  private getDefaultSuggestions(code: ErrorCode): string[] {
    const suggestions: Partial<Record<ErrorCode, string[]>> = {
      [ErrorCode.VALIDATION_BUDGET_EXCEEDED]: [
        'Reduce spending in one or more channels',
        'Check your total budget allocation'
      ],
      [ErrorCode.VALIDATION_ALLOCATION_MISMATCH]: [
        'Ensure all percentages add up to exactly 100%',
        'Use the auto-balance feature'
      ],
      [ErrorCode.API_NETWORK_ERROR]: [
        'Check your internet connection',
        'Try refreshing the page'
      ],
      [ErrorCode.API_TIMEOUT]: [
        'Try again in a few moments',
        'Check your internet connection'
      ],
      [ErrorCode.AUTH_SESSION_EXPIRED]: [
        'Log in again to continue',
        'Enable "Remember me" to stay logged in longer'
      ]
    };
    
    return suggestions[code] || ['Please try again or contact support'];
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
      stack: this.stack
    };
  }
}

/**
 * Error Handler Utility Functions
 */
export class ErrorHandler {
  /**
   * Handle errors and return user-friendly messages
   */
  static handle(error: unknown): ErrorContext {
    if (error instanceof SimulatorError) {
      return error.context;
    }

    if (error instanceof Error) {
      return {
        code: ErrorCode.UNKNOWN_ERROR,
        message: error.message,
        timestamp: new Date(),
        userMessage: 'An unexpected error occurred',
        technicalMessage: error.message,
        recoverable: true,
        suggestions: ['Please try again', 'Contact support if the problem persists']
      };
    }

    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: 'Unknown error',
      timestamp: new Date(),
      userMessage: 'An unexpected error occurred',
      recoverable: true,
      suggestions: ['Please try again']
    };
  }

  /**
   * Log error to console (and eventually to monitoring service)
   */
  static log(error: unknown, context?: Record<string, any>) {
    const errorContext = this.handle(error);
    
    console.error('[SimulatorError]', {
      ...errorContext,
      additionalContext: context,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server'
    });

    // TODO: Send to monitoring service (Sentry, LogRocket, etc.)
    // if (process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(error, { contexts: { custom: context } });
    // }
  }

  /**
   * Create a user-friendly error message
   */
  static getUserMessage(error: unknown): string {
    const context = this.handle(error);
    return context.userMessage;
  }

  /**
   * Check if error is recoverable
   */
  static isRecoverable(error: unknown): boolean {
    if (error instanceof SimulatorError) {
      return error.context.recoverable;
    }
    return true; // Assume recoverable by default
  }
}

/**
 * Common error factory functions
 */
export const createValidationError = (
  field: string,
  message: string,
  details?: Record<string, any>
): SimulatorError => {
  return new SimulatorError({
    code: ErrorCode.VALIDATION_INVALID_FORMAT,
    message,
    field,
    details,
    userMessage: message,
    recoverable: true
  });
};

export const createBudgetError = (
  message: string,
  details?: Record<string, any>
): SimulatorError => {
  return new SimulatorError({
    code: ErrorCode.VALIDATION_BUDGET_EXCEEDED,
    message,
    details,
    recoverable: true
  });
};

export const createSimulationError = (
  message: string,
  details?: Record<string, any>
): SimulatorError => {
  return new SimulatorError({
    code: ErrorCode.SIMULATION_CALCULATION_ERROR,
    message,
    details,
    recoverable: false
  });
};

export const createAPIError = (
  statusCode: number,
  message: string,
  details?: Record<string, any>
): SimulatorError => {
  let code: ErrorCode;
  
  switch (statusCode) {
    case 401:
      code = ErrorCode.API_UNAUTHORIZED;
      break;
    case 403:
      code = ErrorCode.API_FORBIDDEN;
      break;
    case 404:
      code = ErrorCode.API_NOT_FOUND;
      break;
    case 408:
      code = ErrorCode.API_TIMEOUT;
      break;
    case 500:
    case 502:
    case 503:
      code = ErrorCode.API_SERVER_ERROR;
      break;
    default:
      code = ErrorCode.API_NETWORK_ERROR;
  }

  return new SimulatorError({
    code,
    message,
    details: { ...details, statusCode },
    recoverable: statusCode < 500
  });
};
