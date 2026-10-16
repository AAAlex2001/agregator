import type { ExpertLastOrder } from "@/entities/expert";
import { getOrderDocumentPaths, OrderDocumentsGallery } from "@/entities/order";
import { ResponseFiles } from "@/entities/response";
import styles from "./style.module.scss";

/** Последний выполненный заказ исполнителя или его отсутствие. */
interface LastOrderSummaryProps {
  order: ExpertLastOrder | null;
}

/** Показывает название, организатора, комментарий и файлы последнего заказа. */
export function LastOrderSummary({ order }: LastOrderSummaryProps) {
  if (!order) {
    return (
      <>
        <span className={styles.label}>Последний выполненный заказ</span>
        <span className={styles.empty}>Заказы ещё не выполнены</span>
      </>
    );
  }

  const hasDocuments = getOrderDocumentPaths(order.documents).length > 0;
  const hasFiles = order.executor_files.length > 0;

  return (
    <>
      <span className={styles.label}>Последний выполненный заказ</span>
      <span className={styles.number}>№ {order.id}</span>
      <div className={styles.field}>
        <span className={styles.label}>Название заказа:</span>
        <h4 className={styles.title}>{order.title || "—"}</h4>
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Организатор:</span>
        <span className={styles.value}>
          {order.company || order.customer_name || "—"}
        </span>
      </div>
      <div className={styles.field}>
        <span className={styles.label}>ИНН:</span>
        <span className={styles.value}>{order.customer_inn || "—"}</span>
      </div>
      {order.executor_comment && (
        <div className={styles.field}>
          <span className={styles.label}>Комментарий исполнителя:</span>
          <span className={styles.value}>{order.executor_comment}</span>
        </div>
      )}
      {(hasDocuments || hasFiles) && (
        <div className={styles.files}>
          {hasDocuments && <OrderDocumentsGallery documents={order.documents} />}
          {hasFiles && (
            <ResponseFiles
              title="Файлы исполнителя:"
              files={order.executor_files}
            />
          )}
        </div>
      )}
    </>
  );
}
