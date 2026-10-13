import { POSTS_MAX_PAGE } from "../model/types";

export interface PostFeedParams {
  author?: string;
  page?: string;
}

/** Автор и номер страницы из адреса ленты; неверные значения — как их отсутствие. */
export function readPostFeedPage(params: PostFeedParams) {
  const author = Number(params.author);
  const page = Number(params.page);

  const authorId = Number.isSafeInteger(author) && author > 0 ? author : undefined;
  const validPage = Number.isSafeInteger(page) && page > 0 ? page : 1;

  return {
    authorId,
    page: Math.min(validPage, POSTS_MAX_PAGE),
  };
}

/** Адрес страницы ленты: первая — без номера, автор сохраняется. */
export function postFeedUrl(page: number, authorId?: number): string {
  const query = new URLSearchParams();
  if (authorId) {
    query.set("author", String(authorId));
  }
  if (page > 1) {
    query.set("page", String(page));
  }
  return query.size ? `/posts?${query}` : "/posts";
}
