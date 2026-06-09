import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import type { OrdersApiList } from "@/source/entities/order";

export async function fetchArchivedOrders(skip = 0, limit = 50): Promise<OrdersApiList> {
  const res = await fetchWithSession(`${API_URL}/orders/archive?skip=${skip}&limit=${limit}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = typeof body.detail === "string" ? body.detail : `HTTP ${res.status}`;
    throw new Error(message);
  }
  return res.json();
}
