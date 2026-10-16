"use client";

import { useEffect, useRef } from "react";
import type { LocalFile } from "./local-file";

/** Владеет временными адресами файлов формы и освобождает их при закрытии. */
export function useLocalFiles() {
  const previewUrls = useRef(new Set<string>());

  useEffect(() => {
    const urls = previewUrls.current;

    return () => {
      for (const url of urls) {
        URL.revokeObjectURL(url);
      }

      urls.clear();
    };
  }, []);

  /** Создаёт адрес предпросмотра; вызывается при выборе файла пользователем. */
  function createFile(file: File): LocalFile {
    const previewUrl = URL.createObjectURL(file);
    previewUrls.current.add(previewUrl);

    return { file, previewUrl };
  }

  /** Освобождает адрес файла после его удаления или замены в форме. */
  function removeFile(selected: LocalFile): void {
    URL.revokeObjectURL(selected.previewUrl);
    previewUrls.current.delete(selected.previewUrl);
  }

  /** Освобождает все адреса при сбросе формы или смене её роли. */
  function clearFiles(): void {
    for (const url of previewUrls.current) {
      URL.revokeObjectURL(url);
    }

    previewUrls.current.clear();
  }

  return { createFile, removeFile, clearFiles };
}
