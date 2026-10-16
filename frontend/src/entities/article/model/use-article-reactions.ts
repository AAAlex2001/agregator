"use client";

import { useEffect, useRef, useState } from "react";
import { getArticleReactions } from "../api/get-reactions";
import type { ArticleReactions } from "./types";

/** Счётчики статьи до получения данных, если серверная загрузка не удалась. */
const EMPTY_REACTIONS: ArticleReactions = {
  likes_count: 0,
  dislikes_count: 0,
  views_count: 0,
  my_reaction: null,
};

/** Уточняет серверные счётчики с учётом оценки текущего посетителя. */
export function useArticleReactions(
  articleId: number,
  initial: ArticleReactions | undefined,
) {
  const [reactions, setReactions] = useState(initial ?? EMPTY_REACTIONS);
  const hasReactionChanged = useRef(false);

  useEffect(() => {
    let isActive = true;

    /** Не заменяет новую оценку запоздавшим ответом первоначальной загрузки. */
    async function loadReactions() {
      try {
        const loadedReactions = await getArticleReactions(articleId);

        if (isActive && !hasReactionChanged.current) {
          setReactions(loadedReactions);
        }
      } catch {
        // При ошибке оставляем счётчики, полученные при открытии страницы.
      }
    }

    void loadReactions();

    return () => {
      isActive = false;
    };
  }, [articleId]);

  /** Применяет результат сохранения оценки вместо первоначальных данных. */
  function updateReactions(updatedReactions: ArticleReactions) {
    hasReactionChanged.current = true;
    setReactions(updatedReactions);
  }

  return {
    reactions,
    updateReactions,
  };
}
