'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { pdf } from '@react-pdf/renderer';
import { logger } from '@/lib/logger';
import { ConfettiEffect } from '@/components/simulation/ConfettiEffect';
import { EnhancedDebrief } from '@/components/simulation/EnhancedDebrief';
import { ImmersiveLayout } from '@/components/simulation/ImmersiveLayout';
import { SimulationDebriefPdf } from '@/components/simulation/SimulationDebriefPdf';
import { useSimulation } from '@/hooks/useSimulation';
import { deriveSimulationRecommendations, buildSimulationScoreBreakdowns } from '@/lib/simulationIntelligence';
import { calculateGrade, calculateOverallScore } from '@/lib/simulationInsights';
import {
  formatAuthErrorMessage,
  getSimAuthSession,
  normalizePersonName,
  signInSimAuth,
  signUpSimAuth,
  type SimAuthSession,
} from '@/lib/simAuth';
import { buildDebriefProfileHint } from '@/lib/debriefPersonalization';
import { saveSimulationSnapshot } from '@/lib/saveSimulationSnapshot';
import { buildSimulationDebriefReport } from '@/lib/simulationReport';
import { recordSimulationEvent } from '@/lib/simulationTelemetry';

/**
 * Debrief route sits behind `src/app/sim/layout.tsx`, which already requires a Supabase user (`getUser` on the server).
 *
 * `authSession` here is the browser client's `getSession()` snapshot — it can be briefly empty during hydration even though the layout gate passed.
 * Dismiss panel copy refers to skipping **explicit unlock/sign-up UX**, not being anonymous on `/sim`.
 * Authoritative save identity still flows through `getSimAuthSession()` inside `saveSimulationSnapshot` and matches POST `/api/simulations/save` checks.
 */
