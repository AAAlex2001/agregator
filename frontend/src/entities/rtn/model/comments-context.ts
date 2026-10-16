"use client";

import { createContext, useContext } from "react";
import type { RtnComment, RtnCommentCounters } from "./types";

/** Обсуждение разъяснения и применение подтверждённых сервером изменений. */
interface RtnCommentsContextValue {
  clarificationId: number;
  comments: RtnComment[];
  appendComment: (comment: RtnComment) => void;
  removeCommentBranch: (commentId: number) => void;
  updateCommentCounters: (commentId: number, counters: RtnCommentCounters) => void;
}

export const RtnCommentsContext = createContext<RtnCommentsContextValue | null>(null);

/** Возвращает обсуждение текущего разъяснения и действия для обновления списка. */
export function useRtnComments() {
  const context = useContext(RtnCommentsContext);

  if (!context) {
    throw new Error("Обсуждение должно находиться внутри RtnCommentsProvider");
  }

  return context;
}
