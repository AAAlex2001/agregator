"use client";

import { useLicenseDocument } from "@/entities/user";
import type { LicenseDocumentKind } from "@/entities/user";
import { useNotifications } from "@/shared/ui/notifications";
import { DOCUMENT_SUCCESS_MESSAGES } from "../config/documents";

/** Загружает документ сразу после выбора и сообщает результат операции. */
export function useLicenseDocumentField(kind: LicenseDocumentKind) {
  const { isUploading, upload, removeCompanyCard } = useLicenseDocument(kind);
  const { showError, showSuccess } = useNotifications();

  /** Сохраняет выбранный файл отдельно от остальных полей формы. */
  async function uploadDocument(file: File) {
    try {
      await upload(file);
      showSuccess(DOCUMENT_SUCCESS_MESSAGES[kind]);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось загрузить файл");
    }
  }

  /** Удаляет необязательную карточку предприятия. */
  async function removeDocument() {
    try {
      await removeCompanyCard();
      showSuccess("Карточка предприятия удалена");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось удалить файл");
    }
  }

  return {
    isUploading,
    uploadDocument,
    removeDocument,
  };
}
