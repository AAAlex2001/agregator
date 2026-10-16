import { request } from "@/shared/api/request";
import type { UserProfile } from "../model/types";

/** Отмечает знакомство с почтовыми уведомлениями и возвращает обновлённый профиль. */
export async function markNotificationsIntroduced(): Promise<UserProfile> {
  const response = await request("/settings/notifications-introduced", {
    method: "POST",
    errorMessage: "Не удалось сохранить отметку об ознакомлении",
  });

  return response.json();
}
