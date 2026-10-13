import type { EmailPreferences, UserProfile } from "../model/types";
import { json, send } from "@/source/shared/api/request";

/** Сохранить настройки писем по событиям. */
export async function updateEmailPreferences(preferences: EmailPreferences): Promise<UserProfile> {
  const response = await send(
    "/settings/email-preferences",
    json("PUT", preferences),
    "Не удалось сохранить настройки уведомлений",
  );
  return response.json();
}

/** Сохранить фильтр писем о новых заказах. Пустой список — письма о новых заказах не приходят. */
export async function updateOrderNotifications(orderTypes: string[]): Promise<UserProfile> {
  const response = await send(
    "/settings/order-notifications",
    json("PUT", { order_types: orderTypes }),
    "Не удалось сохранить фильтр уведомлений",
  );
  return response.json();
}

/** Отметить, что пользователь видел окно знакомства с уведомлениями. */
export async function markNotificationsIntroduced(): Promise<void> {
  await send(
    "/settings/notifications-introduced",
    { method: "POST" },
    "Не удалось сохранить отметку об ознакомлении",
  );
}
