"use client";

import type { DirectionCode } from "@/entities/direction";
import { isExpertiseCode } from "@/entities/expertise";
import { useUpdateOrderNotifications } from "@/entities/user";
import { useNotifications } from "@/shared/ui/notifications";
import { isNotificationDirection } from "./directions";
import type { OrderNotificationsOptions } from "./types";

/** Сохраняет требования экспертизы и направления писем о новых заказах. */
export function useEditOrderNotifications(
  orderTypes: string[],
  { disabled, onBusyChange }: OrderNotificationsOptions,
) {
  const { isSaving, saveOrderTypes } = useUpdateOrderNotifications();
  const { showError, showSuccess } = useNotifications();
  const expertiseCodes = orderTypes.filter(isExpertiseCode);
  const directions = orderTypes.filter(isNotificationDirection);

  /** Сохраняет новый выбор и сообщает результат, не меняя профиль при ошибке. */
  async function save(orderTypes: string[]) {
    if (disabled || isSaving) {
      return;
    }

    onBusyChange?.(true);

    try {
      await saveOrderTypes(orderTypes);
      showSuccess(
        orderTypes.length > 0
          ? "Фильтр уведомлений сохранён"
          : "Уведомления о новых заказах отключены",
      );
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Не удалось сохранить фильтр",
      );
    } finally {
      onBusyChange?.(false);
    }
  }

  /** Меняет требования экспертизы, сохраняя выбранные направления. */
  function changeExpertiseCodes(codes: string[]) {
    void save([...codes, ...directions]);
  }

  /** Включает или выключает письма по одному направлению. */
  function changeDirection(code: DirectionCode, enabled: boolean) {
    const nextDirections = enabled
      ? [...directions, code]
      : directions.filter((direction) => direction !== code);

    void save([...expertiseCodes, ...nextDirections]);
  }

  return {
    expertiseCodes,
    directions,
    isSaving,
    changeExpertiseCodes,
    changeDirection,
  };
}
