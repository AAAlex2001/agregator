"use client";

import { getOrderDocumentPaths } from "../../model/documents";
import { useOrderForm } from "../../model/order-form-provider";
import { getOrderFormDirection } from "../../model/order-form-direction";
import {
  getOrderPreviewCard,
  getOrderPreviewDocuments,
} from "../../model/order-preview";
import type { OrderBadge } from "../../model/types";
import { OrderCard } from "../order-card";
import { OrderDirectionDetails } from "../order-direction-details";
import { OrderDocuments } from "../order-documents";
import styles from "./style.module.scss";

/** ИНН заказчика и подписи аттестаций, подготовленные из справочника экспертизы. */
interface OrderLivePreviewProps {
  customerInn: string;
  badges: OrderBadge[];
}

/** Показывает исполнителю будущую карточку по текущим значениям формы. */
export function OrderLivePreview({ customerInn, badges }: OrderLivePreviewProps) {
  const { values } = useOrderForm();
  const documents = getOrderPreviewDocuments(values);
  const hasDocuments = getOrderDocumentPaths(documents).length > 0;
  const comment = values.comment.trim();
  const hasDetails = Boolean(values.details || comment || hasDocuments);

  return (
    <OrderCard
      order={getOrderPreviewCard(values, customerInn, badges)}
      details={hasDetails ? (
        <>
          <OrderDirectionDetails order={getOrderFormDirection(values)} />
          {comment && (
            <div className={styles.comment}>
              <span className={styles.commentLabel}>Комментарий заказчика:</span>
              <p className={styles.commentText}>{comment}</p>
            </div>
          )}
          {hasDocuments && <OrderDocuments documents={documents} />}
        </>
      ) : undefined}
    />
  );
}