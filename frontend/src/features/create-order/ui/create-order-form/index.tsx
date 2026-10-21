"use client";

import type { ReactNode } from "react";
import { useOrderFormSteps } from "@/entities/order";
import { StepActions } from "@/shared/ui/step-actions";
import { useCreateOrder } from "../../model/use-create-order";

/** Шаг нового заказа и переходы после действий формы. */
interface CreateOrderFormProps {
  children: ReactNode;
  className?: string;
  onSaved: () => void;
  onCancel: () => void;
}

/** Форма нового заказа по шагам: поля текущего шага передаёт экран. */
export function CreateOrderForm({
  children,
  className,
  onSaved,
  onCancel,
}: CreateOrderFormProps) {
  const { isSaving, submit } = useCreateOrder(onSaved);
  const steps = useOrderFormSteps();

  return (
    <form
      className={className}
      noValidate
      onSubmit={submit}
    >
      {children}
      <StepActions
        isFirst={steps.isFirst}
        isLast={steps.isLast}
        isSubmitting={isSaving}
        submitLabel="Создать заказ"
        onCancel={onCancel}
        onBack={steps.back}
      />
    </form>
  );
}