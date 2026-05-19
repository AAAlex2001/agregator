import "server-only";

import { SERVER_API_URL } from "@/source/shared/api/config";
import type { OrdersApiList } from "../model/types";

export async function fetchPublicOrdersServer(skip = 0, limit = 50): Promise<OrdersApiList> {
  const res = await fetch(`${SERVER_API_URL}/orders/?skip=${skip}&limit=${limit}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Не удалось загрузить заказы: ${res.status}`);
  return res.json();
}
