"use client";

import { useEffect, useState } from "react";
import {
  deleteRtnComment,
  fetchRtnComments,
  postRtnComment,
  reactToRtnComment,
  type RtnComment,
  type RtnCommentReaction,
  type RtnFile,
} from "@/source/entities/rtn";
import { threadIds } from "@/source/shared/lib/commentThread";
import { useNotifications } from "@/source/shared/ui/Notifications";

/** Обсуждение: показывается сразу с сервера, затем перечитывается с сессией, чтобы отметить свои комментарии и реакции. */
export function useRtnComments(clarificationId: number, initial: RtnComment[]) {
  const { showError } = useNotifications();
  const [comments, setComments] = useState(initial);

  useEffect(() => {
    let cancelled = false;
    fetchRtnComments(clarificationId)
      .then((list) => {
        if (!cancelled) setComments(list);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [clarificationId]);

  const add = async (text: string, parentId: number | null, attachments: RtnFile[]) => {
    const created = await postRtnComment(clarificationId, text, parentId, attachments);
    setComments((current) => [...current, created]);
  };

  const remove = async (commentId: number) => {
    await deleteRtnComment(commentId);
    setComments((current) => {
      const removed = threadIds(current, commentId);
      return current.filter((comment) => !removed.has(comment.id));
    });
  };

  const react = async (commentId: number, value: RtnCommentReaction) => {
    try {
      const counters = await reactToRtnComment(commentId, value);
      setComments((current) => current.map((comment) => (comment.id === commentId ? { ...comment, ...counters } : comment)));
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить реакцию");
    }
  };

  return { comments, add, remove, react };
}
