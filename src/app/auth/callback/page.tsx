'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return '/sim/setup';
  }
  return next;
}

const TOKEN_HASH_TYPES = new Set<EmailOtpType>([
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
  'email',
]);

function parseEmailOtpType(raw: string | null): EmailOtpType | null {
  if (!raw) return null;
  const t = raw.toLowerCase() as EmailOtpType;
  return TOKEN_HASH_TYPES.has(t) ? t : null;
}

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hint, setHint] = useState('Completing sign-in…');

  useEffect(() => {
    let cancelled = false;

    const fail = (message: 'confirm_link_invalid' | 'missing_code') => {
      if (cancelled) return;
      router.replace(`/auth/sign-in?message=${encodeURIComponent(message)}`);
    };

    const succeed = (next: string) => {
      if (cancelled) return;
      router.replace(next);
    };

    const run = async () => {
      const href = window.location.href;
      const url = new URL(href);
      const next = safeNextPath(searchParams.get('next') ?? url.searchParams.get('next'));

      const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      const code = url.searchParams.get('code');
      const tokenHash = url.searchParams.get('token_hash');
      const otpType = parseEmailOtpType(url.searchParams.get('type'));

      const authError = url.searchParams.get('error');
      if (authError) {
        fail('confirm_link_invalid');
        return;
      }

      const supabase = createClient();

      if (accessToken && refreshToken) {
        setHint('Confirming your email…');
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) {
          fail('confirm_link_invalid');
          return;
        }
        succeed(next);
        return;
      }

      if (tokenHash && otpType) {
        setHint('Confirming your email…');
        const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: otpType });
        if (error) {
          fail('confirm_link_invalid');
          return;
        }
        succeed(next);
        return;
      }

      if (code) {
        setHint('Confirming your email…');
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          fail('confirm_link_invalid');
          return;
        }
        succeed(next);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        succeed(next);
        return;
      }

      fail('missing_code');
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <p className="text-sm text-slate-600">{hint}</p>
    </main>
  );
}

function AuthCallbackFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <p className="text-sm text-slate-600">Loading…</p>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackFallback />}>
      <AuthCallbackInner />
    </Suspense>
  );
}
