export type SaveSyncState = "idle" | "saving" | "saved" | "error" | "offline";

export type SaveSyncEventDetail = {
  state: SaveSyncState;
  message?: string;
  at: string;
};

export const SAVE_SYNC_EVENT = "cmo-sim-save-sync";

export function dispatchSaveSync(detail: SaveSyncEventDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SAVE_SYNC_EVENT, { detail }));
}

export function isBrowserOffline(): boolean {
  return typeof navigator !== "undefined" && navigator.onLine === false;
}
