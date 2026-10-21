import { blitzOrderPath } from "@/shared/lib/admin-paths";
import { formatDateTime } from "@/shared/lib/date";
import { formatRub } from "@/shared/lib/money";
import Badge from "@/shared/ui/badge";
import List from "@/shared/ui/list";
import ListRow from "@/shared/ui/list-row";
import { BLITZ_STATUS_LABELS, BLITZ_STATUS_TONES, type BlitzOrder } from "../../model/types";
import styles from "./style.module.scss";

type OrdersTableProps = {
  orders: BlitzOrder[];
};

/** Заявки Блиц-эксперта. Строка ведёт на карточку заявки. */
const OrdersTable = ({ orders }: OrdersTableProps) => (
  <List>
    {orders.map((order) => (
      <ListRow key={order.id} href={blitzOrderPath(order.id)}>
        <span className={styles.number}>№{order.id}</span>

        <span className={styles.subject}>
          <span className={styles.title}>{order.object_name}</span>
          <span className={styles.meta}>
            {order.company?.name ?? order.customer_name}
            {order.expert_name ? ` · эксперт ${order.expert_name}` : " · без эксперта"}
          </span>
        </span>

        <span className={styles.price}>{formatRub(order.price)}</span>

        <span className={styles.status}>
          <Badge tone={BLITZ_STATUS_TONES[order.status]}>{BLITZ_STATUS_LABELS[order.status]}</Badge>
        </span>

        <span className={styles.date}>{formatDateTime(order.updated_at)}</span>
      </ListRow>
    ))}
  </List>
);

export default OrdersTable;
