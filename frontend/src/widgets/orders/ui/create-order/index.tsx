"use client";

import { OrderEditor } from "../order-editor";
import styles from "./style.module.scss";

/** Возврат к личному списку после отмены или создания заказа. */
interface CreateOrderProps {
  onReturnToOrders: () => void;
}

/** Страница создания заказа с нуля или по образцу своей заявки. */
export function CreateOrder({ onReturnToOrders }: CreateOrderProps) {
  return (
    <div className={styles.wrapper}>
      <OrderEditor
        showHeading={false}
        onCancel={onReturnToOrders}
        onSaved={onReturnToOrders}
      />
    </div>
  );
}
