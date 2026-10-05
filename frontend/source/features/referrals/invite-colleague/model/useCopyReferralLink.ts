"use client";

import { useEffect, useRef, useState } from "react";
import type { CopyLinkState } from "./types";

/** Копирует ссылку; при запрете буфера выделяет поле для ручного копирования. */
export function useCopyReferralLink(link: string | undefined) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<CopyLinkState>({ copied: false, isCopying: false, error: null });

  useEffect(() => {
    if (!state.copied) return;

    const timeout = window.setTimeout(() => {
      setState((current) => ({ ...current, copied: false }));
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [state.copied]);

  async function copyLink(): Promise<void> {
    if (!link || state.isCopying) return;
    setState({ copied: false, isCopying: true, error: null });

    try {
      await navigator.clipboard.writeText(link);
      setState({ copied: true, isCopying: false, error: null });
    } catch {
      inputRef.current?.focus();
      inputRef.current?.select();
      setState({
        copied: false,
        isCopying: false,
        error: "Ссылка выделена. Скопируйте её вручную через меню или Ctrl+C.",
      });
    }
  }

  return { ...state, inputRef, copyLink };
}
