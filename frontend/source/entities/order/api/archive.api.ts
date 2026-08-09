import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import type { OrdersApiList } from "@/source/entities/order";

export async function fetchArchivedOrders(skip = 0, limit = 50): Promise<OrdersApiList> {
  const res = await fetchWithSession(`${API_URL}/orders/archive?skip=${skip}&limit=${limit}`);
  if (!res.ok) {
    throw new Error(await readErrorMessage(res, `HTTP ${res.status}`));
  }
  return res.json();
}
