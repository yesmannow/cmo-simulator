import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * Health check endpoint
 * Used for monitoring and load balancer health checks
 *
 * GET /api/health
 * Returns: { status: 'healthy' | 'unhealthy', timestamp, version }
 */
export async function GET() {
  try {
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || 'unknown',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    logger.error('Health check failed: unexpected error', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Service unavailable',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || 'unknown'
      },
      { status: 503 }
    );
  }
}

