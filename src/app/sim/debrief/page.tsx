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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <ConfettiEffect trigger={showConfetti} />
      {!authSession && (
        <div className="max-w-5xl mx-auto mb-6 p-4 border border-blue-500/30 rounded-xl bg-blue-950/20">
          <h2 className="font-semibold text-lg mb-2">Unlock Save + Export</h2>
          <p className="text-sm text-blue-100/70 mb-4">
            Keep simulation play open for everyone; require email sign-in for persistence and report exports.
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            <input
              className="px-3 py-2 rounded-md bg-black/20 border border-white/10"
              placeholder="Name (optional)"
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
            />
            <input
              className="px-3 py-2 rounded-md bg-black/20 border border-white/10"
              placeholder="Work email"
              value={emailInput}
              onChange={(event) => setEmailInput(event.target.value)}
            />
            <button
              type="button"
              className="px-3 py-2 rounded-md bg-blue-500 hover:bg-blue-400 font-semibold"
              onClick={handleSignIn}
            >
              Sign In For Save/Export
            </button>
          </div>
        </div>
      )}
      {statusMessage && (
        <div className="max-w-5xl mx-auto mb-4 text-sm text-blue-100/80">{statusMessage}</div>
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
