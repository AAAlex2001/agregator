"use client";

import { useEffect, useRef, useState } from "react";

/** Время показа подтверждения после копирования ссылки. */
const COPIED_FOR_MS = 3000;

/** Копирует приглашение; при запрете буфера выделяет ссылку для ручного копирования. */
export function useCopyReferralLink(link: string) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = window.setTimeout(() => setCopied(false), COPIED_FOR_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [copied]);

  /** Записывает ссылку в буфер и показывает подтверждение или способ скопировать её вручную. */
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setError(null);
      setCopied(true);
    } catch {
      inputRef.current?.select();
      setError("Ссылка выделена. Скопируйте её вручную через меню или Ctrl+C.");
    }
  }

  return {
    copied,
    error,
    inputRef,
    copyLink,
  };
}
