import { request } from "@/shared/api/request";
import type { OrderListItem } from "../model/order-list-item";

/** Загружает заказ, доступный текущему аккаунту. */
export async function getOrder(orderId: number): Promise<OrderListItem> {
  const response = await request(`/orders/${orderId}`, {
    errorMessage: "Заказ не найден",
  });

  return response.json();
}
