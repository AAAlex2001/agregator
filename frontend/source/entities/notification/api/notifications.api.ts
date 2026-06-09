import { API_URL } from "@/source/shared/api/config";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import { fetchWithSession } from "@/source/shared/api/session";
import type { NotificationListResponse, NotificationMutationResponse } from "../model/types";

const NOTIFICATIONS_API_URL = `${API_URL}/notifications`;

export async function fetchNotifications(limit = 50, offset = 0): Promise<NotificationListResponse | null> {
  const response = await fetchWithSession(`${NOTIFICATIONS_API_URL}/?limit=${limit}&offset=${offset}`);

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось загрузить уведомления"));
  }

  return response.json();
}

export async function markNotificationRead(notificationId: number): Promise<NotificationMutationResponse> {
  const response = await fetchWithSession(`${NOTIFICATIONS_API_URL}/${notificationId}/read`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось отметить уведомление как прочитанное"));
  }
  return response.json();
}

export async function markAllNotificationsRead(): Promise<NotificationMutationResponse> {
  const response = await fetchWithSession(`${NOTIFICATIONS_API_URL}/read-all`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось отметить уведомления как прочитанные"));
  }
  return response.json();
}

export async function deleteNotification(notificationId: number): Promise<NotificationMutationResponse> {
  const response = await fetchWithSession(`${NOTIFICATIONS_API_URL}/${notificationId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось удалить уведомление"));
  }
  return response.json();
}

export async function deleteAllNotifications(): Promise<NotificationMutationResponse> {
  const response = await fetchWithSession(`${NOTIFICATIONS_API_URL}/`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось удалить уведомления"));
  }
  return response.json();
}
