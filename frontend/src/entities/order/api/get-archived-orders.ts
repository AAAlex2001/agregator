import { request } from "@/shared/api/request";
import type { OrderListPage, OrdersQuery } from "../model/order-list";

/** Загружает страницу общего архива, доступного авторизованным пользователям. */
export async function getArchivedOrders(query: OrdersQuery): Promise<OrderListPage> {
  const params = new URLSearchParams({
    skip: String(query.skip),
    limit: String(query.limit),
  });
  const response = await request(`/orders/archive?${params}`, {
    errorMessage: "Не удалось загрузить архив",
  });

  return response.json();
}
