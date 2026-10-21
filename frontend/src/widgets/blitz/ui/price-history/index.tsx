import type { BlitzOrder } from "@/entities/blitz-order";
import { formatWithTime } from "@/shared/lib/format-date";
import { formatRub } from "@/shared/lib/format-rub";
import styles from "./style.module.scss";

/** Заявка с историей цены. */
interface PriceHistoryProps {
  order: BlitzOrder;
}

/** Смены цены администратором: было, стало, причина и когда. */
export function PriceHistory({ order }: PriceHistoryProps) {
  return (
    <ul className={styles.list}>
      {[...order.price_changes].reverse().map((change) => (
        <li
          key={change.created_at}
          className={styles.change}
        >
          <span className={styles.prices}>
            {change.old_price === null ? "Без цены" : formatRub(change.old_price)}
            {" → "}
            {formatRub(change.new_price)}
          </span>
          <span className={styles.reason}>{change.reason}</span>
          <span className={styles.date}>{formatWithTime(change.created_at)}</span>
        </li>
      ))}
    </ul>
  );
}
