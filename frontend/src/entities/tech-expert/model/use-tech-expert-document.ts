"use client";

import { useEffect, useState } from "react";
import { getTechExpertDocument } from "../api/get-tech-expert-document";
import type { TechExpertDocumentCard } from "./types";

/** Карточка последнего ответа и документ, для которого она получена. */
interface TechExpertDocumentState {
  documentId: number | null;
  card: TechExpertDocumentCard | null;
  error: string | null;
}

/** Загружает карточку открытого документа; null означает, что документ не открыт. */
export function useTechExpertDocument(documentId: number | null) {
  const [state, setState] = useState<TechExpertDocumentState>({
    documentId: null,
    card: null,
    error: null,
  });

  useEffect(() => {
    if (documentId === null) {
      return;
    }

    let isActive = true;

    getTechExpertDocument(documentId)
      .then((card) => {
        if (isActive) {
          setState({
            documentId,
            card,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            documentId,
            card: null,
            error: error instanceof Error ? error.message : "Не удалось открыть документ",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [documentId]);

  const isCurrent = documentId !== null && state.documentId === documentId;

  return {
    card: isCurrent ? state.card : null,
    error: isCurrent ? state.error : null,
    isLoading: documentId !== null && !isCurrent,
  };
}
