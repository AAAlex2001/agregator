"use client";

import { useState, type FormEvent } from "react";
import { reportRtnChange } from "@/source/entities/rtn";
import { useNotifications } from "@/source/shared/ui/Notifications";

type ReportStatus = "editing" | "sending" | "sent";

/** Текст сообщения модератору и ход отправки. */
export function useReportChange(clarificationId: number) {
  const { showError } = useNotifications();
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ReportStatus>("editing");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const value = description.trim();
    if (!value) {
      showError("Опишите, что изменилось");
      return;
    }
    setStatus("sending");
    try {
      await reportRtnChange(clarificationId, value);
      setStatus("sent");
    } catch (error) {
      setStatus("editing");
      showError(error instanceof Error ? error.message : "Не удалось отправить сообщение");
    }
  };

  return { description, setDescription, status, submit };
}
