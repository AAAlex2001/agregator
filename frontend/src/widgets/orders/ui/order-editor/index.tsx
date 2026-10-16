"use client";

import { useState } from "react";
import { isExpertiseCode } from "@/entities/expertise";
import { OrderFormProvider } from "@/entities/order";
import type { OrderListItem } from "@/entities/order";
import { useUser } from "@/entities/user";
import { OrderCopyPicker } from "@/features/copy-order";
import { OrderEditorContent } from "../order-editor-content";
import { OrderNoDirections } from "../order-no-directions";

/** Редактируемый заказ, показ заголовка и переходы после действий формы. */
interface OrderEditorProps {
  editTarget?: OrderListItem;
  showHeading?: boolean;
  onCancel: () => void;
  onSaved: () => void;
}

/** Открывает черновик заказа; выбранный образец заменяет его новым заказом по копии. */
export function OrderEditor({
  editTarget,
  showHeading = true,
  onCancel,
  onSaved,
}: OrderEditorProps) {
  const { user } = useUser();
  const [copyTemplate, setCopyTemplate] = useState<OrderListItem | null>(null);
  const [isCopyPickerOpen, setIsCopyPickerOpen] = useState(false);

  /** Открывает список своих заявок для выбора образца. */
  function openCopyPicker() {
    setIsCopyPickerOpen(true);
  }

  /** Закрывает выбор образца, оставляя текущий черновик. */
  function closeCopyPicker() {
    setIsCopyPickerOpen(false);
  }

  /** Заполняет новый заказ выбранной заявкой и закрывает список. */
  function selectCopyTemplate(order: OrderListItem) {
    setCopyTemplate(order);
    setIsCopyPickerOpen(false);
  }

  if (!user) {
    return null;
  }

  const template = copyTemplate ?? editTarget;
  const editedOrderId = copyTemplate ? undefined : editTarget?.id;

  if (editedOrderId === undefined && user.directions.length === 0) {
    return (
      <OrderNoDirections
        showHeading={showHeading}
        onBack={onCancel}
      />
    );
  }

  const badgeCodes = (template?.badges ?? [])
    .map((badge) => badge.text)
    .filter(isExpertiseCode);

  return (
    <>
      <OrderFormProvider
        key={copyTemplate ? `copy-${copyTemplate.id}` : "own"}
        source={{
          customer: user,
          badgeCodes,
          template,
          copySourceOrderId: copyTemplate?.id ?? null,
        }}
      >
        <OrderEditorContent
          orderId={editedOrderId}
          directions={user.directions}
          showHeading={showHeading}
          onCancel={onCancel}
          onCopy={openCopyPicker}
          onSaved={onSaved}
        />
      </OrderFormProvider>
      {isCopyPickerOpen && (
        <OrderCopyPicker
          customerId={user.id}
          onClose={closeCopyPicker}
          onSelect={selectCopyTemplate}
        />
      )}
    </>
  );
}
