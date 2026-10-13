"use client";

import { useEffect, useState } from "react";
import { fetchReactions, sendReaction, type ReactionState, type ReactionValue } from "@/source/entities/article";
import { useNotifications } from "@/source/shared/ui/Notifications";

const EMPTY: ReactionState = { likes_count: 0, dislikes_count: 0, views_count: 0, my_reaction: null };

/** Оценки статьи: показываются сразу с сервера, затем перечитываются с сессией, чтобы подсветить свою. */
export function useArticleReactions(articleId: number, initial: ReactionState | undefined) {
  const { showError } = useNotifications();
  const [state, setState] = useState(initial ?? EMPTY);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchReactions(articleId)
      .then((data) => {
        if (!cancelled) setState(data);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [articleId]);

  const react = async (value: ReactionValue) => {
    setIsSending(true);
    try {
      setState(await sendReaction(articleId, value));
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить оценку");
    } finally {
      setIsSending(false);
    }
  };

  return { state, isSending, react };
}
