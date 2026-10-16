"use client";

import type { ReactNode } from "react";
import { OrderFormActions } from "@/entities/order";
import { useCreateOrder } from "../../model/use-create-order";

/** Поля нового заказа и переходы после действий формы. */
interface CreateOrderFormProps {
  children: ReactNode;
  className?: string;
  onSaved: () => void;
  onCancel: () => void;
  onCopy: () => void;
}

/** Отправляет форму создания заказа с полями, которые передал экран. */
export function CreateOrderForm({
  children,
  className,
  onSaved,
  onCancel,
  onCopy,
}: CreateOrderFormProps) {
  const { isSaving, submit } = useCreateOrder(onSaved);

  return (
    <form
      className={className}
      onSubmit={submit}
    >
      {children}
      <OrderFormActions
        submitText="Создать заказ"
        isSaving={isSaving}
        onCancel={onCancel}
        onCopy={onCopy}
      />
    </form>
  );
}
