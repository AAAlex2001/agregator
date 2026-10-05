const STORAGE_KEY = "expert-referral-code";
const CODE_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/** Возвращает UUID приглашения или undefined для некорректного значения. */
export function normalizeReferralCode(value: string | null): string | undefined {
  const code = value?.trim().toLowerCase();
  return code && CODE_PATTERN.test(code) ? code : undefined;
}

/** Сохраняет код до регистрации в текущей вкладке. */
export function saveReferralCode(code: string): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, code);
  } catch {
    // При запрете хранилища код остаётся доступен в адресе приглашения.
  }
}

/** Читает код из текущей ссылки или сохранённого приглашения. */
export function readReferralCode(): string | undefined {
  if (typeof window === "undefined") return undefined;

  const code = new URLSearchParams(window.location.search).get("ref");
  if (code !== null) return normalizeReferralCode(code);

  try {
    return normalizeReferralCode(window.sessionStorage.getItem(STORAGE_KEY));
  } catch {
    return undefined;
  }
}

/** Удаляет сохранённое приглашение после успешной регистрации. */
export function clearReferralCode(): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Недоступное хранилище не мешает завершить регистрацию.
  }
}
