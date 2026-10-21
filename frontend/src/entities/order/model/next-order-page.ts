import { useOrderListContext } from "./order-list-context";
import type { OrderListState } from "./order-list-state";

/** Номер следующей страницы для ссылки «Загрузить ещё», или null, если ссылки нет. */
export function getNextOrderPage(state: OrderListState, pageSize: number): number | null {
  if (!state.hasMore || state.sort.field !== null) {
    return null;
  }

  return Math.floor((state.offset + state.items.length) / pageSize) + 1;
}

/** Номер следующей страницы текущего списка для ссылки «Загрузить ещё». */
export function useNextOrderPage(): number | null {
  const { state, pageSize } = useOrderListContext();

  return getNextOrderPage(state, pageSize);
}
