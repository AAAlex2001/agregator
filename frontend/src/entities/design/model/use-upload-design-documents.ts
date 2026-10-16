"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { uploadDesignDocument } from "../api/upload-design-document";
import { validateDesignUpload } from "./documents";
import { useDesignProfileContext } from "./profile-provider";
import type { DesignDocumentGroup } from "./types";

/** Загружает файлы в выбранную группу подтверждающих документов проектировщика. */
export function useUploadDesignDocuments() {
  const { state, dispatch } = useDesignProfileContext();
  const { showError } = useNotifications();

  /** Сохраняет каждый принятый файл, даже если следующий загрузить не удалось. */
  async function uploadDocuments(group: DesignDocumentGroup, files: File[]) {
    if (state.operation !== "idle" || files.length === 0) {
      return;
    }

    const validationError = validateDesignUpload(state.profile, group, files);

    if (validationError) {
      showError(validationError);
      return;
    }

    dispatch({
      type: "upload/started",
    });

    try {
      for (const file of files) {
        const profile = await uploadDesignDocument(group, file);

        dispatch({
          type: "documents/updated",
          documents: profile,
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
