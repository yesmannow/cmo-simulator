import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
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
    // Check database connection
    const supabase = await createClient();
    const { error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      logger.error('Health check failed: database error', error);
      return NextResponse.json(
        {
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString(),
          version: process.env.npm_package_version || 'unknown'
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || 'unknown',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: 'ok',
        timestamp: new Date().toISOString()
      }
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

