import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import type { UserProfile } from "@/source/entities/user";

export type SessionRoleValue = "CUSTOMER" | "EXPERT" | "LICENSE_HOLDER";

export interface AvailableRole {
  role: SessionRoleValue;
  email_verified: boolean;
}

export async function fetchSessionUser(): Promise<UserProfile | null> {
  const res = await fetchWithSession(`${API_URL}/settings/profile`);

  if (res.status === 401) {
    return null;
  }

  if (!res.ok) {
    throw new Error(await readErrorMessage(res, "Не удалось загрузить сессию"));
  }

  return res.json();
}

export async function fetchAvailableRoles(): Promise<AvailableRole[]> {
  const res = await fetchWithSession(`${API_URL}/login/available-roles`);
  if (res.status === 401) {
    return [];
  }
  if (!res.ok) {
    throw new Error(await readErrorMessage(res, "Не удалось получить список ролей"));
  }
  const data = (await res.json()) as { roles: AvailableRole[] };
  return data.roles;
}

export async function switchSessionRole(role: SessionRoleValue, password: string): Promise<void> {
  const res = await fetchWithSession(`${API_URL}/login/switch-role`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, password }),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res, "Не удалось переключить роль"));
  }
}
