import { request } from "@/shared/api/request";
import type { UserProfile } from "../model/types";

/** Сохраняет виды новых заказов для рассылки; пустой список отключает эти письма. */
export async function updateOrderNotifications(
  orderTypes: string[],
): Promise<UserProfile> {
  const response = await request("/settings/order-notifications", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      order_types: orderTypes,
    }),
    errorMessage: "Не удалось сохранить фильтр уведомлений",
  });

  return response.json();
}
