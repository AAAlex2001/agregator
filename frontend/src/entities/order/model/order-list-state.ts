import type { OrderListItem } from "./order-list-item";
import type { OrderListPage, OrderSort } from "./order-list";

/** Загруженные заказы с позиции offset, выбранный порядок и одна текущая операция списка. */
export interface OrderListState {
  items: OrderListItem[];
  offset: number;
  hasMore: boolean;
  sort: OrderSort;
  operation: "idle" | "loading" | "loading-more";
  error: string | null;
}

/** Результаты загрузки, удаления и возврата к исходному порядку. */
export type OrderListAction =
  | { type: "page/started"; sort: OrderSort }
  | { type: "page/loaded"; page: OrderListPage }
  | { type: "more/started" }
  | { type: "more/loaded"; page: OrderListPage }
  | { type: "request/failed"; error: string }
  | { type: "order/removed"; orderId: number }
  | { type: "sort/reset"; page: OrderListPage; offset: number };

/** Использует серверную страницу с её позицией либо показывает загрузку клиентского списка. */
export function createOrderListState(page?: OrderListPage, offset = 0): OrderListState {
  return {
    items: page?.items ?? [],
    offset,
    hasMore: page?.has_more ?? false,
    sort: {
      field: null,
      direction: null,
    },
    operation: page ? "idle" : "loading",
    error: null,
  };
}

/** Заменяет список при сортировке и дополняет его следующей страницей. */
export function orderListReducer(
  state: OrderListState,
  action: OrderListAction,
): OrderListState {
  switch (action.type) {
    case "page/started":
      return {
        items: [],
        offset: 0,
        hasMore: false,
        sort: action.sort,
        operation: "loading",
        error: null,
      };
    case "page/loaded":
      return {
        ...state,
        items: action.page.items,
        hasMore: action.page.has_more,
        operation: "idle",
        error: null,
      };
    case "more/started":
      return {
        ...state,
        operation: "loading-more",
        error: null,
      };
    case "more/loaded":
      return {
        ...state,
        items: [...state.items, ...action.page.items],
        hasMore: action.page.has_more,
        operation: "idle",
        error: null,
      };
    case "request/failed":
      return {
        ...state,
        operation: "idle",
        error: action.error,
      };
    case "sort/reset":
      return createOrderListState(action.page, action.offset);
    case "order/removed":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.orderId),
      };
  }
}
