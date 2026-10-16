import { request } from "@/shared/api/request";
import type { OrderListPage, OrdersQuery } from "../model/order-list";

/** Загружает страницу завершённых тендеров заказчика, по которым есть PDF-отчёт. */
export async function getReports(query: OrdersQuery): Promise<OrderListPage> {
  const params = new URLSearchParams({
    skip: String(query.skip),
    limit: String(query.limit),
  });
  const response = await request(`/reports/?${params}`, {
    errorMessage: "Не удалось загрузить отчёты",
  });

  return response.json();
}
