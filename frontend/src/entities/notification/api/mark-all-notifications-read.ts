import { request } from "@/shared/api/request";
import type { NotificationChange } from "../model/types";

/** Отмечает все уведомления прочитанными и возвращает новый счётчик. */
export async function markAllNotificationsRead(): Promise<NotificationChange> {
  const response = await request("/notifications/read-all", {
    method: "POST",
    errorMessage: "Не удалось отметить уведомления",
  });

  return response.json();
}
