"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { uploadCadastralDocument } from "../api/upload-cadastral-document";
import { useCadastralProfileContext } from "./profile-provider";

/** Последовательно добавляет документы и сохраняет каждый успешный ответ. */
export function useUploadCadastralDocuments() {
  const { state, dispatch } = useCadastralProfileContext();
  const { showError } = useNotifications();

  /** Показывает уже загруженные файлы, даже если следующий файл не принят. */
  async function uploadDocuments(files: File[]) {
    if (state.operation !== "idle" || files.length === 0) {
      return;
    }

    dispatch({
      type: "upload/started",
    });

    try {
      for (const file of files) {
        const profile = await uploadCadastralDocument(file);

        dispatch({
          type: "files/updated",
          profile,
        });
      }
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось обновить файлы",
      );
    } finally {
      dispatch({
        type: "request/finished",
      });
    }
  }

  return uploadDocuments;
}
