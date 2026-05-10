import { API_URL } from "@/source/shared/api/config";
import type { OrdersApiList } from "../model/types";

export async function searchOrdersPublic(
  query: string,
  skip = 0,
  limit = 20,
): Promise<OrdersApiList> {
  const url = `${API_URL}/orders/search?q=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось выполнить поиск");
  }
  return res.json();
}
