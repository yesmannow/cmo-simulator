'use client';

import { FormEvent, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  formatAuthErrorMessage,
  requestPasswordResetEmail,
  signInSimAuth,
  normalizePersonName,
  signUpSimAuthWithOutcome,
} from '@/lib/simAuth';

type AuthMode = 'signin' | 'signup' | 'forgot';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/sim/setup';
  const urlMessage = searchParams.get('message');

  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<'neutral' | 'success' | 'error'>('neutral');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const setMessage = (message: string | null, tone: 'neutral' | 'success' | 'error' = 'neutral') => {
    setStatus(message);
    setStatusTone(tone);
  };

  const urlBanner =
    urlMessage === 'password_updated'
      ? { text: 'Your password was updated. Sign in with your new password.', tone: 'success' as const }
      : urlMessage === 'confirm_link_invalid'
        ? {
            text: 'That confirmation link is invalid or expired. Request a new account or contact support.',
            tone: 'error' as const,
          }
        : urlMessage === 'missing_code'
          ? {
              text: 'Email confirmation did not complete. Open the full link from your confirmation email.',
              tone: 'error' as const,
            }
          : null;

  const handleSignIn = async () => {
    setMessage(null);
    if (!email.includes('@')) {
      setMessage('Enter a valid email address.', 'error');
      return;
    }
    if (password.length < 8) {
      setMessage('Password must be at least 8 characters.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await signInSimAuth(email.trim().toLowerCase(), password);
      router.replace(nextPath);
    } catch (error) {
      setMessage(formatAuthErrorMessage(error), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    setMessage(null);
    if (!email.includes('@')) {
      setMessage('Enter a valid email address.', 'error');
      return;
    }
    if (password.length < 8) {
      setMessage('Password must be at least 8 characters.', 'error');
      return;
    }
    const given = normalizePersonName(firstName);
    const family = normalizePersonName(lastName);
    if (!given.length) {
      setMessage('Enter your first name.', 'error');
      return;
    }
    if (!family.length) {
      setMessage('Enter your last name.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const outcome = await signUpSimAuthWithOutcome(
        email.trim().toLowerCase(),
        password,
        given,
        family,
      );
      if (outcome.kind === 'signed_in') {
        router.replace(nextPath);
        return;
      }
      if (outcome.kind === 'confirm_email') {
        setMessage(
          'Account created. Check your email to confirm your address, then sign in here.',
          'success',
        );
        setMode('signin');
        setPassword('');
        setFirstName('');
        setLastName('');
        return;
      }
      setMessage(outcome.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async () => {
    setMessage(null);
    if (!email.includes('@')) {
      setMessage('Enter the email for your account.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await requestPasswordResetEmail(email);
      setMessage(
        'If an account exists for that email, you will receive a password reset link shortly.',
        'success',
      );
    } catch (error) {
      setMessage(formatAuthErrorMessage(error), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === 'signin') void handleSignIn();
    else if (mode === 'signup') void handleSignUp();
    else void handleForgotSubmit();
  };

  const statusClass =
    statusTone === 'success'
      ? 'text-emerald-800'
      : statusTone === 'error'
        ? 'text-rose-700'
        : 'text-slate-700';

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">CMO Simulator</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in or create an account to access the simulator and saved runs.
        </p>

        {urlBanner ? (
          <p
            className={
              urlBanner.tone === 'success'
                ? 'mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-900'
                : 'mt-3 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-900'
            }
          >
            {urlBanner.text}
          </p>
        ) : null}

        <div className="mt-5 flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-sm font-semibold">
          <button
            type="button"
            className={`flex-1 rounded-md px-3 py-2 ${mode === 'signin' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600'}`}
            onClick={() => {
              setMode('signin');
              setMessage(null);
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`flex-1 rounded-md px-3 py-2 ${mode === 'signup' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600'}`}
            onClick={() => {
              setMode('signup');
              setMessage(null);
            }}
          >
            Create account
          </button>
        </div>

        <form className="mt-5 space-y-3" onSubmit={handleSubmit} autoComplete="on">
          <div>
            <label htmlFor="auth-email" className="mb-1 block text-xs font-medium text-slate-600">
              Email
            </label>
            <input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          {mode === 'signup' ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="auth-first-name" className="mb-1 block text-xs font-medium text-slate-600">
                  First name
                </label>
                <input
                  id="auth-first-name"
                  name="given-name"
                  type="text"
                  autoComplete="given-name"
                  spellCheck={false}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900"
                  placeholder="Jane"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                  maxLength={120}
                />
              </div>
              <div>
                <label htmlFor="auth-last-name" className="mb-1 block text-xs font-medium text-slate-600">
                  Last name
                </label>
                <input
                  id="auth-last-name"
                  name="family-name"
                  type="text"
                  autoComplete="family-name"
                  spellCheck={false}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  required
                  maxLength={120}
                />
              </div>
            </div>
          ) : null}

          {mode !== 'forgot' ? (
            <div>
              <label htmlFor="auth-password" className="mb-1 block text-xs font-medium text-slate-600">
                Password
              </label>
              <div className="flex gap-2">
                <input
                  id="auth-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  className="min-w-0 flex-1 rounded-md border border-slate-200 px-3 py-2 text-slate-900"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-pressed={showPassword}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {mode === 'signup' ? (
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
                  Use at least 8 characters. Avoid reused passwords—Chrome can suggest and save a strong one after you sign in.
                </p>
              ) : null}
            </div>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-md bg-slate-900 px-3 py-2 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading
              ? 'Please wait…'
              : mode === 'signin'
                ? 'Sign in'
                : mode === 'signup'
                  ? 'Create account'
                  : 'Send reset link'}
          </button>
        </form>

        {mode === 'signin' ? (
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <button
              type="button"
              className="text-left font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-950"
              onClick={() => {
                setMode('forgot');
                setMessage(null);
              }}
            >
              Forgot password?
            </button>
          </div>
        ) : mode === 'forgot' ? (
          <button
            type="button"
            className="mt-3 text-sm font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-950"
            onClick={() => {
              setMode('signin');
              setMessage(null);
            }}
          >
            Back to sign in
          </button>
        ) : null}

        {status ? <p className={`mt-3 text-sm ${statusClass}`}>{status}</p> : null}

        <p className="mt-6 text-center text-xs text-slate-500">
          After {mode === 'signup' ? 'creating an account' : 'signing in'}, you will continue to{' '}
          <span className="font-mono text-slate-700">{nextPath}</span>
        </p>
      </section>
    </main>
  );
}

function SignInFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <p className="text-sm text-slate-600">Loading sign-in…</p>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInForm />
    </Suspense>
  );
}
