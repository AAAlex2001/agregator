"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { uploadEcologyDocument } from "../api/upload-ecology-document";
import { useEcologyProfileContext } from "./profile-provider";

/** Загружает файлы последовательно и сохраняет каждый успешный ответ. */
export function useUploadEcologyDocuments() {
  const { state, dispatch } = useEcologyProfileContext();
  const { showError } = useNotifications();

  /** Обновляет только документы, сохраняя текст и выбранные работы анкеты. */
  async function uploadDocuments(files: File[]) {
    if (state.operation !== "idle" || files.length === 0) {
      return;
    }

    dispatch({
      type: "upload/started",
    });

    try {
      for (const file of files) {
        const profile = await uploadEcologyDocument(file);

        dispatch({
          type: "documents/updated",
          documents: profile.documents,
        });
      }
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось обновить документы",
      );
    } finally {
      dispatch({
        type: "request/finished",
      });
    }
  }

  return uploadDocuments;
}
