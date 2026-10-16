import type { ReactNode } from "react";
import { ListCard } from "@/shared/ui/list-card";
import { getOrderDocumentPaths } from "../../model/documents";
import type { OrderListItem } from "../../model/order-list-item";
import { OrderComment } from "../order-comment";
import { OrderDocuments } from "../order-documents";
import { OrderRequirements } from "../order-requirements";
import styles from "./style.module.scss";

/** Завершённый тендер и блоки исполнителя, действий с отчётом и вопросов. */
interface ReportOrderCardProps {
  order: OrderListItem;
  executor: ReactNode;
  actions: ReactNode;
  footer: ReactNode;
}

/** Показывает условия завершённого тендера, по которому заказчику доступен отчёт. */
export function ReportOrderCard({
  order,
  executor,
  actions,
  footer,
}: ReportOrderCardProps) {
  const hasExecutor = Boolean(order.executor_name);
  const hasDocuments = getOrderDocumentPaths(order.documents).length > 0;
  const hasExecutorComment = hasExecutor && Boolean(order.executor_comment);
  const hasDetails = Boolean(order.comment) || hasExecutorComment || hasDocuments;

  return (
    <ListCard
      meta={`№ ${order.id}`}
      statusText="Тендер завершён"
      statusColor="var(--color-order-status-open-text)"
      statusBg="var(--color-order-status-open-background)"
      titleLabel="Название заказа:"
      title={order.title}
      bottomLeftCustom={
        hasExecutor ? (
          <div className={styles.executorBlock}>
            <span className={styles.label}>Исполнитель</span>
            {executor}
          </div>
        ) : (
          <>
            <span className={styles.label}>Организатор:</span>
            <span className={styles.value}>
              {order.company || order.customer_name || "—"}
            </span>
          </>
        )
      }
      rightItems={[
        {
          label: "Начальная максимальная цена",
          value: order.sum || "—",
          valueAccent: true,
        },
        {
          label: "Цена исполнителя",
          value: order.executor_proposed_sum,
        },
        {
          label: "Срок начала выполнения работ исполнителя",
          value: order.executor_proposed_start_date,
        },
        {
          label: "Срок окончания выполнения работ исполнителя",
          value: order.executor_proposed_deadline,
        },
        {
          label: "Срок начала выполнения работ",
          value: order.start_date || "—",
        },
        {
          label: "Срок окончания выполнения работ",
          value: order.date || "—",
        },
      ].filter((item) => item.value)}
      actions={actions}
      leftExtra={
        <OrderRequirements
          workType={order.work_type}
          badges={order.badges}
          previousBadges={null}
        />
      }
      details={
        hasDetails ? (
          <>
            {order.comment && <OrderComment text={order.comment} />}
            {hasExecutorComment && (
              <OrderComment
                title="Комментарий исполнителя:"
                text={order.executor_comment}
              />
            )}
            {hasDocuments && <OrderDocuments documents={order.documents} />}
          </>
        ) : undefined
      }
      footer={footer}
    />
  );
}
