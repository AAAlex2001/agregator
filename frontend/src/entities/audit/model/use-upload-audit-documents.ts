"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { uploadAuditDocument } from "../api/upload-audit-document";
import { useAuditExpertProfileContext } from "./profile-provider";

/** Последовательно загружает дипломы, аттестаты и документы о курсах аудитора. */
export function useUploadAuditDocuments() {
  const { state, dispatch } = useAuditExpertProfileContext();
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
        const profile = await uploadAuditDocument(file);

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
