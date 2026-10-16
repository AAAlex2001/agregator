"use client";

import { useState } from "react";
import {
  uploadContactReceipt,
  useExpertContacts,
} from "@/entities/expert-contact";
import type { LocalFile } from "@/shared/lib/local-file";
import { useLocalFiles } from "@/shared/lib/use-local-files";
import { useNotifications } from "@/shared/ui/notifications";

/** Хранит выбранный чек с предпросмотром и отправляет его исполнителю на проверку. */
export function useUploadContactReceipt(dealId: number) {
  const { showDeal } = useExpertContacts();
  const { showError, showSuccess } = useNotifications();
  const { createFile, removeFile } = useLocalFiles();
  const [receipt, setReceipt] = useState<LocalFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  /** Заменяет выбранный чек новым файлом. */
  function selectReceipt(file: File) {
    if (receipt) {
      removeFile(receipt);
    }

    setReceipt(createFile(file));
  }

  /** Убирает выбранный чек до отправки. */
  function clearReceipt() {
    if (receipt) {
      removeFile(receipt);
    }

    setReceipt(null);
  }

  /** Загружает чек и показывает сделку с новым этапом проверки оплаты. */
  async function upload() {
    if (!receipt || isUploading) {
      return;
    }

    setIsUploading(true);

    try {
      const deal = await uploadContactReceipt(dealId, receipt.file);
      await showDeal(deal);
      clearReceipt();
      showSuccess("Чек отправлен");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось загрузить чек");
    } finally {
      setIsUploading(false);
    }
  }

  return {
    receipt,
    isUploading,
    selectReceipt,
    clearReceipt,
    upload,
  };
}
