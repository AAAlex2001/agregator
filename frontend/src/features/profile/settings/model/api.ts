import { fetchWithSessionRefresh } from "@/shared/lib/sessionAuth";
import type { UserProfile, UpdateProfilePayload } from "./types";

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "/api";
}

export async function fetchProfile(): Promise<UserProfile> {
  const apiBaseUrl = getApiBaseUrl();

  const response = await fetchWithSessionRefresh(`${apiBaseUrl}/settings/profile`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Не удалось загрузить профиль");
  }

  return response.json();
}

export async function updateProfile(data: UpdateProfilePayload): Promise<UserProfile> {
  const apiBaseUrl = getApiBaseUrl();

  const response = await fetchWithSessionRefresh(`${apiBaseUrl}/settings/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось сохранить данные");
  }

  return response.json();
}

export async function changePassword(
  newPassword: string,
  newPasswordConfirm: string,
): Promise<void> {
  const apiBaseUrl = getApiBaseUrl();

  const response = await fetchWithSessionRefresh(`${apiBaseUrl}/settings/password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось сменить пароль");
  }
}
