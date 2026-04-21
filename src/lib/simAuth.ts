export interface SimAuthSession {
  userId: string;
  email: string;
  name?: string;
  signedInAt: string;
}

const STORAGE_KEY = "cmo-sim-auth-v1";

export function getSimAuthSession(): SimAuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as SimAuthSession;
    if (!parsed?.userId || !parsed?.email) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setSimAuthSession(email: string, name?: string): SimAuthSession {
  const session: SimAuthSession = {
    userId: crypto.randomUUID(),
    email: email.trim().toLowerCase(),
    name: name?.trim() || undefined,
    signedInAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function clearSimAuthSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

