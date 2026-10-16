"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { reportPost, reportPostComment } from "@/entities/post";
import { useNotifications } from "@/shared/ui/notifications";
import type { ReportTarget } from "./types";

/** Жалоба модератору на публикацию или комментарий. */
export function useReportPost(id: number, target: ReportTarget, onSent: () => void) {
  const { showSuccess, showError } = useNotifications();
  const [reason, setReason] = useState("");
  const [isSending, setIsSending] = useState(false);

  /** Отправляет причину жалобы и закрывает окно после успеха. */
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);

    try {
      if (target === "post") {
        await reportPost(id, reason.trim());
      } else {
        await reportPostComment(id, reason.trim());
      }

      showSuccess("Жалоба отправлена модератору");
      onSent();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось отправить жалобу");
    } finally {
      setIsSending(false);
    }
  }

  return {
    reason,
    isSending,
    setReason,
    submit,
  };
}
