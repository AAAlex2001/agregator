import { request } from "@/shared/api/request";
import type { OrderListPage } from "../model/order-list";

/** Ищет заказы по названию работы, организации и коду экспертного требования. */
export async function searchOrders(
  query: string,
  badgeCode: string,
  limit: number,
): Promise<OrderListPage> {
  const params = new URLSearchParams({
    skip: "0",
    limit: String(limit),
  });

  if (query) {
    params.set("q", query);
  }

  if (badgeCode) {
    params.set("badge_code", badgeCode);
  }

  const response = await request(`/orders/search?${params}`, {
    errorMessage: "Не удалось выполнить поиск",
  });

  return response.json();
}
