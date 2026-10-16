import type { RtnComment, RtnCommentSort, RtnCommentSortField } from "./types";

/** Возвращает дату комментария для сравнения и разрешения равных оценок. */
function commentTime(comment: RtnComment): number {
  return new Date(comment.created_at).getTime();
}

/** Получает значение выбранного критерия; полезность учитывает согласие с практикой. */
function commentValue(comment: RtnComment, field: RtnCommentSortField): number {
  if (field === "useful_count") {
    return comment.useful_count + comment.agree_count;
  }

  if (field === "is_expert") {
    return comment.author.is_expert ? 1 : 0;
  }

  return commentTime(comment);
}

/** Сортирует копию обсуждения; при равных значениях сначала показывает новые ответы. */
export function sortRtnComments(
  comments: RtnComment[],
  sort: RtnCommentSort,
): RtnComment[] {
  const field = sort.by;

  if (!field) {
    return comments;
  }

  const direction = sort.dir === "asc" ? 1 : -1;

  return [...comments].sort((first, second) => {
    const difference = commentValue(first, field) - commentValue(second, field);

    return direction * difference || commentTime(second) - commentTime(first);
  });
}
