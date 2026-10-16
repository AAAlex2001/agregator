import type { OrderListItem } from "./order-list-item";

/** Найденные заказы и состояние загрузки подсказок для непустого запроса. */
export interface OrderSearchSuggestions {
  items: OrderListItem[];
  isLoading: boolean;
  hasQuery: boolean;
}
