"use client";

import { useEffect, useState } from "react";
import { deleteComment, fetchComments, postComment } from "../api/comment.api";
import type { ArticleComment } from "./types";

function withoutSubtree(comments: ArticleComment[], rootId: number): ArticleComment[] {
  const removed = new Set<number>([rootId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const comment of comments) {
      if (comment.parent_id !== null && removed.has(comment.parent_id) && !removed.has(comment.id)) {
        removed.add(comment.id);
        changed = true;
      }
    }
  }
  return comments.filter((comment) => !removed.has(comment.id));
}

export function useArticleComments(articleId: number) {
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchComments(articleId)
      .then((list) => {
        if (!cancelled) setComments(list);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [articleId]);

  const add = async (text: string, parentId: number | null) => {
    const created = await postComment(articleId, text, parentId);
    setComments((prev) => [...prev, created]);
  };

  const remove = async (commentId: number) => {
    await deleteComment(commentId);
    setComments((prev) => withoutSubtree(prev, commentId));
  };

  return { comments, loading, add, remove };
}
