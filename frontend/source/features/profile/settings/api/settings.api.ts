import { fetchWithSession } from "@/source/shared/api/session";
import type { UserProfile, UpdateProfilePayload } from "../model/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function fetchProfile(): Promise<UserProfile> {
  const res = await fetchWithSession(`${API_URL}/settings/profile`);
  if (!res.ok) throw new Error("Не удалось загрузить профиль");
  return res.json();
}

export async function updateProfile(data: UpdateProfilePayload): Promise<UserProfile> {
  const res = await fetchWithSession(`${API_URL}/settings/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось сохранить данные");
  }
  return res.json();
}

export async function changePassword(
  newPassword: string,
  newPasswordConfirm: string,
): Promise<void> {
  const res = await fetchWithSession(`${API_URL}/settings/password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось сменить пароль");
  }
}
