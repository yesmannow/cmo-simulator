const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getHeaders() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase REST is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  return {
    apikey: supabaseServiceRoleKey,
    Authorization: `Bearer ${supabaseServiceRoleKey}`,
    "Content-Type": "application/json",
  };
}

export async function supabaseRestRequest(path: string, init?: RequestInit): Promise<Response> {
  if (!supabaseUrl) {
    throw new Error("Supabase URL is not configured.");
  }

  return fetch(`${supabaseUrl}${path}`, {
    ...init,
    headers: {
      ...getHeaders(),
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
}

