import { createClient } from "@/lib/supabase/client";

export interface SimAuthSession {
  userId: string;
  email: string;
  signedInAt: string;
}

function toSession(
  session: Awaited<ReturnType<ReturnType<typeof createClient>["auth"]["getSession"]>>["data"]["session"],
): SimAuthSession | null {
  const user = session?.user;
  if (!user?.id || !user.email) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email,
    signedInAt: user.last_sign_in_at ?? new Date().toISOString(),
  };
}

export async function getSimAuthSession(): Promise<SimAuthSession | null> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return toSession(data.session);
}

export async function signInSimAuth(email: string, password: string): Promise<SimAuthSession> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const session = toSession(data.session);
  if (!session) throw new Error("Failed to create Supabase session.");
  return session;
}

export async function signUpSimAuth(email: string, password: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
}

export async function clearSimAuthSession(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}
