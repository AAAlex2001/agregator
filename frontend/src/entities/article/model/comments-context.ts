"use client";

import { createContext, useContext } from "react";
import type { ArticleComment } from "./types";

/** Комментарии одной статьи и применение подтверждённых изменений списка. */
interface ArticleCommentsContextValue {
  articleId: number;
  comments: ArticleComment[];
  appendComment: (comment: ArticleComment) => void;
  removeCommentBranch: (commentId: number) => void;
}

export const ArticleCommentsContext = createContext<ArticleCommentsContextValue | null>(null);

/** Возвращает комментарии статьи и действия для обновления обсуждения. */
export function useArticleComments() {
  const context = useContext(ArticleCommentsContext);

  if (!context) {
    throw new Error("Обсуждение должно находиться внутри ArticleCommentsProvider");
  }

  return context;
}
