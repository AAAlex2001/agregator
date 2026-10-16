import type { OrdersQuery } from "../model/order-list";

/** Формирует параметры страницы; отсутствие сортировки сохраняет порядок сервера. */
export function orderPageParams(query: OrdersQuery): URLSearchParams {
  const params = new URLSearchParams({
    skip: String(query.skip),
    limit: String(query.limit),
  });

  if (query.sort.field) {
    params.set("sort_by", query.sort.field);
    params.set("sort_dir", query.sort.direction);
  }

  return params;
}
