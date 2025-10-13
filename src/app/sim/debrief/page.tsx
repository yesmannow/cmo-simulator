'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ConfettiEffect } from '@/components/simulation/ConfettiEffect';
import { EnhancedDebrief } from '@/components/simulation/EnhancedDebrief';
import { useSimulation } from '@/hooks/useSimulation';

export default function DebriefPage() {
  const router = useRouter();
  const { context, completeDebrief, saveSimulation, restartSimulation } = useSimulation();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    completeDebrief();
  }, [completeDebrief]);

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
      <EnhancedDebrief
        context={context}
        onExportPDF={handleExportPDF}
        onRestart={handleRestart}
        onShare={handleShare}
      />
    </div>
  );
}
