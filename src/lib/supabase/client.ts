import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const HAS_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

let cachedClient: any

export function createClient() {
  if (!HAS_SUPABASE) {
    return createMockClient()
  }

  if (!cachedClient) {
    cachedClient = createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)
  }

  return cachedClient
}

// Export a default client instance for convenience
export const supabase = createClient()

function createMockClient() {
  const mockQuery: any = new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (prop === 'single' || prop === 'maybeSingle') {
          return async () => ({ data: null, error: null })
        }
        if (prop === 'then') {
          return undefined
        }
        return () => mockQuery
      },
    }
  )

  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } }, error: null }),
    },
    from: () => mockQuery,
    storage: {
      from: () => mockQuery,
    },
  }
}
