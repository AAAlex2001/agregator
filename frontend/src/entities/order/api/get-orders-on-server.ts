import { SERVER_API_URL } from "@/shared/config/server-api";
import type { OrderListPage, OrdersQuery } from "../model/order-list";
import { orderPageParams } from "./order-page-params";

/** Загружает первую страницу публичного списка без серверного кеширования. */
export async function getOrdersOnServer(
  query: OrdersQuery,
): Promise<OrderListPage> {
  const response = await fetch(`${SERVER_API_URL}/orders/?${orderPageParams(query)}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить заказы: ${response.status}`);
  }

  return response.json();
}
