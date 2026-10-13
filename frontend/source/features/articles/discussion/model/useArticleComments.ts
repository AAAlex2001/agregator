"use client";

import { useEffect, useState } from "react";
import { deleteComment, fetchComments, postComment, type ArticleComment } from "@/source/entities/article";
import { threadIds } from "@/source/shared/lib/commentThread";

/** Комментарии к статье: показываются сразу с сервера, затем перечитываются с сессией, чтобы отметить свои. */
export function useArticleComments(articleId: number, initial: ArticleComment[]) {
  const [comments, setComments] = useState(initial);

  useEffect(() => {
    let cancelled = false;
    fetchComments(articleId)
      .then((list) => {
        if (!cancelled) setComments(list);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [articleId]);

  const add = async (text: string, parentId: number | null) => {
    const created = await postComment(articleId, text, parentId);
    setComments((current) => [...current, created]);
  };

  const remove = async (commentId: number) => {
    await deleteComment(commentId);
    setComments((current) => {
      const removed = threadIds(current, commentId);
      return current.filter((comment) => !removed.has(comment.id));
    });
  };

  return { comments, add, remove };
}
