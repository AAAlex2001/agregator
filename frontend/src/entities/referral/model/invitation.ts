const REFERRAL_STORAGE_KEY = "expert-referral-code";
const REFERRAL_CODE_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/** Проверяет код приглашения и приводит UUID к формату серверного запроса. */
export function normalizeReferralCode(value: string | null): string | null {
  const code = value?.trim().toLowerCase() ?? "";

  return REFERRAL_CODE_PATTERN.test(code) ? code : null;
}

/** Сохраняет приглашение на время регистрации в текущей вкладке. */
export function saveReferralCode(code: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedCode = normalizeReferralCode(code);

  if (!normalizedCode) {
    return;
  }

  try {
    window.sessionStorage.setItem(REFERRAL_STORAGE_KEY, normalizedCode);
  } catch {
    // Недоступное хранилище не мешает зарегистрироваться.
  }
}

/** Возвращает сохранённое приглашение, если оно доступно и корректно. */
export function readReferralCode(): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    return (
      normalizeReferralCode(window.sessionStorage.getItem(REFERRAL_STORAGE_KEY)) ??
      undefined
    );
  } catch {
    return undefined;
  }
}

/** Удаляет использованное приглашение после регистрации. */
export function clearReferralCode(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.removeItem(REFERRAL_STORAGE_KEY);
  } catch {
    // Очистка недоступного хранилища не влияет на завершённую регистрацию.
  }
}
