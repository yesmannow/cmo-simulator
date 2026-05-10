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
import {
  formatAuthErrorMessage,
  getSimAuthSession,
  signInSimAuth,
  signUpSimAuth,
  type SimAuthSession,
} from '@/lib/simAuth';
import { toPersistedRunPayload } from '@/lib/simulationPersistence';
import { buildSimulationDebriefReport } from '@/lib/simulationReport';
import { recordSimulationEvent } from '@/lib/simulationTelemetry';

export default function DebriefPage() {
  const router = useRouter();
  const { context, completeDebrief, restartSimulation } = useSimulation();
  const [showConfetti, setShowConfetti] = useState(false);
  const [authSession, setAuthSession] = useState<SimAuthSession | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authPromptDismissed, setAuthPromptDismissed] = useState(false);
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

  const requireAuth = async (): Promise<SimAuthSession | null> => {
    const session = await getSimAuthSession();
    if (!session) {
      setStatusMessage('Sign in with your email to unlock save/export.');
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
      setStatusMessage('Signed in. Save/export access enabled.');
    } catch {
      try {
        await signUpSimAuth(email, passwordInput);
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
      const payload = toPersistedRunPayload(context, {
        userId: session.userId,
        email: session.email,
      });

      const response = await fetch('/api/simulations/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error || 'Failed to save simulation run.');
      }

      setStatusMessage('Run saved to Supabase successfully.');
      void recordSimulationEvent({
        runId: context.simulationId ?? '',
        eventType: 'debrief_saved',
        phase: 'debrief',
        payload: {
          overallScore: payload.overallScore,
          grade: payload.grade,
        },
      });
    } catch (error) {
      logger.error('Error saving simulation run', error);
      setStatusMessage(error instanceof Error ? error.message : 'Unknown save error.');
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
      setStatusMessage('PDF report exported successfully.');
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

  return (
    <ImmersiveLayout
      title="Debrief"
      quarter="CRM View"
      subtitle="Executive review: what worked, what didn’t, and what to adjust in the next run. Save/export is optional."
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <ConfettiEffect trigger={showConfetti} />
        {!authSession && !authPromptDismissed && (
          <div className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Save and export are optional</h2>
            <p className="mt-2 text-sm text-slate-600">
              Continue as guest with full debrief access. Sign in only when you want to save runs or export reports.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400"
                placeholder="Work email"
                value={emailInput}
                onChange={(event) => setEmailInput(event.target.value)}
              />
              <input
                type="password"
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400"
                placeholder="Password (min 8 chars)"
                value={passwordInput}
                onChange={(event) => setPasswordInput(event.target.value)}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  setAuthPromptDismissed(true);
                  setStatusMessage('Continuing as guest. Sign in anytime to unlock save/export.');
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
          <div className="mx-auto max-w-5xl text-sm text-slate-700">{statusMessage}</div>
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
