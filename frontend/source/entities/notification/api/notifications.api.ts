import { send } from "@/source/shared/api/request";
import type { NotificationListResponse, NotificationMutationResponse } from "../model/types";

/** Страница уведомлений пользователя, новые первыми. */
export async function fetchNotifications(limit: number, offset: number): Promise<NotificationListResponse> {
  const response = await send(`/notifications/?limit=${limit}&offset=${offset}`, {}, "Не удалось загрузить уведомления");
  return response.json();
}

/** Сколько уведомлений не прочитано — для бейджа в меню. */
export async function fetchUnreadCount(): Promise<number> {
  const response = await send("/notifications/?limit=1&offset=0", {}, "Не удалось загрузить уведомления");
  const data: NotificationListResponse = await response.json();
  return data.unread_count;
}

/** Отметить уведомление прочитанным. */
export async function markNotificationRead(id: number): Promise<NotificationMutationResponse> {
  const response = await send(`/notifications/${id}/read`, { method: "POST" }, "Не удалось отметить уведомление");
  return response.json();
}

/** Отметить все уведомления прочитанными. */
export async function markAllNotificationsRead(): Promise<NotificationMutationResponse> {
  const response = await send("/notifications/read-all", { method: "POST" }, "Не удалось отметить уведомления");
  return response.json();
}

/** Удалить уведомление. */
export async function deleteNotification(id: number): Promise<NotificationMutationResponse> {
  const response = await send(`/notifications/${id}`, { method: "DELETE" }, "Не удалось удалить уведомление");
  return response.json();
}

/** Удалить все уведомления. */
export async function deleteAllNotifications(): Promise<NotificationMutationResponse> {
  const response = await send("/notifications/", { method: "DELETE" }, "Не удалось удалить уведомления");
  return response.json();
}
