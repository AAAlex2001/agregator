"use client";

import { useState } from "react";
import { ExpertiseCodesGuide } from "@/entities/expertise";
import { CreateOrderForm } from "@/features/create-order";
import { EditOrderForm } from "@/features/edit-order";
import { Title } from "@/shared/ui/title";
import { OrderEditorProgress } from "../order-editor-progress";
import { OrderEditorStep } from "../order-editor-step";
import styles from "./style.module.scss";

/** Сохраняемый заказ, направления заказчика и переходы редактора. */
interface OrderEditorContentProps {
  orderId?: number;
  directions: string[];
  showHeading: boolean;
  onCancel: () => void;
  onCopy: () => void;
  onSaved: () => void;
}

/** Шкала шагов и карточка текущего шага; справка скрывает форму, не размонтируя её. */
export function OrderEditorContent({
  orderId,
  directions,
  showHeading,
  onCancel,
  onCopy,
  onSaved,
}: OrderEditorContentProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const isEditing = orderId !== undefined;

  const step = (
    <OrderEditorStep
      directions={directions}
      onShowHelp={() => setIsHelpOpen(true)}
      onCopy={onCopy}
    />
  );

  return (
    <div className={styles.editor}>
      {isHelpOpen && (
        <div className={styles.form}>
          <ExpertiseCodesGuide onBack={() => setIsHelpOpen(false)} />
        </div>
      )}
      <div className={isHelpOpen ? styles.hidden : styles.wizard}>
        {showHeading && (
          <Title
            as="h1"
            text={isEditing ? "Редактирование заказа" : "Создание заказа"}
          />
        )}
        <OrderEditorProgress />
        {isEditing ? (
          <EditOrderForm
            orderId={orderId}
            className={styles.form}
            onCancel={onCancel}
            onSaved={onSaved}
          >
            {step}
          </EditOrderForm>
        ) : (
          <CreateOrderForm
            className={styles.form}
            onCancel={onCancel}
            onSaved={onSaved}
          >
            {step}
          </CreateOrderForm>
        )}
      </div>
    </div>
  );
}
