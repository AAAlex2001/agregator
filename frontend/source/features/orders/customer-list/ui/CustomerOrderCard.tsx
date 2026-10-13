"use client";

import { useState } from "react";
import { hasOrderDetails, OrderCard, OrderDetails, type OrderCardData } from "@/source/entities/order";
import { OrderQuestions } from "@/source/features/orders/questions";
import Button from "@/source/shared/ui/Button";
import { ConfirmModal } from "@/source/shared/ui/ConfirmModal";
import s from "./CustomerOrderCard.module.scss";

interface CustomerOrderCardProps {
  order: OrderCardData;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}

/** Активный заказ заказчика: редактирование, удаление с подтверждением, вопросы исполнителей. */
export function CustomerOrderCard({ order, onEdit, onDelete }: CustomerOrderCardProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <OrderCard
        order={order}
        actions={
          <div className={s.actions}>
            <Button variant="outline" size="sm" onClick={onEdit}>
              Редактировать
            </Button>
            <Button variant="danger" size="sm" onClick={() => setIsDeleteOpen(true)}>
              Удалить
            </Button>
          </div>
        }
        details={hasOrderDetails(order) ? <OrderDetails order={order} /> : undefined}
        footer={<OrderQuestions orderId={order.id} customerId={order.customerId} canAsk={false} />}
      />
      <ConfirmModal
        open={isDeleteOpen}
        title="Удалить заказ?"
        description="Заказ и отклики на него исчезнут безвозвратно."
        confirmLabel="Удалить"
        onConfirm={async () => {
          await onDelete();
          setIsDeleteOpen(false);
        }}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </>
  );
}
