type HapticNotify = "success" | "warning" | "error";
type ImpactStyle = "light" | "medium" | "heavy" | "rigid" | "soft";

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  colorScheme: "light" | "dark";
  initData: string;
  initDataUnsafe?: { user?: { id?: number }; start_param?: string };
  onEvent?: (event: string, cb: () => void) => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  openLink?: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink?: (url: string) => void;
  HapticFeedback?: {
    impactOccurred: (style: ImpactStyle) => void;
    notificationOccurred: (type: HapticNotify) => void;
    selectionChanged: () => void;
  };
  BackButton?: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
}

const tg: TelegramWebApp | undefined =
  typeof window !== "undefined"
    ? (window as unknown as { Telegram?: { WebApp?: TelegramWebApp } }).Telegram?.WebApp
    : undefined;

export const isTelegram = Boolean(tg?.initDataUnsafe?.user?.id);

const HAPTIC_KEY = "rp_haptic";
const THEME_KEY = "rp_theme";

export type ThemePref = "light" | "dark" | "auto";

export function hapticEnabled(): boolean {
  return localStorage.getItem(HAPTIC_KEY) !== "off";
}

export function setHapticEnabled(on: boolean): void {
  localStorage.setItem(HAPTIC_KEY, on ? "on" : "off");
}

export function getThemePref(): ThemePref {
  const saved = localStorage.getItem(THEME_KEY);
  return saved === "light" || saved === "dark" ? saved : "auto";
}

export function setThemePref(pref: ThemePref): void {
  localStorage.setItem(THEME_KEY, pref);
  applyTheme();
}

function resolveTheme(): "light" | "dark" {
  const pref = getThemePref();
  return pref === "auto" ? tg?.colorScheme ?? "light" : pref;
}

export function isDarkTheme(): boolean {
  return resolveTheme() === "dark";
}

function headerHex(): string {
  return resolveTheme() === "dark" ? "#0d0e14" : "#ffffff";
}

function applyTheme(): void {
  document.documentElement.dataset.theme = resolveTheme();
  const bg = headerHex();
  tg?.setBackgroundColor?.(bg);
  tg?.setHeaderColor?.(bg);
}

export function initTelegram(): void {
  if (tg) {
    tg.ready();
    tg.expand();
    tg.onEvent?.("themeChanged", applyTheme);
  }
  applyTheme();
}

export function notifyHaptic(type: HapticNotify): void {
  if (hapticEnabled()) tg?.HapticFeedback?.notificationOccurred(type);
}

export function tapHaptic(): void {
  if (hapticEnabled()) tg?.HapticFeedback?.impactOccurred("light");
}

export function openLink(url: string): void {
  if (tg?.openLink) tg.openLink(url);
  else window.open(url, "_blank");
}

export function getInitData(): string {
  return tg?.initData ?? "";
}

export function getStartParam(): string {
  return tg?.initDataUnsafe?.start_param ?? "";
}

export function shareToChat(url: string, text: string): void {
  const share = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  if (tg?.openTelegramLink) tg.openTelegramLink(share);
  else window.open(share, "_blank");
}

let backHandler: (() => void) | null = null;

export function showBackButton(handler: () => void): void {
  const bb = tg?.BackButton;
  if (!bb) return;
  if (backHandler) bb.offClick(backHandler);
  backHandler = handler;
  bb.onClick(handler);
  bb.show();
}

export function hideBackButton(): void {
  const bb = tg?.BackButton;
  if (!bb) return;
  if (backHandler) {
    bb.offClick(backHandler);
    backHandler = null;
  }
  bb.hide();
}
