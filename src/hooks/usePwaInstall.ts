'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

function isStandaloneMode() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches || Boolean(window.navigator.standalone);
}

export function usePwaInstall() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInstallSupported, setIsInstallSupported] = useState(false);

  useEffect(() => {
    setIsStandalone(isStandaloneMode());

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
      setIsInstallSupported(true);
    };

    const handleInstalled = () => {
      setPromptEvent(null);
      setIsStandalone(true);
      setIsInstallSupported(false);
    };

    const media = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => {
      setIsStandalone(isStandaloneMode());
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);
    media.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
      media.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  const isIOS = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }, []);

  const canInstall = !isStandalone && (Boolean(promptEvent) || isIOS);

  const promptInstall = useCallback(async () => {
    if (!promptEvent) return false;

    await promptEvent.prompt();
    const result = await promptEvent.userChoice;
    if (result.outcome === 'accepted') {
      setPromptEvent(null);
      setIsInstallSupported(false);
      return true;
    }
    return false;
  }, [promptEvent]);

  return {
    canInstall,
    isIOS,
    isStandalone,
    isInstallSupported,
    promptInstall,
  };
}
