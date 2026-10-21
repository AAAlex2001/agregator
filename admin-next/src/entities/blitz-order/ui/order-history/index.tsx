import { formatDateTime } from "@/shared/lib/date";
import { formatRub } from "@/shared/lib/money";
import Panel from "@/shared/ui/panel";
import { BLITZ_ACTOR_LABELS, BLITZ_STATUS_LABELS, type BlitzOrder } from "../../model/types";
import styles from "./style.module.scss";

type OrderHistoryProps = {
  order: BlitzOrder;
};

/** История заявки: смены статуса и цены, новые сверху. */
const OrderHistory = ({ order }: OrderHistoryProps) => {
  const events = [
    ...order.history.map((change) => ({
      at: change.created_at,
      title: BLITZ_STATUS_LABELS[change.status],
      meta: BLITZ_ACTOR_LABELS[change.actor],
      note: change.note,
    })),
    ...order.price_changes.map((change) => ({
      at: change.created_at,
      title: `Цена: ${formatRub(change.old_price)} → ${formatRub(change.new_price)}`,
      meta: "Администратор",
      note: change.reason,
    })),
  ].sort((first, second) => second.at.localeCompare(first.at));

  return (
    <Panel title="История">
      <ol className={styles.list}>
        {events.map((event) => (
          <li key={`${event.at}-${event.title}`} className={styles.event}>
            <span className={styles.title}>{event.title}</span>
            <span className={styles.meta}>
              {event.meta} · {formatDateTime(event.at)}
            </span>
            {event.note && <span className={styles.note}>{event.note}</span>}
          </li>
        ))}
      </ol>
    </Panel>
  );
};

export default OrderHistory;
