"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { uploadSroDocument } from "../api/upload-sro-document";
import { useSroProfileContext } from "./profile-provider";

/** Последовательно загружает дополнительные документы члена СРО. */
export function useUploadSroDocuments() {
  const { direction, state, dispatch } = useSroProfileContext();
  const { showError } = useNotifications();

  /** Сохраняет каждый принятый файл, даже если следующий загрузить не удалось. */
  async function uploadDocuments(files: File[]) {
    if (state.operation !== "idle" || files.length === 0) {
      return;
    }

    dispatch({
      type: "upload/started",
    });

    try {
      for (const file of files) {
        const profile = await uploadSroDocument(direction, file);

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
