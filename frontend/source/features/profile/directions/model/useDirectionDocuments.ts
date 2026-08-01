"use client";

import { useState } from "react";
import { useNotifications } from "@/source/shared/ui/Notifications";
import {
  deleteDirectionDocument,
  uploadDirectionDocument,
  type DirectionDocument,
  type DirectionKey,
} from "@/source/entities/direction";

interface Options {
  directionKey: DirectionKey;
  documents: DirectionDocument[];
  onChange: (key: DirectionKey, documents: DirectionDocument[]) => void;
}

export function useDirectionDocuments({ directionKey, documents, onChange }: Options) {
  const { showError } = useNotifications();
  const [isBusy, setIsBusy] = useState(false);

  const run = async (action: () => Promise<DirectionDocument[]>, fallback: string) => {
    if (isBusy) return;
    setIsBusy(true);
    try {
      onChange(directionKey, await action());
    } catch (error) {
      showError(error instanceof Error ? error.message : fallback);
    } finally {
      setIsBusy(false);
    }
  };

  return {
    documents,
    isBusy,
    upload: (file: File) =>
      run(() => uploadDirectionDocument(directionKey, file), "Не удалось загрузить документ"),
    remove: (url: string) =>
      run(() => deleteDirectionDocument(directionKey, url), "Не удалось удалить документ"),
  };
}
