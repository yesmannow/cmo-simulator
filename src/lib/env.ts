/**
 * Environment variable validation
 * Throws error on app startup if required vars are missing
 *
 * This ensures the application fails fast with a clear error message
 * rather than failing later with cryptic errors.
 *
 * Note: Validation is skipped during build time for Cloudflare Pages,
 * as environment variables are injected at runtime.
 */

const requiredEnvVars = [] as const;

/**
 * Check if we're in a build context (not runtime)
 * This allows the build to succeed even if env vars aren't set yet
 * Cloudflare Pages injects environment variables at runtime, not build time
 */
function isBuildTime(): boolean {
  // Next.js sets NEXT_PHASE during build phases
  if (process.env.NEXT_PHASE) {
    return true;
  }

  // Check if we're running Next.js build command
  if (process.argv.some(arg => arg.includes('next') && (arg.includes('build') || arg.includes('export')))) {
    return true;
  }

  // Check npm/pnpm/yarn build scripts
  const lifecycleEvent = process.env.npm_lifecycle_event;
  if (lifecycleEvent && (lifecycleEvent.includes('build') || lifecycleEvent.includes('opennextjs-cloudflare'))) {
    return true;
  }

  // During build, NODE_ENV is typically 'production' but we can't rely on that alone
  // Instead, we check if we're in a CI/build environment without the actual env vars
  // This is a fallback - if we're missing required vars and in a build-like context, skip validation
  if (process.env.CI || process.env.CF_PAGES) {
    // Only skip if we're actually missing the vars (they'll be available at runtime)
    const hasRequiredVars = requiredEnvVars.every(varName => !!process.env[varName]);
    if (!hasRequiredVars) {
      return true;
    }
  }

  return false;
}

export function validateEnv() {
  // Skip validation during build time - Cloudflare Pages injects env vars at runtime
  if (isBuildTime()) {
    return;
  }

  const missing: string[] = [];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.\n' +
      'See .env.example for reference.'
    );
  }
}

// Validate on module load (only in Node.js environment, not in browser)
// Skip during build time for Cloudflare Pages compatibility
if (typeof window === 'undefined') {
  validateEnv();
}

/**
 * Get environment variable with type safety
 */
export function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value || defaultValue!;
}

/**
 * Check if an optional environment variable is set
 */
export function hasEnvVar(name: string): boolean {
  return Boolean(process.env[name]);
}
