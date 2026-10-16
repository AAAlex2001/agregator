import type { OrderListItem } from "@/entities/order";
import styles from "./style.module.scss";

/** Свой заказ, который можно использовать как образец нового. */
interface OrderOptionProps {
  order: OrderListItem;
  onSelect: (order: OrderListItem) => void;
}

/** Выбирает заказ для заполнения новой заявки его условиями. */
export function OrderOption({ order, onSelect }: OrderOptionProps) {
  /** Передаёт выбранные условия и документы новой форме. */
  function selectOrder() {
    onSelect(order);
  }

  return (
    <button
      type="button"
      className={styles.item}
      onClick={selectOrder}
    >
      <span className={styles.number}>№ {order.id}</span>
      <span className={styles.name}>{order.title}</span>
    </button>
  );
}
