import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
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
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось загрузить сессию");
  }

  return res.json();
}

export async function fetchAvailableRoles(): Promise<AvailableRole[]> {
  const res = await fetchWithSession(`${API_URL}/login/available-roles`);
  if (res.status === 401) {
    return [];
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось получить список ролей");
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
    const body = await res.json().catch(() => null);
    const detail = body?.detail;
    if (typeof detail === "string") {
      throw new Error(detail);
    }
    if (detail && typeof detail === "object" && typeof detail.message === "string") {
      throw new Error(detail.message);
    }
    throw new Error("Не удалось переключить роль");
  }
}
