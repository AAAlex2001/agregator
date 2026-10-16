import { request } from "@/shared/api/request";
import { EXPERT_HISTORY_PAGE_SIZE } from "../model/order-list";
import type { OrderListPage, OrdersQuery } from "../model/order-list";

/** Загружает страницу заказов, которые исполнитель выполнил и которые уже в архиве. */
export async function getExpertOrdersHistory(
  expertPublicId: string,
  query: OrdersQuery,
): Promise<OrderListPage> {
  const params = new URLSearchParams({
    skip: String(query.skip),
    limit: String(EXPERT_HISTORY_PAGE_SIZE),
  });
  const response = await request(`/experts/${expertPublicId}/orders?${params}`, {
    errorMessage: "Не удалось загрузить историю заказов",
  });

  return response.json();
}
