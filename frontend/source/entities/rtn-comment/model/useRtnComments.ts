"use client";

import { useEffect, useState } from "react";
import type { SortDir } from "@/source/shared/ui/SortPills";
import {
  deleteRtnComment,
  fetchRtnComments,
  postRtnComment,
  reactToRtnComment,
} from "../api/rtnComment.api";
import type { CommentReactionValue, RtnComment, RtnCommentAttachment, RtnCommentSortBy } from "./types";

function withoutSubtree(comments: RtnComment[], rootId: number): RtnComment[] {
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

export function useRtnComments(clarificationId: number, initial?: RtnComment[]) {
  const [comments, setComments] = useState<RtnComment[]>(initial ?? []);
  const [loading, setLoading] = useState(initial === undefined);
  const [sortBy, setSortBy] = useState<RtnCommentSortBy | null>(null);
  const [sortDir, setSortDir] = useState<SortDir | null>(null);

  const load = async (nextSortBy: RtnCommentSortBy | null, nextSortDir: SortDir | null): Promise<void> => {
    setLoading(true);
    try {
      const list = await fetchRtnComments(clarificationId, { sortBy: nextSortBy, sortDir: nextSortDir });
      setComments(list);
    } catch {
      // Обсуждение не критично для страницы — молча оставляем прежний список при ошибке загрузки.
    } finally {
      setLoading(false);
    }
  };

  const setSort = (nextSortBy: RtnCommentSortBy | null, nextSortDir: SortDir | null): void => {
    setSortBy(nextSortBy);
    setSortDir(nextSortDir);
    void load(nextSortBy, nextSortDir);
  };

  useEffect(() => {
    // Дефолтная сортировка уже пришла с сервера (initial) — первый запрос нужен только без SSR-данных.
    if (initial === undefined) void load(null, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const add = async (text: string, parentId: number | null, attachments: RtnCommentAttachment[] = []) => {
    const created = await postRtnComment(clarificationId, text, parentId, attachments);
    setComments((prev) => [...prev, created]);
  };

  const remove = async (commentId: number) => {
    await deleteRtnComment(commentId);
    setComments((prev) => withoutSubtree(prev, commentId));
  };

  const react = async (commentId: number, value: CommentReactionValue) => {
    const result = await reactToRtnComment(commentId, value);
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              useful_count: result.useful_count,
              clarification_count: result.clarification_count,
              agree_count: result.agree_count,
              my_reaction: result.my_reaction,
            }
          : comment,
      ),
    );
  };

  return { comments, loading, sortBy, sortDir, setSort, add, remove, react };
}
