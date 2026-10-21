"use client";

import type { ReactNode } from "react";
import { useOrderFormSteps } from "@/entities/order";
import { Checkbox } from "@/shared/ui/checkbox";
import { StepActions } from "@/shared/ui/step-actions";
import { useEditOrder } from "../../model/use-edit-order";
import styles from "./style.module.scss";

/** Редактируемый заказ, поля шага и переходы после действий. */
interface EditOrderFormProps {
  orderId: number;
  children: ReactNode;
  className?: string;
  onSaved: () => void;
  onCancel: () => void;
}

/** Правка заказа по шагам; на последнем шаге — выбор оповещения участников тендера. */
export function EditOrderForm({
  orderId,
  children,
  className,
  onSaved,
  onCancel,
}: EditOrderFormProps) {
  const form = useEditOrder(orderId, onSaved);
  const steps = useOrderFormSteps();

  return (
    <form
      className={className}
      noValidate
      onSubmit={form.submit}
    >
      {children}
      {steps.isLast && (
        <div className={styles.notifyRow}>
          <Checkbox
            id="order-notify-responders"
            checked={form.notifyResponders}
            onChange={form.changeNotifications}
          >
            Оповестить участников тендера об изменениях
          </Checkbox>
        </div>
      )}
      <StepActions
        isFirst={steps.isFirst}
        isLast={steps.isLast}
        isSubmitting={form.isSaving}
        submitLabel="Сохранить"
        onCancel={onCancel}
        onBack={steps.back}
      />
    </form>
  );
}