/** Shared light CRM shell for simulation modals (matches Q2 / strategy dialogs). */
export const SIM_MODAL_DIALOG_BASE =
  'flex max-h-[min(92vh,920px)] w-full flex-col gap-0 overflow-hidden border-slate-200 bg-white p-0 text-slate-950 shadow-xl sm:rounded-xl';

/** Force light card inside modals (global `--card` is dark navy). */
export const SIM_CARD_SURFACE =
  'border-slate-200 bg-white text-slate-950 shadow-sm [&_.text-muted-foreground]:text-slate-600';
