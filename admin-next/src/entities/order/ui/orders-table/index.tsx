import { directionLabel } from "@/entities/direction";
import { formatDate } from "@/shared/lib/date";
import { formatRub } from "@/shared/lib/money";
import Badge from "@/shared/ui/badge";
import List from "@/shared/ui/list";
import ListRow from "@/shared/ui/list-row";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONES, type Order } from "../../model/types";
import styles from "./style.module.scss";

type OrdersTableProps = {
  orders: Order[];
};

/** Список заказов: название и направление, заказчик и исполнитель, сумма со сроком и статус. */
const OrdersTable = ({ orders }: OrdersTableProps) => (
  <List>
    {orders.map((order) => (
      <ListRow key={order.id}>
        <span className={styles.id}>#{order.id}</span>

        <span className={styles.cell}>
          <span className={styles.title}>{order.title}</span>
          <span className={styles.meta}>{[directionLabel(order.work_type), order.company].filter(Boolean).join(" · ")}</span>
        </span>

        <span className={styles.people}>
          <span>{order.customer_name}</span>
          <span className={styles.meta}>{order.expert_name ? `Исполнитель: ${order.expert_name}` : "Исполнитель не выбран"}</span>
        </span>

        <span className={styles.money}>
          <span className={styles.sum}>{formatRub(order.sum_rub)}</span>
          <span className={styles.meta}>до {formatDate(order.deadline)}</span>
        </span>

        <span className={styles.status}>
          <Badge tone={ORDER_STATUS_TONES[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
        </span>

        <span className={styles.date}>{formatDate(order.created_at)}</span>
      </ListRow>
    ))}
  </List>
);

export default OrdersTable;
