"use client";

import { useEffect, useState } from "react";
import { fetchRtnReactions, recordRtnView, sendRtnReaction, type RtnReactionState, type RtnReactionValue } from "@/source/entities/rtn";
import { useNotifications } from "@/source/shared/ui/Notifications";

/** Оценки разъяснения: сначала с сервера, затем — после засчитанного просмотра — с сессией, чтобы подсветить свою. */
export function useRtnReactions(clarificationId: number, initial: RtnReactionState) {
  const { showError } = useNotifications();
  const [state, setState] = useState(initial);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    recordRtnView(clarificationId)
      .then(() => fetchRtnReactions(clarificationId))
      .then((data) => {
        if (!cancelled) setState(data);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [clarificationId]);

  const react = async (value: RtnReactionValue) => {
    setIsSending(true);
    try {
      setState(await sendRtnReaction(clarificationId, value));
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить оценку");
    } finally {
      setIsSending(false);
    }
  };

  return { state, isSending, react };
}
