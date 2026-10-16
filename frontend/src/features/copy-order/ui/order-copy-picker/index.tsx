"use client";

import { useCopyableOrders } from "@/entities/order";
import type { OrderListItem } from "@/entities/order";
import { Loader } from "@/shared/ui/loader";
import { Modal } from "@/shared/ui/modal";
import { OrderOption } from "../order-option";
import styles from "./style.module.scss";

/** Заказчик и действия выбора или закрытия списка образцов. */
interface OrderCopyPickerProps {
  customerId: number;
  onClose: () => void;
  onSelect: (order: OrderListItem) => void;
}

/** Позволяет создать заказ по образцу своей активной или архивной заявки. */
export function OrderCopyPicker({
  customerId,
  onClose,
  onSelect,
}: OrderCopyPickerProps) {
  const { orders, error, isLoading } = useCopyableOrders(customerId);

  return (
    <Modal
      open
      onClose={onClose}
      size="md"
      ariaLabel="Выбор заявки для копирования"
    >
      <div className={styles.content}>
        <h2 className={styles.title}>Какую заявку вы хотите скопировать?</h2>
        {error && <p className={styles.error}>{error}</p>}
        {isLoading ? (
          <div className={styles.loading}>
            <Loader
              label=""
              size="md"
            />
          </div>
        ) : (
          <div className={styles.list}>
            {orders.map((order) => (
              <OrderOption
                key={order.id}
                order={order}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
