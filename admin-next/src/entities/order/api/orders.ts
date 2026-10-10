import { adminFetch } from "@/shared/api";
import type { OrderList, OrderListQuery } from "../model/types";

/** Страница заказов, новые сверху: фильтры по статусу и направлению, поиск по названию и компании. */
export const fetchOrders = async (query: OrderListQuery, limit: number, offset: number): Promise<OrderList> => {
  const params = new URLSearchParams({ limit: String(limit), skip: String(offset) });

  if (query.status) params.set("status", query.status);
  if (query.workType) params.set("work_type", query.workType);
  if (query.query) params.set("q", query.query);

  const response = await adminFetch(`/orders?${params}`);

  return response.json();
};
