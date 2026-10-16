import type {
  OrderListPage,
  OrderListType,
  OrdersQuery,
} from "../model/order-list";
import { getArchivedOrders } from "./get-archived-orders";
import { getExpertOrdersHistory } from "./get-expert-orders-history";
import { getOrders } from "./get-orders";
import { getReports } from "./get-reports";

/** Выбирает API ленты, архива, отчётов или истории исполнителя для очередной страницы. */
export function getOrderListPage(
  query: OrdersQuery,
  listType: OrderListType,
  expertPublicId?: string,
): Promise<OrderListPage> {
  if (expertPublicId) {
    return getExpertOrdersHistory(expertPublicId, query);
  }

  if (listType === "archive") {
    return getArchivedOrders(query);
  }

  if (listType === "reports") {
    return getReports(query);
  }

  return getOrders(query);
}
