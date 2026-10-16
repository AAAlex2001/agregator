import { request } from "@/shared/api/request";
import type { NotificationPage } from "../model/types";

/** Загружает страницу уведомлений, новые первыми. */
export async function getNotifications(
  limit: number,
  offset: number,
): Promise<NotificationPage> {
  const response = await request(`/notifications/?limit=${limit}&offset=${offset}`, {
    errorMessage: "Не удалось загрузить уведомления",
  });

  return response.json();
}
