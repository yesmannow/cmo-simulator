'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, PlusSquare, Share2, Smartphone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  MobileSheet,
  MobileSheetContent,
  MobileSheetDescription,
  MobileSheetDismissButton,
  MobileSheetHeader,
  MobileSheetTitle,
} from '@/components/ui/mobile-sheet';
import { usePwaInstall } from '@/hooks/usePwaInstall';
import { cn } from '@/lib/utils';

export function MobileInstallPrompt({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { canInstall, isIOS, isStandalone, isInstallSupported, promptInstall } = usePwaInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  const shouldRender = useMemo(() => canInstall && !isStandalone && !dismissed, [canInstall, dismissed, isStandalone]);

  if (!shouldRender) return null;

  const handleInstall = async () => {
    if (isInstallSupported) {
      await promptInstall();
      return;
    }
    if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'flex items-center justify-between gap-3 rounded-full border border-slate-200 bg-white/92 px-3 py-2 text-slate-950 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur',
          compact ? 'pl-3 pr-2' : 'p-3',
          className,
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white">
            <Smartphone className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Install</p>
            <p className="truncate text-sm font-semibold text-slate-950">
              {isInstallSupported ? 'Add CMO Simulator to your home screen' : 'Open the app from your home screen'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            className="rounded-full bg-slate-950 px-3 text-white hover:bg-slate-800"
            onClick={() => void handleInstall()}
          >
            <Download className="h-4 w-4" />
            {!compact && <span>Install</span>}
          </Button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss install prompt"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      <MobileSheet open={showIOSGuide} onOpenChange={setShowIOSGuide}>
        <MobileSheetContent className="max-h-[82vh]">
          <MobileSheetHeader>
            <div>
              <MobileSheetTitle>Add To Home Screen</MobileSheetTitle>
              <MobileSheetDescription>
                Safari on iPhone installs PWAs from the share menu. Once added, CMO Simulator launches without browser chrome.
              </MobileSheetDescription>
            </div>
            <MobileSheetDismissButton />
          </MobileSheetHeader>
          <div className="space-y-4 px-5 pb-[calc(env(safe-area-inset-bottom)+20px)]">
            <InstructionStep
              icon={Share2}
              title="1. Tap Share"
              text="Use Safari’s share button at the bottom of the screen."
            />
            <InstructionStep
              icon={PlusSquare}
              title="2. Choose Add to Home Screen"
              text="Scroll the action list if the option is not visible immediately."
            />
            <InstructionStep
              icon={Smartphone}
              title="3. Launch it like an app"
              text="The simulator will reopen in standalone mode with the mobile navigation shell."
            />
          </div>
        </MobileSheetContent>
      </MobileSheet>
    </>
  );
}

function InstructionStep({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Smartphone;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
        </div>
      </div>
    </div>
  );
}
