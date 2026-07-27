"use client";

import { useEffect, useState } from "react";
import {
  fetchRtnReactions,
  recordRtnView,
  sendRtnReaction,
  type RtnReactionState,
  type RtnReactionValue,
} from "../api/rtnClarification.api";

export function useRtnReactions(
  clarificationId: number,
  initial: RtnReactionState,
) {
  const [state, setState] = useState(initial);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchRtnReactions(clarificationId), recordRtnView(clarificationId)])
      .then(([reactions, viewsCount]) => {
        if (!cancelled) {
          setState({
            ...reactions,
            views_count: viewsCount ?? reactions.views_count,
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [clarificationId]);

  const react = async (value: RtnReactionValue) => {
    setPending(true);
    try {
      setState(await sendRtnReaction(clarificationId, value));
    } finally {
      setPending(false);
    }
  };

  return { state, react, pending };
}
