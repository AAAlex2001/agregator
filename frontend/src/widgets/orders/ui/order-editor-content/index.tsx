"use client";

import { useState } from "react";
import { ExpertiseCodesGuide } from "@/entities/expertise";
import { CreateOrderForm } from "@/features/create-order";
import { EditOrderForm } from "@/features/edit-order";
import { OrderEditorFields } from "../order-editor-fields";
import { OrderEditorPreview } from "../order-editor-preview";
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

/** Показывает форму с предпросмотром; справка скрывает форму, не размонтируя её. */
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
  const title = isEditing ? "Редактирование заказа" : "Создание заказа";

  /** Открывает таблицу обозначений поверх скрытой формы. */
  function showHelp() {
    setIsHelpOpen(true);
  }

  /** Возвращает заполненную форму после просмотра обозначений. */
  function hideHelp() {
    setIsHelpOpen(false);
  }

  const fields = (
    <OrderEditorFields
      directions={directions}
      title={showHeading ? title : undefined}
      onShowHelp={showHelp}
    />
  );

  return (
    <div className={isHelpOpen ? styles.shellWide : styles.shellWithPreview}>
      {isHelpOpen && (
        <div className={styles.form}>
          <ExpertiseCodesGuide onBack={hideHelp} />
        </div>
      )}
      <div className={isHelpOpen ? styles.hidden : styles.layout}>
        {isEditing ? (
          <EditOrderForm
            orderId={orderId}
            className={styles.form}
            onCancel={onCancel}
            onCopy={onCopy}
            onSaved={onSaved}
          >
            {fields}
          </EditOrderForm>
        ) : (
          <CreateOrderForm
            className={styles.form}
            onCancel={onCancel}
            onCopy={onCopy}
            onSaved={onSaved}
          >
            {fields}
          </CreateOrderForm>
        )}
        <div className={styles.previewSide}>
          <OrderEditorPreview />
        </div>
      </div>
    </div>
  );
}
