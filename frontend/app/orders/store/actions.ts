import { fetchOrders } from "./api";
import { mapOrderToCardViewModel } from "./mappers";

export async function loadOrders(
  skip = 0,
  limit = 50,
  onSuccess?: (payload: { itemsCount: number; total: number; items: ReturnType<typeof mapOrderToCardViewModel>[] }) => void,
  onError?: (message: string) => void
): Promise<void> {
  try {
    const response = await fetchOrders(skip, limit);
    const mappedItems = response.items.map(mapOrderToCardViewModel);

    onSuccess?.({
      itemsCount: mappedItems.length,
      total: response.total,
      items: mappedItems,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Произошла ошибка при загрузке заказов";
    onError?.(message);
    throw error;
  }
}
