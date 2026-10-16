"use client";

import { useState } from "react";
import { getTechExpertDocumentContent } from "../api/get-tech-expert-document-content";

/** Склеенный текст загруженных блоков и состояние загрузки следующего. */
interface DocumentContentState {
  html: string;
  loadedBlocks: number;
  isLoading: boolean;
  error: string | null;
}

/** Догружает текст документа по блокам, когда читатель доходит до конца загруженного. */
export function useDocumentContent(documentId: number, blocks: number) {
  const [state, setState] = useState<DocumentContentState>({
    html: "",
    loadedBlocks: 0,
    isLoading: false,
    error: null,
  });

  /** Загружает следующий блок; после ошибки текст больше не догружается. */
  async function loadMore() {
    const block = state.loadedBlocks + 1;

    setState((current) => ({ ...current, isLoading: true }));

    try {
      const chunk = await getTechExpertDocumentContent(documentId, block);

      setState((current) => ({
        html: current.html + chunk,
        loadedBlocks: block,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        isLoading: false,
        error: error instanceof Error ? error.message : "Не удалось загрузить содержимое",
      }));
    }
  }

  return {
    html: state.html,
    isLoading: state.isLoading,
    error: state.error,
    hasMore: !state.error && state.loadedBlocks < blocks,
    loadMore,
  };
}
