"use client";

import { useEffect, useState } from "react";
import { getRtnQuestionReplies } from "../api/get-rtn-question-replies";
import type { RtnQuestionReply } from "./types";

/** Загружает ответы открытого обращения и добавляет принятые сервером документы. */
export function useRtnQuestionReplies(questionId: number) {
  const [replies, setReplies] = useState<RtnQuestionReply[] | null>(null);

  useEffect(() => {
    let isActive = true;

    /** Не заменяет опубликованный ответ запоздавшим первоначальным списком. */
    function applyReplies(loadedReplies: RtnQuestionReply[]) {
      if (!isActive) {
        return;
      }

      setReplies((current) => {
        const addedReplies = (current ?? []).filter(
          (reply) => !loadedReplies.some((loaded) => loaded.id === reply.id),
        );

        return [...loadedReplies, ...addedReplies];
      });
    }

    getRtnQuestionReplies(questionId)
      .then(applyReplies)
      .catch(() => applyReplies([]));

    return () => {
      isActive = false;
    };
  }, [questionId]);

  /** Добавляет опубликованный ответ, сохраняя уже загруженные документы. */
  function appendReply(reply: RtnQuestionReply) {
    setReplies((current) => {
      if (current?.some((item) => item.id === reply.id)) {
        return current;
      }

      return [...(current ?? []), reply];
    });
  }

  return {
    replies,
    appendReply,
  };
}