export default function DebriefPage() {
  const router = useRouter();
  const { context, completeDebrief, restartSimulation } = useSimulation();
  const [showConfetti, setShowConfetti] = useState(false);
  const [authSession, setAuthSession] = useState<SimAuthSession | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authPromptDismissed, setAuthPromptDismissed] = useState(false);
  const [profileRow, setProfileRow] = useState<Record<string, unknown> | null>(null);
  const scoreBreakdowns = buildSimulationScoreBreakdowns(context);
  const recommendations = deriveSimulationRecommendations(context, scoreBreakdowns);

  useEffect(() => {
    setShowConfetti(true);
    completeDebrief();
    void (async () => {
      const session = await getSimAuthSession();
      setAuthSession(session);
    })();
  }, [completeDebrief]);

  useEffect(() => {
    if (!authSession) {
      setProfileRow(null);
      return;
    }
    const ac = new AbortController();
    void (async () => {
      try {
        const response = await fetch('/api/profile', { signal: ac.signal });
        if (!response.ok) return;
        const data = await response.json();
        if (!ac.signal.aborted) {
          setProfileRow(data?.profile && typeof data.profile === 'object' ? data.profile : null);
        }
      } catch {
        if (!ac.signal.aborted) setProfileRow(null);
      }
    })();
    return () => ac.abort();
  }, [authSession]);

  const requireAuth = async (): Promise<SimAuthSession | null> => {
    const session = await getSimAuthSession();
    if (!session) {
      setStatusMessage('Sign in with your email to save this run or export the PDF briefing.');
      return null;
    }
    return session;
  };

  const handleSignIn = async () => {
    const email = emailInput.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      setStatusMessage('Enter a valid email to continue.');
      return;
    }
    if (passwordInput.trim().length < 8) {
      setStatusMessage('Enter a password with at least 8 characters.');
      return;
    }

    setIsSigningIn(true);
    setStatusMessage(null);
    try {
      const session = await signInSimAuth(email, passwordInput);
      setAuthSession(session);
      setStatusMessage('Signed in. Save run and export briefing are enabled for this account.');
    } catch {
      const given = normalizePersonName(firstNameInput);
      const family = normalizePersonName(lastNameInput);
      if (!given.length || !family.length) {
        setStatusMessage('Enter your first and last name to create a new account.');
        return;
      }
      try {
        await signUpSimAuth(email, passwordInput, given, family);
        setStatusMessage('Account created. Check your inbox to confirm, then sign in.');
      } catch (signUpErr) {
        setStatusMessage(formatAuthErrorMessage(signUpErr));
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSaveRun = async () => {
    const session = await requireAuth();
    if (!session) return;

    setIsSaving(true);
    setStatusMessage(null);
    try {
      const result = await saveSimulationSnapshot(context, 'debrief', 'completed');

      if (!result.ok || !result.persisted) {
        setStatusMessage(
          !result.persisted
            ? 'Session not ready to save yet — refresh or retry save from the header.'
            : 'Could not save this run. Check the save status in the header and try Retry.',
        );
        return;
      }

      setStatusMessage('Run saved to your account. Pick it up anytime from Setup → Resume latest saved run.');
      void recordSimulationEvent({
        runId: context.simulationId ?? '',
        eventType: 'debrief_saved',
        phase: 'debrief',
        payload: {
          overallScore: calculateOverallScore(context),
          grade: calculateGrade(calculateOverallScore(context)),
        },
      });
    } catch (error) {
      logger.error('Error saving simulation run', error);
      setStatusMessage('Could not save this run. Try again in a moment.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const session = await requireAuth();
      if (!session) return;

      const report = buildSimulationDebriefReport(context, {
        email: session.email,
      });
      const blob = await pdf(<SimulationDebriefPdf report={report} />).toBlob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `cmo-simulation-report-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setStatusMessage('PDF briefing downloaded. Keep it alongside any saved run in your account.');
    } catch (error) {
      logger.error('Error exporting PDF', error);
      setStatusMessage('Failed to export report.');
    }
  };

  const handleRestart = () => {
    restartSimulation();
    router.push('/sim/strategy');
  };

  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: 'CMO Simulation Results',
        text: 'Check out my marketing simulation results!',
        url: window.location.href,
      });
    }
  };

  const profileHint = buildDebriefProfileHint(profileRow);
  const debriefSubtitle = [
    'Executive decision lab: rubric, benchmarks vs a synthetic cohort, and replay experiments. Save/export stay optional until you sign in.',
    profileHint,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <ImmersiveLayout
      title="Debrief"
      quarter="CRM View"
      subtitle={debriefSubtitle}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <ConfettiEffect trigger={showConfetti} />
        {!authSession && !authPromptDismissed && (
          <div className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Save / export — optional layer</h2>
            <p className="mt-2 text-sm text-slate-600">
              Full debrief, benchmark lens, and carousel run locally in your session. Sign in only when you want a durable cloud copy or PDF export.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400"
                placeholder="Work email"
                value={emailInput}
                onChange={(event) => setEmailInput(event.target.value)}
              />
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400"
                placeholder="Password (min 8 chars)"
                value={passwordInput}
                onChange={(event) => setPasswordInput(event.target.value)}
              />
              <input
                name="given-name"
                type="text"
                autoComplete="given-name"
                spellCheck={false}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400"
                placeholder="First name (for new accounts)"
                value={firstNameInput}
                onChange={(event) => setFirstNameInput(event.target.value)}
              />
              <input
                name="family-name"
                type="text"
                autoComplete="family-name"
                spellCheck={false}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400"
                placeholder="Last name (for new accounts)"
                value={lastNameInput}
                onChange={(event) => setLastNameInput(event.target.value)}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              New accounts require first and last name. Existing users can leave those blank when signing in.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  setAuthPromptDismissed(true);
                  setStatusMessage(
                    'Continuing in-session. Sign in anytime from this page to save or export — resume later via Setup → Resume latest saved run.',
                  );
                }}
              >
                Continue as guest
              </button>
              <button
                type="button"
                className="rounded-md bg-slate-900 px-3 py-2 font-semibold text-white hover:bg-slate-800"
                onClick={() => void handleSignIn()}
                disabled={isSigningIn}
              >
                {isSigningIn ? 'Working...' : 'Unlock Save/Export'}
              </button>
            </div>
          </div>
        )}
        {statusMessage && (
          <div className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800" role="status">
            {statusMessage}
          </div>
        )}
        <EnhancedDebrief
          context={context}
          scoreBreakdowns={scoreBreakdowns}
          recommendations={recommendations}
          onExportPDF={handleExportPDF}
          onSaveRun={handleSaveRun}
          saveDisabled={!authSession || isSaving}
          onRestart={handleRestart}
          onShare={handleShare}
        />
      </div>
    </ImmersiveLayout>
  );
}
