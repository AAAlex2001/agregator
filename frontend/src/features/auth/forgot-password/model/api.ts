import { fetchWithSessionRefresh } from "@/shared/lib/sessionAuth";

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "/api";
}

export async function requestPasswordReset(email: string): Promise<void> {
  const response = await fetchWithSessionRefresh(`${getApiBaseUrl()}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось отправить код");
  }
}

export async function confirmResetCode(email: string, code: string): Promise<void> {
  const response = await fetchWithSessionRefresh(`${getApiBaseUrl()}/auth/confirm-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || "Неверный код");
  }
}

export async function resetPassword(email: string, code: string, password: string): Promise<void> {
  const response = await fetchWithSessionRefresh(`${getApiBaseUrl()}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, new_password: password }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось сменить пароль");
  }
}
