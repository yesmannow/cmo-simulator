'use client';

import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

type ConfettiOptions = Parameters<typeof confetti>[0];

interface ConfettiEffectProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function ConfettiEffect({ trigger, onComplete }: ConfettiEffectProps) {
  const fireConfetti = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        onComplete?.();
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      // Fire confetti from different positions
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }, [onComplete]);

  useEffect(() => {
    if (trigger) {
      fireConfetti();
    }
  }, [trigger, fireConfetti]);

  return null;
}

// Success celebration for good performance
export function SuccessConfetti({ trigger, onComplete }: ConfettiEffectProps) {
  const fireSuccess = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#059669', '#047857']
    });
    
    setTimeout(() => {
      onComplete?.();
    }, 1000);
  }, [onComplete]);

  useEffect(() => {
    if (trigger) {
      fireSuccess();
    }
  }, [trigger, fireSuccess]);

  return null;
}

// Milestone celebration for quarter completion
export function MilestoneConfetti({ trigger, onComplete }: ConfettiEffectProps) {
  const fireMilestone = useCallback(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio: number, opts: ConfettiOptions = {}) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });

    setTimeout(() => {
      onComplete?.();
    }, 2000);
  }, [onComplete]);

  useEffect(() => {
    if (trigger) {
      fireMilestone();
    }
  }, [trigger, fireMilestone]);

  return null;
}
