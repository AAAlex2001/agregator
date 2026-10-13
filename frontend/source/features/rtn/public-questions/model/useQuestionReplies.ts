"use client";

import { useEffect, useState } from "react";
import { addRtnQuestionReply, fetchRtnQuestionReplies, type RtnFile, type RtnQuestionReply } from "@/source/entities/rtn";

/** Ответы сообщества на вопрос; null — ещё грузятся. */
export function useQuestionReplies(questionId: number) {
  const [replies, setReplies] = useState<RtnQuestionReply[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchRtnQuestionReplies(questionId)
      .catch(() => [])
      .then((list) => {
        if (!cancelled) setReplies(list);
      });
    return () => {
      cancelled = true;
    };
  }, [questionId]);

  const add = async (text: string, attachments: RtnFile[]) => {
    const reply = await addRtnQuestionReply(questionId, text, attachments);
    setReplies((current) => [...(current ?? []), reply]);
  };

  return { replies, add };
}
