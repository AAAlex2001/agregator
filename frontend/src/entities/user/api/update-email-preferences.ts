import { request } from "@/shared/api/request";
import type { EmailPreferences, UserProfile } from "../model/types";

/** Сохраняет полный набор настроек писем по событиям. */
export async function updateEmailPreferences(
  preferences: EmailPreferences,
): Promise<UserProfile> {
  const response = await request("/settings/email-preferences", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preferences),
    errorMessage: "Не удалось сохранить настройки уведомлений",
  });

  return response.json();
}
