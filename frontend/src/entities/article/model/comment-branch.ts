import type { ArticleComment } from "./types";

/** Убирает комментарий и все вложенные ответы, сохраняя остальные ветки. */
export function removeArticleCommentBranch(
  comments: ArticleComment[],
  commentId: number,
): ArticleComment[] {
  const replies = comments.filter((comment) => comment.parent_id === commentId);
  const remaining = comments.filter((comment) => comment.id !== commentId);

  return replies.reduce(
    (current, reply) => removeArticleCommentBranch(current, reply.id),
    remaining,
  );
}
