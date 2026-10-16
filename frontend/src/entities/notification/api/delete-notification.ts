import { request } from "@/shared/api/request";
import type { NotificationChange } from "../model/types";

/** Удаляет уведомление и возвращает новый счётчик непрочитанных. */
export async function deleteNotification(id: number): Promise<NotificationChange> {
  const response = await request(`/notifications/${id}`, {
    method: "DELETE",
    errorMessage: "Не удалось удалить уведомление",
  });

  return response.json();
}
