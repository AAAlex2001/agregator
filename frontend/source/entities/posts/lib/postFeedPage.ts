export interface PostFeedParams {
  author?: string;
  page?: string;
}

/** Читает автора и номер страницы из адреса ленты. */
export function readPostFeedPage(params: PostFeedParams) {
  const author = Number(params.author);
  const requestedPage = Number(params.page);
  const authorId = Number.isSafeInteger(author) && author > 0 ? author : undefined;
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  return { authorId, page };
}

/** Сохраняет автора при переходе между страницами ленты. */
export function postFeedUrl(page: number, authorId?: number): string {
  const query = new URLSearchParams();
  if (authorId) query.set("author", String(authorId));
  if (page > 1) query.set("page", String(page));
  return query.size ? `/posts?${query}` : "/posts";
}
