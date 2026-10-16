import type { OrderListType } from "../model/order-list";
import type { OrderListItem } from "../model/order-list-item";
import { getOrderListPage } from "./get-order-list-page";

/** Загружает до 200 заказов списка двумя допустимыми для API страницами. */
async function getCopyCandidates(listType: OrderListType): Promise<OrderListItem[]> {
  const firstPage = await getOrderListPage(
    {
      skip: 0,
      limit: 100,
      sort: { field: null, direction: null },
    },
    listType,
  );

  if (!firstPage.has_more) {
    return firstPage.items;
  }

  const secondPage = await getOrderListPage(
    {
      skip: 100,
      limit: 100,
      sort: { field: null, direction: null },
    },
    listType,
  );

  return [...firstPage.items, ...secondPage.items];
}

/** Возвращает свои активные и архивные заказы для создания по образцу. */
export async function getCopyableOrders(customerId: number): Promise<OrderListItem[]> {
  const [active, archived] = await Promise.all([
    getCopyCandidates("orders"),
    getCopyCandidates("archive"),
  ]);

  return [...active, ...archived].filter((order) => order.customer_id === customerId);
}
