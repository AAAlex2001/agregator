import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";

export async function markNotificationsIntroduced(): Promise<void> {
  const response = await fetchWithSession(`${API_URL}/settings/notifications-introduced`, {
    method: "POST",
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось сохранить отметку об ознакомлении");
  }
}
