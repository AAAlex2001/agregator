"use client";

import type { ReactNode } from "react";
import { OrderFormActions } from "@/entities/order";
import { Checkbox } from "@/shared/ui/checkbox";
import { useEditOrder } from "../../model/use-edit-order";
import styles from "./style.module.scss";

/** Редактируемый заказ, поля формы и переходы после действий. */
interface EditOrderFormProps {
  orderId: number;
  children: ReactNode;
  className?: string;
  onSaved: () => void;
  onCancel: () => void;
  onCopy: () => void;
}

/** Сохраняет правки заказа и выбор оповещения участников тендера. */
export function EditOrderForm({
  orderId,
  children,
  className,
  onSaved,
  onCancel,
  onCopy,
}: EditOrderFormProps) {
  const {
    isSaving,
    notifyResponders,
    changeNotifications,
    submit,
  } = useEditOrder(orderId, onSaved);

  return (
    <form
      className={className}
      onSubmit={submit}
    >
      {children}
      <div className={styles.notifyRow}>
        <Checkbox
          id="order-notify-responders"
          checked={notifyResponders}
          onChange={changeNotifications}
        >
          Оповестить участников тендера об изменениях
        </Checkbox>
      </div>
      <OrderFormActions
        submitText="Сохранить"
        isSaving={isSaving}
        onCancel={onCancel}
        onCopy={onCopy}
      />
    </form>
  );
}
