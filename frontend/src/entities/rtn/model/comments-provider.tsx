"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { getRtnComments } from "../api/get-rtn-comments";
import type { RtnComment, RtnCommentCounters } from "./types";
import { removeRtnCommentBranch } from "./comment-branch";
import { RtnCommentsContext } from "./comments-context";

/** Серверное обсуждение одного разъяснения и компоненты для работы с ним. */
interface RtnCommentsProviderProps {
  clarificationId: number;
  initialComments: RtnComment[];
  children: ReactNode;
}

/** Показывает серверные комментарии и уточняет свои отметки после открытия страницы. */
export function RtnCommentsProvider({
  clarificationId,
  initialComments,
  children,
}: RtnCommentsProviderProps) {
  const [comments, setComments] = useState(initialComments);
  const hasCommentsChanged = useRef(false);

  useEffect(() => {
    let isActive = true;

    /** Не заменяет новые комментарии или оценки запоздавшим первоначальным списком. */
    async function loadComments() {
      try {
        const loadedComments = await getRtnComments(clarificationId);

        if (isActive && !hasCommentsChanged.current) {
          setComments(loadedComments);
        }
      } catch {
        // При сбое оставляем обсуждение из серверной страницы.
      }
    }

    void loadComments();

    return () => {
      isActive = false;
    };
  }, [clarificationId]);

  /** Добавляет принятый сервером комментарий в конец обсуждения. */
  function appendComment(comment: RtnComment) {
    hasCommentsChanged.current = true;
    setComments((current) => [...current, comment]);
  }

  /** Убирает удалённую ветку обсуждения вместе со всеми ответами. */
  function removeCommentBranch(commentId: number) {
    hasCommentsChanged.current = true;
    setComments((current) => removeRtnCommentBranch(current, commentId));
  }

  /** Обновляет счётчики одного комментария после сохранения реакции. */
  function updateCommentCounters(commentId: number, counters: RtnCommentCounters) {
    hasCommentsChanged.current = true;
    setComments((current) => current.map((comment) => {
      if (comment.id !== commentId) {
        return comment;
      }

      return {
        ...comment,
        ...counters,
      };
    }));
  }

  return (
    <RtnCommentsContext.Provider
      value={{
        clarificationId,
        comments,
        appendComment,
        removeCommentBranch,
        updateCommentCounters,
      }}
    >
      {children}
    </RtnCommentsContext.Provider>
  );
}
