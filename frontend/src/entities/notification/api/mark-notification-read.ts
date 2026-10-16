import { request } from "@/shared/api/request";
import type { NotificationChange } from "../model/types";

/** Отмечает уведомление прочитанным и возвращает новый счётчик. */
export async function markNotificationRead(id: number): Promise<NotificationChange> {
  const response = await request(`/notifications/${id}/read`, {
    method: "POST",
    errorMessage: "Не удалось отметить уведомление",
  });

  return response.json();
}
