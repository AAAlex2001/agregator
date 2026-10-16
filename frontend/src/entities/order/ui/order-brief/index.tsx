import classNames from "classnames";
import { formatMoscowDateTime } from "@/shared/lib/format-date";
import { getOrderBadgeColor } from "../../model/badge-color";
import type { OrderListItem } from "../../model/order-list-item";
import { isResponsesClosed } from "../../model/response-deadline";
import { OrderDirectionDetails } from "../order-direction-details";
import styles from "./style.module.scss";

/** Условия выбранного заказа перед отправкой отклика. */
interface OrderBriefProps {
  order: OrderListItem;
}

/** Показывает сроки, цену, требования, организатора и условия направления. */
export function OrderBrief({ order }: OrderBriefProps) {
  const isExpired = isResponsesClosed(order.responses_deadline);
  const deadlineClassName = isExpired
    ? styles.responsesDeadlineExpired
    : styles.responsesDeadlineActive;

  return (
    <div className={styles.block}>
      <div className={styles.topRow}>
        <div className={styles.topItem}>
          <span className={styles.topLabel}>Срок начала выполнения работ</span>
          <span className={styles.date}>{order.start_date || "—"}</span>
        </div>
        <div className={styles.topItem}>
          <span className={styles.topLabel}>Срок окончания выполнения работ</span>
          <span className={styles.date}>{order.date}</span>
        </div>
        <div className={styles.topItem}>
          <span className={styles.topLabel}>Начальная максимальная цена</span>
          <span className={styles.sum}>{order.sum}</span>
        </div>
      </div>

      {order.badges.length > 0 && (
        <div className={styles.requirements}>
          <span className={styles.requirementsLabel}>Требования к исполнителю:</span>
          <div className={styles.badges}>
            {order.badges.map((badge) => (
              <span
                key={badge.text}
                className={classNames(
                  styles.badge,
                  styles[getOrderBadgeColor(badge.variant)],
                )}
              >
                {badge.text}
              </span>
            ))}
          </div>
        </div>
      )}

      {order.responses_deadline && (
        <span className={deadlineClassName}>
          Приём откликов до (МСК): {formatMoscowDateTime(order.responses_deadline)}
        </span>
      )}

      <div className={styles.textBlock}>
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>Название заказа</span>
          <p className={styles.title}>{order.title}</p>
        </div>
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>Организатор</span>
          <p className={styles.customer}>{order.company || order.customer_name}</p>
        </div>
        {order.customer_inn && (
          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>ИНН</span>
            <p className={styles.customer}>{order.customer_inn}</p>
          </div>
        )}
      </div>

      <OrderDirectionDetails order={order} />

      <div className={styles.commentBlock}>
        <span className={styles.commentLabel}>Комментарий к заказу</span>
        <div className={styles.commentBox}>
          <p className={styles.commentText}>
            {order.comment || "Комментарий отсутствует"}
          </p>
        </div>
      </div>
    </div>
  );
}
