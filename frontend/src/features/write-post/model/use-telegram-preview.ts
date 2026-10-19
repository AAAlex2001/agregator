"use client";

import { useEffect, useState } from "react";
import { getTelegramPreview } from "@/entities/post";
import type { TelegramPreview } from "@/entities/post";

/** Предпросмотр из последнего ответа и для какого текста он получен. */
interface PreviewState {
  key: string | null;
  preview: TelegramPreview | null;
  error: string | null;
}

/** Текст поста в разметке Telegram. Запрашивается, пока окно предпросмотра открыто. */
export function useTelegramPreview(html: string, mediaCount: number, isOpen: boolean) {
  const key = isOpen ? `${mediaCount}:${html}` : null;
  const [state, setState] = useState<PreviewState>({
    key: null,
    preview: null,
    error: null,
  });

  useEffect(() => {
    if (key === null) {
      return;
    }

    let isActive = true;

    getTelegramPreview(html, mediaCount)
      .then((preview) => {
        if (isActive) {
          setState({ key, preview, error: null });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            key,
            preview: null,
            error: error instanceof Error ? error.message : "Не удалось подготовить предпросмотр",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [key, html, mediaCount]);

  const isLoading = key !== null && state.key !== key;

  return {
    preview: isLoading ? null : state.preview,
    error: isLoading ? null : state.error,
    isLoading,
  };
}
