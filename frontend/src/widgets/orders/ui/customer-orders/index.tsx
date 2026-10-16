"use client";

import { useState } from "react";
import { OrderListProvider } from "@/entities/order";
import type { OrderListItem } from "@/entities/order";
import { CustomerOrdersList } from "../customer-orders-list";
import { OrderEditor } from "../order-editor";
import styles from "./style.module.scss";

/** Переход к отдельной странице создания заказа. */
interface CustomerOrdersProps {
  onCreate: () => void;
}

/** Показывает заказы заказчика; после закрытия редактора список загружается заново. */
export function CustomerOrders({ onCreate }: CustomerOrdersProps) {
  const [editTarget, setEditTarget] = useState<OrderListItem | null>(null);

  /** Возвращает к списку после отмены или сохранения правок. */
  function closeEditor() {
    setEditTarget(null);
  }

  return (
    <div className={styles.wrapper}>
      {editTarget ? (
        <OrderEditor
          editTarget={editTarget}
          onCancel={closeEditor}
          onSaved={closeEditor}
        />
      ) : (
        <OrderListProvider>
          <CustomerOrdersList
            onEdit={setEditTarget}
            onCreate={onCreate}
          />
        </OrderListProvider>
      )}
    </div>
  );
}
