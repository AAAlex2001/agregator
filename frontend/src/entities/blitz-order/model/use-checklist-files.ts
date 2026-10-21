"use client";

import { useState } from "react";
import { useNotifications } from "@/shared/ui/notifications";
import { BLITZ_AUDIT_FILE_MAX_SIZE, BLITZ_FILE_LIMIT } from "../config/files";
import type { BlitzChecklistFile } from "./audit-types";

/** Файлы по пунктам перечня до отправки: не больше 20 за раз и по 500 МБ. */
export function useChecklistFiles() {
  const [entries, setEntries] = useState<BlitzChecklistFile[]>([]);
  const { showError } = useNotifications();

  /** Прикладывает файлы к пункту, если они проходят по количеству и размеру. */
  function addFiles(item: number, picked: FileList | null) {
    const added = picked ? [...picked] : [];

    if (entries.length + added.length > BLITZ_FILE_LIMIT) {
      showError(`За раз можно приложить не больше ${BLITZ_FILE_LIMIT} файлов`);
      return;
    }

    if (added.some((file) => file.size > BLITZ_AUDIT_FILE_MAX_SIZE)) {
      showError("Файл больше 500 МБ не поддерживается");
      return;
    }

    setEntries([...entries, ...added.map((file) => ({ item, file }))]);
  }

  /** Убирает файл из пункта. */
  function removeFile(entry: BlitzChecklistFile) {
    setEntries(entries.filter((item) => item !== entry));
  }

  /** Очищает файлы после отправки. */
  function clearFiles() {
    setEntries([]);
  }

  return { entries, addFiles, removeFile, clearFiles };
}