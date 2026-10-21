import type { OrderListItem } from "./order-list-item";

/** Лента заказов текущей роли, общий архив или отчёты заказчика по завершённым тендерам. */
export type OrderListType = "orders" | "archive" | "reports";

/** Количество заказов в первой и последующих страницах списка. */
export const ORDERS_PAGE_SIZE = 50;

/** Количество заказов в странице истории исполнителя. */
/** Страница каталога и архива: по 10 заказов, следующая — ссылкой ?page=N для поисковиков. */
export const CATALOG_PAGE_SIZE = 10;

export const EXPERT_HISTORY_PAGE_SIZE = 20;

/** Поля сортировки списка, поддерживаемые API заказов. */
export type OrderSortField = "created_at" | "sum_amount" | "responses_deadline";

/** Направление сортировки: от меньшего к большему либо наоборот. */
export type OrderSortDirection = "asc" | "desc";

/** Сортировка по одному полю или исходный порядок сервера. */
export type OrderSort =
  | { field: null; direction: null }
  | { field: OrderSortField; direction: OrderSortDirection };

/** Параметры загрузки одной страницы списка заказов. */
export interface OrdersQuery {
  skip: number;
  limit: number;
  sort: OrderSort;
}

/** Страница заказов и наличие следующей страницы. */
export interface OrderListPage {
  items: OrderListItem[];
  has_more: boolean;
}
