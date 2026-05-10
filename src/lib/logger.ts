/**
 * Centralized logging utility
 * Replaces console.log/error/warn throughout the application
 *
 * Benefits:
 * - Consistent logging format
 * - Easy to add production logging service (Sentry, Datadog, etc.)
 * - Can disable logs in production
 * - Type-safe logging
 */
interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  /**
   * General logging (use for debugging)
   */
  log(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.log(`[LOG] ${message}`, context || '');
    }
    // In production, send to logging service if needed
  }

  /**
   * Error logging (always logged, even in production)
   */
  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorDetails = error instanceof Error
      ? { message: error.message, stack: error.stack, name: error.name }
      : error;

    const requestId =
      typeof context?.requestId === "string" && context.requestId.length > 0
        ? context.requestId
        : undefined;
    const prefix = requestId ? `[ERROR][req:${requestId}] ` : "[ERROR] ";

    console.error(`${prefix}${message}`, errorDetails, context || '');

    // In production, send to error tracking service (Sentry, etc.)
    if (this.isProduction && typeof window !== 'undefined') {
      // Example: Sentry.captureException(error, { extra: context });
    }
  }

  /**
   * Warning logging
   */
  warn(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, context || '');
    }
    // In production, send to logging service if needed
  }

  /**
   * Info logging (for important information)
   */
  info(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, context || '');
    }
    // In production, can send to logging service
  }

  /**
   * Debug logging (only in development)
   */
  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, context || '');
    }
  }
}

export const logger = new Logger();
