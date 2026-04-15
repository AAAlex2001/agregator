import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import type { UserProfile } from "@/source/entities/user";

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
