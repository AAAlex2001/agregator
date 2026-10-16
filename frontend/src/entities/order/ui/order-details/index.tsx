import type { ReactNode } from "react";
import { getOrderDocumentPaths } from "../../model/documents";
import type { OrderListItem } from "../../model/order-list-item";
import { OrderComment } from "../order-comment";
import { OrderDirectionDetails } from "../order-direction-details";
import { OrderDocuments } from "../order-documents";

/** Заказ и дополнительные сведения перед документами. */
interface OrderDetailsProps {
  order: OrderListItem;
  children?: ReactNode;
}

/** Определяет, нужна ли раскрытая секция условий под карточкой. */
export function hasOrderDetails(order: OrderListItem): boolean {
  return order.details !== null
    || Boolean(order.comment)
    || getOrderDocumentPaths(order.documents).length > 0;
}

/** Собирает условия направления, комментарий и документы заказчика. */
export function OrderDetails({ order, children }: OrderDetailsProps) {
  return (
    <>
      <OrderDirectionDetails order={order} />
      {order.comment && (
        <OrderComment
          text={order.comment}
          previous={order.previous_comment}
        />
      )}
      {children}
      {getOrderDocumentPaths(order.documents).length > 0 && (
        <OrderDocuments documents={order.documents} />
      )}
    </>
  );
}
