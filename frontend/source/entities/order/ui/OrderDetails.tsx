import type { ReactNode } from "react";
import { orderDetailGroups } from "../model/detailsFields";
import { countDocuments, type OrderCardData } from "../model/types";
import { DocumentsGallery } from "./DocumentsGallery";
import { OrderComment } from "./OrderComment";
import { OrderDetailsList } from "./OrderDetailsList";

/** Есть ли у заказа что показать под карточкой: анкета направления, комментарий или документы. */
export function hasOrderDetails(order: OrderCardData): boolean {
  const hasDirectionDetails = orderDetailGroups(order.workType).length > 0 && order.details !== null;
  return hasDirectionDetails || Boolean(order.comment) || countDocuments(order.documents) > 0;
}

interface OrderDetailsProps {
  order: OrderCardData;
  children?: ReactNode;
}

/** Раскрытая часть карточки: анкета направления, комментарий заказчика, документы. children встаёт перед документами. */
export function OrderDetails({ order, children }: OrderDetailsProps) {
  return (
    <>
      <OrderDetailsList workType={order.workType} details={order.details} />
      {order.comment && <OrderComment title="Комментарий заказчика:" text={order.comment} previous={order.previousComment} />}
      {children}
      {countDocuments(order.documents) > 0 && <DocumentsGallery documents={order.documents} />}
    </>
  );
}
