"use client";

import { useEffect, useRef, useState } from "react";
import { getRtnReactions } from "../api/get-rtn-reactions";
import { recordRtnView } from "../api/record-rtn-view";
import type { RtnReactions } from "./types";

/** Уточняет оценки после учёта просмотра, сохраняя серверные данные при сбое. */
export function useRtnReactions(clarificationId: number, initial: RtnReactions) {
  const [reactions, setReactions] = useState(initial);
  const hasReactionChanged = useRef(false);

  useEffect(() => {
    let isActive = true;

    /** Загружает свою оценку и не заменяет ей более поздний результат голосования. */
    async function loadReactions() {
      try {
        await recordRtnView(clarificationId);
        const loadedReactions = await getRtnReactions(clarificationId);

        if (isActive && !hasReactionChanged.current) {
          setReactions(loadedReactions);
        }
      } catch {
        // При сбое остаются счётчики, загруженные вместе с разъяснением.
      }
    }

    void loadReactions();

    return () => {
      isActive = false;
    };
  }, [clarificationId]);

  /** Применяет подтверждённый сервером результат голосования. */
  function updateReactions(updatedReactions: RtnReactions) {
    hasReactionChanged.current = true;
    setReactions(updatedReactions);
  }

  return {
    reactions,
    updateReactions,
  };
}
