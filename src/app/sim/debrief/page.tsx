'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ConfettiEffect } from '@/components/simulation/ConfettiEffect';
import { EnhancedDebrief } from '@/components/simulation/EnhancedDebrief';
import { useSimulation } from '@/hooks/useSimulation';
import { Button } from '@/components/ui/button';
import { persistSimulationAndSubmit } from '@/lib/simulation/persistence';

export default function DebriefPage() {
  const router = useRouter();
  const { context, completeDebrief, restartSimulation } = useSimulation();
  const [showConfetti, setShowConfetti] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const submissionAttemptedRef = useRef(false);

  useEffect(() => {
    setShowConfetti(true);
    completeDebrief();
  }, [completeDebrief]);

  const submitResults = useCallback(async () => {
    if (!context.finalResults) return;

    submissionAttemptedRef.current = true;
    setSubmissionStatus('submitting');
    setSubmissionMessage('');

    try {
      const result = await persistSimulationAndSubmit(context);

      if (result.success) {
        const summary = result.leaderboardEntry
          ? `Saved! Leaderboard score ${result.leaderboardEntry.final_score} (${result.leaderboardEntry.grade}).`
          : 'Simulation saved successfully.';

        setSubmissionStatus('success');
        setSubmissionMessage(summary);
      } else {
        setSubmissionStatus('error');
        setSubmissionMessage(result.error);
      }
    } catch (error) {
      console.error('Error submitting simulation results:', error);
      setSubmissionStatus('error');
      setSubmissionMessage('We ran into an unexpected problem while saving your results.');
    }
  }, [context]);

  useEffect(() => {
    if (!context.finalResults || submissionAttemptedRef.current) {
      return;
    }

    void submitResults();
  }, [context.finalResults, submitResults]);

  const handleExportPDF = async () => {
    try {
      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `cmo-simulation-report-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
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
      {submissionStatus === 'submitting' && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
          Saving your simulation and updating the leaderboard...
        </div>
      )}
      {submissionStatus === 'success' && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {submissionMessage}
        </div>
      )}
      {submissionStatus === 'error' && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <span>{submissionMessage}</span>
            <Button variant="secondary" onClick={() => void submitResults()} className="self-start md:self-auto">
              Try again
            </Button>
          </div>
        </div>
      )}
      <EnhancedDebrief
        context={context}
        onExportPDF={handleExportPDF}
        onRestart={handleRestart}
        onShare={handleShare}
      />
    </div>
  );
}
