const STORAGE_KEY = "expert-referral-code";
const CODE_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/** Код приглашения из ссылки или null, если он битый: бэкенд не примет регистрацию с таким кодом. */
export function normalizeReferralCode(value: string | null): string | null {
  const code = value?.trim().toLowerCase() ?? "";
  return CODE_PATTERN.test(code) ? code : null;
}

/** Запомнить код приглашения до конца регистрации в этой вкладке. */
export function saveReferralCode(code: string): void {
  sessionStorage.setItem(STORAGE_KEY, code);
}

/** Код приглашения, сохранённый на странице /register. */
export function readReferralCode(): string | undefined {
  return sessionStorage.getItem(STORAGE_KEY) ?? undefined;
}

/** Забыть код приглашения. */
export function clearReferralCode(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
