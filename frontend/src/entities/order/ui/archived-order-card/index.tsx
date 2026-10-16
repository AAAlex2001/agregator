import type { ReactNode } from "react";
import { ListCard } from "@/shared/ui/list-card";
import type { OrderListItem } from "../../model/order-list-item";
import { OrderComment } from "../order-comment";
import { hasOrderDetails, OrderDetails } from "../order-details";
import { OrderRequirements } from "../order-requirements";
import styles from "./style.module.scss";

/** Завершённый заказ и блоки исполнителя, файлов, действий и вопросов. */
interface ArchivedOrderCardProps {
  order: OrderListItem;
  executor?: ReactNode;
  responseFiles?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
}

/** Показывает условия завершённого заказа и принятого предложения исполнителя. */
export function ArchivedOrderCard({
  order,
  executor,
  responseFiles,
  actions,
  footer,
}: ArchivedOrderCardProps) {
  const hasExecutor = Boolean(order.executor_name);

  return (
    <ListCard
      meta={`№ ${order.id}`}
      statusText="Архив"
      statusColor="var(--color-order-status-archive-text)"
      statusBg="var(--color-order-status-archive-background)"
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
        {
          label: "Создан",
          value: order.created_at_display,
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
        hasOrderDetails(order) || hasExecutor ? (
          <OrderDetails order={order}>
            {hasExecutor && order.executor_comment && (
              <OrderComment
                title="Комментарий исполнителя:"
                text={order.executor_comment}
              />
            )}
            {hasExecutor && responseFiles}
          </OrderDetails>
        ) : undefined
      }
      footer={footer}
    />
  );
}
