'use client';

import * as React from 'react';
import { Drawer } from 'vaul';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

function updateOverlayState(open: boolean) {
  if (typeof document === 'undefined') return;
  document.body.dataset.mobileOverlay = open ? 'open' : 'closed';
}

export function MobileSheet({
  open,
  onOpenChange,
  children,
}: React.ComponentProps<typeof Drawer.Root>) {
  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      updateOverlayState(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange],
  );

  return (
    <Drawer.Root shouldScaleBackground={false} open={open} onOpenChange={handleOpenChange}>
      {children}
    </Drawer.Root>
  );
}

export const MobileSheetTrigger = Drawer.Trigger;
export const MobileSheetPortal = Drawer.Portal;
export const MobileSheetClose = Drawer.Close;

export function MobileSheetContent({
  className,
  children,
}: React.ComponentProps<typeof Drawer.Content>) {
  return (
    <Drawer.Portal>
      <Drawer.Overlay className="fixed inset-0 z-[70] bg-slate-950/38 backdrop-blur-[1px]" />
      <Drawer.Content
        className={cn(
          'fixed inset-x-0 bottom-0 z-[80] mt-24 rounded-t-[28px] border border-slate-200 bg-white text-slate-950 shadow-[0_-18px_60px_rgba(15,23,42,0.18)] outline-none',
          className,
        )}
      >
        <div className="mx-auto mt-3 h-1.5 w-14 rounded-full bg-slate-200" />
        {children}
      </Drawer.Content>
    </Drawer.Portal>
  );
}

export function MobileSheetHeader({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-start justify-between gap-4 px-5 pb-4 pt-5', className)}>{children}</div>;
}

export function MobileSheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof Drawer.Title>) {
  return <Drawer.Title className={cn('text-base font-semibold tracking-tight text-slate-950', className)} {...props} />;
}

export function MobileSheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof Drawer.Description>) {
  return <Drawer.Description className={cn('mt-1 text-sm leading-6 text-slate-600', className)} {...props} />;
}

export function MobileSheetDismissButton({ className }: { className?: string }) {
  return (
    <Drawer.Close
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700',
        className,
      )}
      aria-label="Close sheet"
    >
      <X className="h-4 w-4" />
    </Drawer.Close>
  );
}
