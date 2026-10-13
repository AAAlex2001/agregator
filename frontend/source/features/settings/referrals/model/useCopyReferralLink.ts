"use client";

import { useEffect, useRef, useState } from "react";

const COPIED_FOR_MS = 3000;
const MANUAL_COPY = "Ссылка выделена. Скопируйте её вручную через меню или Ctrl+C.";

/** Копирует ссылку в буфер и на 3 секунды показывает «Скопировано»; если браузер запретил доступ, выделяет поле. */
export function useCopyReferralLink(link: string) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), COPIED_FOR_MS);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setError(null);
      setCopied(true);
    } catch {
      inputRef.current?.select();
      setError(MANUAL_COPY);
    }
  };

  return { copied, error, inputRef, copyLink };
}
