"use client";

import { useEffect, useState } from "react";
import { fetchReactions, sendReaction } from "../api/reaction.api";
import type { ReactionState, ReactionValue } from "./types";

const EMPTY: ReactionState = {
  likes_count: 0,
  dislikes_count: 0,
  views_count: 0,
  my_reaction: null,
};

export function useArticleReactions(articleId: number, initial?: ReactionState) {
  const [state, setState] = useState<ReactionState>(initial ?? EMPTY);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchReactions(articleId)
      .then((data) => {
        if (!cancelled) setState(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [articleId]);

  const react = async (value: ReactionValue) => {
    setPending(true);
    try {
      setState(await sendReaction(articleId, value));
    } finally {
      setPending(false);
    }
  };

  return { state, react, pending };
}
