"use client";

import { useEffect, useState } from "react";

/**
 * Возвращает blob: URL для File. Освобождает его при смене файла или размонтировании.
 * Без useMemo — URL.createObjectURL имеет побочный эффект, и его место — в useEffect.
 */
export function useObjectUrl(file: File | null): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const next = URL.createObjectURL(file);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);

  return url;
}
