'use client';

import { FormEvent, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInSimAuth, signUpSimAuth } from '@/lib/simAuth';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/sim/setup';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (!email.includes('@')) {
      setStatus('Enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setStatus('Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await signInSimAuth(email.trim().toLowerCase(), password);
      router.replace(nextPath);
    } catch {
      try {
        await signUpSimAuth(email.trim().toLowerCase(), password);
        setStatus('Account created. Check your email to confirm, then sign in.');
      } catch (error) {
        setStatus(error instanceof Error ? error.message : 'Unable to authenticate.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Sign in to CMO Simulator</h1>
        <p className="mt-2 text-sm text-slate-600">
          Protected simulator routes require an authenticated Supabase account.
        </p>

        <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
          <input
            type="email"
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            type="password"
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full rounded-md bg-slate-900 px-3 py-2 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading ? 'Working...' : 'Sign In / Sign Up'}
          </button>
        </form>

        {status ? <p className="mt-3 text-sm text-slate-700">{status}</p> : null}
      </section>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
