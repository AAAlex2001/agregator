"use client";

import { useState } from "react";
import { updateResponseStatus } from "@/entities/response";
import type { ResponseStatus } from "@/entities/response";
import { useNotifications } from "@/shared/ui/notifications";

/** Переводит отклик в выбранный статус и сообщает об успехе списку. */
export function useChangeResponseStatus(
  responseId: number,
  status: ResponseStatus,
  onChanged: () => void,
) {
  const [isChanging, setIsChanging] = useState(false);
  const { showError } = useNotifications();

  /** Отправляет новый статус; при ошибке оставляет карточку без изменений. */
  async function changeStatus() {
    if (isChanging) {
      return;
    }

    setIsChanging(true);

    try {
      await updateResponseStatus(responseId, status);
      onChanged();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Ошибка обновления статуса");
    } finally {
      setIsChanging(false);
    }
  }

  return {
    isChanging,
    changeStatus,
  };
}
