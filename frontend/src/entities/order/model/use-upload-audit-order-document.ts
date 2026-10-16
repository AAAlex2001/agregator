"use client";

import { useEffect, useRef, useState } from "react";
import { useNotifications } from "@/shared/ui/notifications";
import { uploadAuditOrderDocument } from "../api/upload-audit-order-document";
import type { AuditOrderDocument } from "./details/audit";

/** Прикрепляет документ аудита, пока поле относится к открытой форме. */
export function useUploadAuditOrderDocument(
  onUploaded: (document: AuditOrderDocument) => void,
) {
  const { showError } = useNotifications();
  const [isUploading, setIsUploading] = useState(false);
  const isFieldOpen = useRef(true);

  useEffect(() => {
    isFieldOpen.current = true;

    return () => {
      isFieldOpen.current = false;
    };
  }, []);

  /** Применяет загруженный файл только к тому полю, в котором его выбрали. */
  async function uploadDocument(file: File) {
    if (isUploading) {
      return;
    }

    setIsUploading(true);

    try {
      const document = await uploadAuditOrderDocument(file);

      if (isFieldOpen.current) {
        onUploaded(document);
      }
    } catch (error) {
      if (isFieldOpen.current) {
        showError(
          error instanceof Error ? error.message : "Не удалось загрузить файл",
        );
      }
    } finally {
      if (isFieldOpen.current) {
        setIsUploading(false);
      }
    }
  }

  return {
    isUploading,
    uploadDocument,
  };
}
