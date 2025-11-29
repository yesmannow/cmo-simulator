import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Check if we're in a build context (not runtime)
 * This allows the build to succeed even if env vars aren't set yet
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

  return false;
}

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // During build time, return a mock client to allow build to succeed
  // Environment variables will be available at runtime in Cloudflare Pages
  if (isBuildTime() && (!supabaseUrl || !supabaseKey)) {
    return createMockServerClient()
  }

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    )
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

/**
 * Create a mock server client for build time
 * This allows the build to succeed without Supabase credentials
 */
function createMockServerClient() {
  const mockQuery: any = new Proxy({}, {
    get: () => mockQuery,
  })

  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
    ...mockQuery,
  } as any
}
