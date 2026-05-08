import { fetchWithSession } from "@/source/shared/api/session";
import type { UserProfile } from "@/source/entities/user";
import { stableMultipartFetch } from "@/shared/lib/stableMultipartFetch";
import type { UpdateProfilePayload } from "../model/profilePayload";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function logout(): Promise<void> {
  try {
    await fetch(`${API_URL}/login/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
  }
}

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

export async function uploadAvatar(file: File): Promise<UserProfile> {
  const res = await stableMultipartFetch({
    input: `${API_URL}/settings/avatar`,
    method: "POST",
    files: [file],
    buildBody: (files) => {
      const formData = new FormData();

      if (files[0]) {
        formData.append("file", files[0]);
      }

      return formData;
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось загрузить фото");
  }

  return res.json();
}
