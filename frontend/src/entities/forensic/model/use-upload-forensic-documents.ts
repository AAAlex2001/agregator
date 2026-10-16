"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { uploadForensicDocument } from "../api/upload-forensic-document";
import { useForensicProfileContext } from "./profile-provider";

/** Последовательно загружает документы о дополнительном образовании. */
export function useUploadForensicDocuments() {
  const { state, dispatch } = useForensicProfileContext();
  const { showError } = useNotifications();

  /** Сохраняет каждый принятый файл, даже если следующий документ не загружен. */
  async function uploadDocuments(files: File[]) {
    if (state.operation !== "idle" || files.length === 0) {
      return;
    }

    dispatch({
      type: "upload/started",
    });

    try {
      for (const file of files) {
        const profile = await uploadForensicDocument(file);

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
