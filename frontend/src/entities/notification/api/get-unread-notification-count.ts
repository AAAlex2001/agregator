import { request } from "@/shared/api/request";

/** Ответ сервера, из которого нужен только счётчик непрочитанных. */
interface UnreadCountResponse {
  unread_count: number;
}

/** Узнаёт число непрочитанных уведомлений для бейджа в меню. */
export async function getUnreadNotificationCount(): Promise<number> {
  const response = await request("/notifications/?limit=1&offset=0", {
    errorMessage: "Не удалось загрузить уведомления",
  });
  const data: UnreadCountResponse = await response.json();

  return data.unread_count;
}
