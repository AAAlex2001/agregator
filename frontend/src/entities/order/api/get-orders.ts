import { request } from "@/shared/api/request";
import type { OrderListPage, OrdersQuery } from "../model/order-list";
import { orderPageParams } from "./order-page-params";

/** Загружает очередную страницу заказов с выбранной сортировкой. */
export async function getOrders(query: OrdersQuery): Promise<OrderListPage> {
  const response = await request(`/orders/?${orderPageParams(query)}`, {
    errorMessage: "Не удалось загрузить заказы",
  });

  return response.json();
}
