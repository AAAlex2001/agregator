"use client";

import { getExpertiseTypeColor } from "@/entities/expertise";
import { OrderLivePreview, useOrderForm } from "@/entities/order";
import type { OrderBadge } from "@/entities/order";
import { useUser } from "@/entities/user";

/** Добавляет к коду аттестации цвет объекта экспертизы для карточки заказа. */
function createPreviewBadge(code: string): OrderBadge {
  const type = code.split(" ")[1] ?? "";

  return {
    text: code,
    variant: getExpertiseTypeColor(type) ?? "orange",
  };
}

/** Соединяет черновик с ИНН заказчика и цветами выбранных аттестаций. */
export function OrderEditorPreview() {
  const { user } = useUser();
  const { values } = useOrderForm();

  return (
    <OrderLivePreview
      customerInn={user?.inn ?? ""}
      badges={values.badgeCodes.map(createPreviewBadge)}
    />
  );
}
