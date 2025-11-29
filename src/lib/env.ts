/**
 * Environment variable validation
 * Throws error on app startup if required vars are missing
 *
 * This ensures the application fails fast with a clear error message
 * rather than failing later with cryptic errors.
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

const optionalEnvVars = [
  'NEXT_PUBLIC_AI_PROVIDER',
  'NEXT_PUBLIC_OPENAI_API_KEY',
  'NEXT_PUBLIC_POSTHOG_KEY',
  'NEXT_PUBLIC_MIXPANEL_TOKEN',
  'NEXT_PUBLIC_GA_MEASUREMENT_ID',
  'NEXT_PUBLIC_SENTRY_DSN',
] as const;

export function validateEnv() {
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

