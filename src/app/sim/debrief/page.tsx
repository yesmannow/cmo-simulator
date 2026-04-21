'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/logger';
import { ConfettiEffect } from '@/components/simulation/ConfettiEffect';
import { EnhancedDebrief } from '@/components/simulation/EnhancedDebrief';
import { useSimulation } from '@/hooks/useSimulation';
import { getSimAuthSession, setSimAuthSession, type SimAuthSession } from '@/lib/simAuth';
import { toPersistedRunPayload } from '@/lib/simulationPersistence';
import { buildTeachingReport, calculateGrade, calculateOverallScore } from '@/lib/simulationInsights';

export default function DebriefPage() {
  const router = useRouter();
  const { context, completeDebrief, restartSimulation } = useSimulation();
  const [showConfetti, setShowConfetti] = useState(false);
  const [authSession, setAuthSession] = useState<SimAuthSession | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    completeDebrief();
    setAuthSession(getSimAuthSession());
  }, [completeDebrief]);

  const requireAuth = (): SimAuthSession | null => {
    const session = getSimAuthSession();
    if (!session) {
      setStatusMessage('Sign in with your email to unlock save/export.');
      return null;
    }
    return session;
  };

  const handleSignIn = () => {
    const email = emailInput.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      setStatusMessage('Enter a valid email to continue.');
      return;
    }

    const session = setSimAuthSession(email, nameInput.trim() || undefined);
    setAuthSession(session);
    setStatusMessage('Save/export access enabled for this browser session.');
  };

  const handleSaveRun = async () => {
    const session = requireAuth();
    if (!session) return;

    setIsSaving(true);
    setStatusMessage(null);
    try {
      const payload = toPersistedRunPayload(context, {
        userId: session.userId,
        email: session.email,
        name: session.name,
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
    } catch (error) {
      logger.error('Error saving simulation run', error);
      setStatusMessage(error instanceof Error ? error.message : 'Unknown save error.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const session = requireAuth();
      if (!session) return;

      const score = calculateOverallScore(context);
      const grade = calculateGrade(score);
      const report = buildTeachingReport(context);

      const content = [
        '# CMO Simulator Debrief Report',
        '',
        `Generated: ${new Date().toISOString()}`,
        `User: ${session.email}`,
        '',
        '## Outcome',
        report.outcome,
        '',
        '## Why',
        report.why,
        '',
        '## Tradeoff',
        report.tradeoff,
        '',
        '## Recommended Next Move',
        report.nextMove,
        '',
        '## Growth Leader Takeaway',
        report.growthLeaderTakeaway,
        '',
        `Overall Score: ${score}`,
        `Grade: ${grade}`,
      ].join('\n');

      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `cmo-simulation-report-${Date.now()}.md`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setStatusMessage('Report exported successfully.');
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
    <div className="space-y-6">
      <ConfettiEffect trigger={showConfetti} />
      {!authSession && (
        <div className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Unlock Save + Export</h2>
          <p className="mt-2 text-sm text-slate-600">
            Keep simulation play open for everyone; require email sign-in for persistence and report exports.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <input
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400"
              placeholder="Name (optional)"
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
            />
            <input
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400"
              placeholder="Work email"
              value={emailInput}
              onChange={(event) => setEmailInput(event.target.value)}
            />
            <button
              type="button"
              className="rounded-md bg-slate-900 px-3 py-2 font-semibold text-white hover:bg-slate-800"
              onClick={handleSignIn}
            >
              Sign In For Save/Export
            </button>
          </div>
        </div>
      )}
      {statusMessage && (
        <div className="mx-auto max-w-5xl text-sm text-slate-700">{statusMessage}</div>
      )}
      <EnhancedDebrief
        context={context}
        onExportPDF={handleExportPDF}
        onSaveRun={handleSaveRun}
        saveDisabled={!authSession || isSaving}
        onRestart={handleRestart}
        onShare={handleShare}
      />
    </div>
  );
}
