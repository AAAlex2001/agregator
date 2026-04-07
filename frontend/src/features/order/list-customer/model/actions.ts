import { fetchCustomerOrders } from "./api";
import { mapOrderToCustomerCard } from "./mappers";
import type { CustomerOrderCardVM } from "./types";

interface LoadOrdersParams {
  pageLimit: number;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setOrders: (orders: CustomerOrderCardVM[]) => void;
  setTotal: (total: number) => void;
}

export async function loadCustomerOrders({
  pageLimit,
  setLoading,
  setError,
  setOrders,
  setTotal,
}: LoadOrdersParams): Promise<void> {
  setLoading(true);
  setError(null);

  try {
    const data = await fetchCustomerOrders(0, pageLimit);
    setOrders(data.items.map(mapOrderToCustomerCard));
    setTotal(data.total);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Не удалось загрузить заказы";
    setError(message);
  } finally {
    setLoading(false);
  }
}
