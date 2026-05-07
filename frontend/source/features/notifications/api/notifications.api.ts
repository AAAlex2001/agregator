import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import type { NotificationListResponse, NotificationMutationResponse } from "@/source/entities/notification";

const NOTIFICATIONS_API_URL = `${API_URL}/notifications`;

async function parseMutationResponse(response: Response, fallbackMessage: string): Promise<NotificationMutationResponse> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || fallbackMessage);
  }

  return response.json();
}

export async function fetchNotifications(limit = 50): Promise<NotificationListResponse | null> {
  const response = await fetchWithSession(`${NOTIFICATIONS_API_URL}/?limit=${limit}&offset=0`);

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось загрузить уведомления");
  }

  return response.json();
}

export async function markNotificationRead(notificationId: number): Promise<NotificationMutationResponse> {
  const response = await fetchWithSession(`${NOTIFICATIONS_API_URL}/${notificationId}/read`, {
    method: "POST",
  });
  return parseMutationResponse(response, "Не удалось отметить уведомление как прочитанное");
}

export async function markAllNotificationsRead(): Promise<NotificationMutationResponse> {
  const response = await fetchWithSession(`${NOTIFICATIONS_API_URL}/read-all`, {
    method: "POST",
  });
  return parseMutationResponse(response, "Не удалось отметить уведомления как прочитанные");
}

export async function deleteNotification(notificationId: number): Promise<NotificationMutationResponse> {
  const response = await fetchWithSession(`${NOTIFICATIONS_API_URL}/${notificationId}`, {
    method: "DELETE",
  });
  return parseMutationResponse(response, "Не удалось удалить уведомление");
}

export async function deleteAllNotifications(): Promise<NotificationMutationResponse> {
  const response = await fetchWithSession(`${NOTIFICATIONS_API_URL}/`, {
    method: "DELETE",
  });
  return parseMutationResponse(response, "Не удалось удалить уведомления");
}