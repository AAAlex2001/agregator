import { SERVER_API_URL } from "@/source/shared/api/config";
import { send } from "@/source/shared/api/request";
import type { SortDir } from "@/source/shared/ui/SortPills";
import type { OrderDocuments, OrdersApiList, OrderSortBy } from "../model/types";

export interface OrdersPageQuery {
  skip: number;
  limit: number;
  sortBy?: OrderSortBy | null;
  sortDir?: SortDir | null;
}

function pageParams(query: OrdersPageQuery): URLSearchParams {
  const params = new URLSearchParams({ skip: String(query.skip), limit: String(query.limit) });
  if (query.sortBy) params.set("sort_by", query.sortBy);
  if (query.sortDir) params.set("sort_dir", query.sortDir);
  return params;
}

export async function fetchOrders(query: OrdersPageQuery): Promise<OrdersApiList> {
  const response = await send(`/orders/?${pageParams(query)}`, {}, "Не удалось загрузить заказы");
  return response.json();
}

export async function fetchOrdersOnServer(query: OrdersPageQuery): Promise<OrdersApiList> {
  const response = await fetch(`${SERVER_API_URL}/orders/?${pageParams(query)}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Не удалось загрузить заказы: ${response.status}`);
  return response.json();
}

export async function fetchArchivedOrders(query: OrdersPageQuery): Promise<OrdersApiList> {
  const response = await send(`/orders/archive?${pageParams(query)}`, {}, "Не удалось загрузить архив");
  return response.json();
}

export async function searchOrders(query: string, badgeCode: string, limit: number): Promise<OrdersApiList> {
  const params = new URLSearchParams({ skip: "0", limit: String(limit) });
  if (query) params.set("q", query);
  if (badgeCode) params.set("badge_code", badgeCode);
  const response = await send(`/orders/search?${params}`, {}, "Не удалось выполнить поиск");
  return response.json();
}

export interface PublicOrderPreview {
  id: number;
  title: string;
  company: string | null;
  start_date?: string;
  date: string;
  sum: string;
  responses_deadline: string | null;
  badges: { text: string; variant: string }[];
  comment: string;
  documents: OrderDocuments;
}

export async function fetchPublicOrder(uuid: string, options: { server?: boolean } = {}): Promise<PublicOrderPreview> {
  const response = options.server
    ? await fetch(`${SERVER_API_URL}/orders/public/${uuid}`, { cache: "no-store" })
    : await send(`/orders/public/${uuid}`, {}, "Заказ не найден");
  if (!response.ok) throw new Error("Заказ не найден");
  return response.json();
}

export async function deleteOrder(id: number): Promise<void> {
  await send(`/orders/${id}`, { method: "DELETE" }, "Не удалось удалить заказ");
}
