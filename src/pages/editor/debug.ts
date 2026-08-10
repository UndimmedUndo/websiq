export type DebugKanal =
  | "preview"
  | "storage"
  | "assets"
  | "html"
  | "ai"
  | "autosave"
  | "selection"
  | "ui"
  | string;

const AKTIVERAD = false;

const ENDAST_KANALER: DebugKanal[] = [];

export function debug(kanal: DebugKanal, ...args: unknown[]): void {
  if (!AKTIVERAD) return;
  if (ENDAST_KANALER.length && !ENDAST_KANALER.includes(kanal)) return;
  console.log(`[DEBUG:${kanal}]`, ...args);
}

export function debugError(kanal: DebugKanal, ...args: unknown[]): void {
  console.error(`[DEBUG:${kanal}]`, ...args);
}