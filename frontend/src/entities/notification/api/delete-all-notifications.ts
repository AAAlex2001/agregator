import { request } from "@/shared/api/request";

/** Удаляет все уведомления текущего пользователя. */
export async function deleteAllNotifications(): Promise<void> {
  await request("/notifications/", {
    method: "DELETE",
    errorMessage: "Не удалось удалить уведомления",
  });
}
