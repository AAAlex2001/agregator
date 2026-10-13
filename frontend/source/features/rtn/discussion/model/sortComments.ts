import type { RtnComment } from "@/source/entities/rtn";
import type { SortDir } from "@/source/shared/ui/SortPills";

export type CommentSortBy = "useful_count" | "created_at" | "is_expert";

export interface CommentSort {
  by: CommentSortBy | null;
  dir: SortDir | null;
}

function createdAt(comment: RtnComment): number {
  return new Date(comment.created_at).getTime();
}

function sortValue(comment: RtnComment, by: CommentSortBy): number {
  if (by === "useful_count") return comment.useful_count + comment.agree_count;
  if (by === "is_expert") return comment.author.is_expert ? 1 : 0;
  return createdAt(comment);
}

/** Порядок комментариев. Без сортировки — как пришли (старые сверху); при равных значениях выше более новые. */
export function sortComments(comments: RtnComment[], sort: CommentSort): RtnComment[] {
  const by = sort.by;
  if (!by) return comments;
  const direction = sort.dir === "asc" ? 1 : -1;
  return [...comments].sort((a, b) => direction * (sortValue(a, by) - sortValue(b, by)) || createdAt(b) - createdAt(a));
}
