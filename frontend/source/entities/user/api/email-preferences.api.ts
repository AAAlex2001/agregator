import { fetchWithSession } from "@/source/shared/api/session";
import type { UserProfile } from "@/source/entities/user";
import type { UpdateEmailPreferencesPayload } from "@/source/entities/user/model/email-preferences";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function updateEmailPreferences(
  payload: UpdateEmailPreferencesPayload,
): Promise<UserProfile> {
  const res = await fetchWithSession(`${API_URL}/settings/email-preferences`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось сохранить настройки уведомлений");
  }
  return res.json();
}

export async function updateOrderNotifications(orderTypes: string[]): Promise<UserProfile> {
  const res = await fetchWithSession(`${API_URL}/settings/order-notifications`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_types: orderTypes }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось сохранить фильтр уведомлений");
  }
  return res.json();
}
