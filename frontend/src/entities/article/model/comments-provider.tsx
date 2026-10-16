"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { getArticleComments } from "../api/get-comments";
import type { ArticleComment } from "./types";
import { removeArticleCommentBranch } from "./comment-branch";
import { ArticleCommentsContext } from "./comments-context";

/** Серверное обсуждение одной статьи и компоненты для работы с ним. */
interface ArticleCommentsProviderProps {
  articleId: number;
  initialComments: ArticleComment[];
  children: ReactNode;
}

/** Показывает серверные комментарии и уточняет их принадлежность в браузере. */
export function ArticleCommentsProvider({
  articleId,
  initialComments,
  children,
}: ArticleCommentsProviderProps) {
  const [comments, setComments] = useState(initialComments);
  const hasCommentsChanged = useRef(false);

  useEffect(() => {
    let isActive = true;

    /** Применяет список, пока он не изменён отправкой или удалением комментария. */
    async function loadComments() {
      try {
        const loadedComments = await getArticleComments(articleId);

        if (isActive && !hasCommentsChanged.current) {
          setComments(loadedComments);
        }
      } catch {
        // При ошибке чтения сохраняем комментарии из серверной страницы.
      }
    }

    void loadComments();

    return () => {
      isActive = false;
    };
  }, [articleId]);

  /** Добавляет принятый сервером комментарий в конец обсуждения. */
  function appendComment(comment: ArticleComment) {
    hasCommentsChanged.current = true;
    setComments((current) => [...current, comment]);
  }

  /** Убирает удалённый комментарий вместе со всеми ответами на него. */
  function removeCommentBranch(commentId: number) {
    hasCommentsChanged.current = true;
    setComments((current) => removeArticleCommentBranch(current, commentId));
  }

  return (
    <ArticleCommentsContext.Provider
      value={{
        articleId,
        comments,
        appendComment,
        removeCommentBranch,
      }}
    >
      {children}
    </ArticleCommentsContext.Provider>
  );
}
