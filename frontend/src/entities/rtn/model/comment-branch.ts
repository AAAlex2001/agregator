import type { RtnComment } from "./types";

/** Убирает удалённый комментарий и все вложенные ответы, сохраняя остальные ветки. */
export function removeRtnCommentBranch(
  comments: RtnComment[],
  commentId: number,
): RtnComment[] {
  const replies = comments.filter((comment) => comment.parent_id === commentId);
  const remaining = comments.filter((comment) => comment.id !== commentId);

  return replies.reduce(
    (current, reply) => removeRtnCommentBranch(current, reply.id),
    remaining,
  );
}
