/**
 * Rate Limiting Utility
 * Simple in-memory rate limiting for API routes
 *
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (request: Request) => string; // Custom key generator
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * Simple rate limiter
 *
 * @param request - The incoming request
 * @param options - Rate limit options
 * @returns Rate limit result
 */
export async function rateLimit(
  request: Request,
  options: RateLimitOptions = {
    windowMs: 60000, // 1 minute
    maxRequests: 100, // 100 requests per minute
  }
): Promise<RateLimitResult> {
  const now = Date.now();

  // Generate key (default: IP address)
  const key = options.keyGenerator
    ? options.keyGenerator(request)
    : request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

  const record = store[key];

  // If no record or window expired, create new record
  if (!record || now > record.resetTime) {
    store[key] = {
      count: 1,
      resetTime: now + options.windowMs,
    };

    // Clean up old entries (simple cleanup, not production-ready)
    if (Object.keys(store).length > 10000) {
      Object.keys(store).forEach((k) => {
        if (store[k].resetTime < now) {
          delete store[k];
        }
      });
    }

    return {
      success: true,
      remaining: options.maxRequests - 1,
      resetTime: store[key].resetTime,
    };
  }

  // Increment count
  record.count++;

  // Check if limit exceeded
  if (record.count > options.maxRequests) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
      retryAfter,
    };
  }

  return {
    success: true,
    remaining: options.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Rate limit middleware for Next.js API routes
 */
export function withRateLimit(
  handler: (request: Request) => Promise<Response>,
  options?: RateLimitOptions
) {
  return async (request: Request): Promise<Response> => {
    const result = await rateLimit(request, options);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          retryAfter: result.retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': result.retryAfter?.toString() || '60',
            'X-RateLimit-Limit': options?.maxRequests.toString() || '100',
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
          },
        }
      );
    }

    // Add rate limit headers to response
    const response = await handler(request);
    response.headers.set('X-RateLimit-Limit', options?.maxRequests.toString() || '100');
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());

    return response;
  };
}

