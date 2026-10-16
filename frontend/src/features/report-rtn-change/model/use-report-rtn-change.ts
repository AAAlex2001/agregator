"use client";

import { useState } from "react";
import { reportRtnChange } from "@/entities/rtn";
import { useNotifications } from "@/shared/ui/notifications";
import type { ReportStatus } from "./types";

/** Проверяет описание неточности и отправляет сообщение модератору. */
export function useReportRtnChange(clarificationId: number) {
  const { showError } = useNotifications();
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ReportStatus>("editing");

  /** Обновляет текст сообщения, сохраняя его при ошибке отправки. */
  function changeDescription(value: string) {
    setDescription(value);
  }

  /** Отправляет заполненное сообщение и открывает подтверждение успеха. */
  async function submit() {
    if (status !== "editing") {
      return;
    }

    const message = description.trim();

    if (!message) {
      showError("Опишите, что изменилось");
      return;
    }

    setStatus("sending");

    try {
      await reportRtnChange(clarificationId, message);
      setStatus("sent");
    } catch (error) {
      setStatus("editing");
      showError(
        error instanceof Error ? error.message : "Не удалось отправить сообщение",
      );
    }
  }

  return {
    description,
    status,
    changeDescription,
    submit,
  };
}
