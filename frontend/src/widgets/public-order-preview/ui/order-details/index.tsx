import cn from "classnames";
import type { PublicOrder } from "@/entities/order";
import { OrderFiles } from "../order-files";
import { OrderMeta } from "../order-meta";
import styles from "./style.module.scss";

/** Опубликованные условия одного заказа. */
interface OrderDetailsProps {
  order: PublicOrder;
}

/** Собирает название, сроки, требования и документы публичного заказа. */
export function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <>
      <div className={styles.infoBlock}>
        <span className={styles.infoLabel}>Название заказа</span>
        <h1 className={styles.orderTitle}>{order.title}</h1>
      </div>

      {order.company && (
        <div className={styles.infoBlock}>
          <span className={styles.infoLabel}>Название компании</span>
          <span className={styles.company}>{order.company}</span>
        </div>
      )}

      <OrderMeta
        startDate={order.start_date}
        endDate={order.date}
        budget={order.sum}
        responsesDeadline={order.responses_deadline}
      />

      {order.badges.length > 0 && (
        <div className={styles.infoBlock}>
          <span className={styles.infoLabel}>Требования к исполнителю:</span>
          <div className={styles.badges}>
            {order.badges.map((badge) => (
              <span
                key={badge.text}
                className={cn(
                  styles.badge,
                  styles[badge.variant.toLowerCase()] ?? styles.gray,
                )}
              >
                {badge.text}
              </span>
            ))}
          </div>
        </div>
      )}

      {order.comment && (
        <div className={styles.infoBlock}>
          <span className={styles.infoLabel}>Комментарий заказчика</span>
          <p className={styles.infoText}>{order.comment}</p>
        </div>
      )}

      <OrderFiles documents={order.documents} />
    </>
  );
}
