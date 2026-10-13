import { POSTS_MAX_PAGE, type PostPage } from "../model/types";

/** Номер страницы списка из адреса: неверный — первая, слишком большой — последняя доступная. */
export function readPage(value: string | undefined): number {
  const page = Number(value);
  if (!Number.isSafeInteger(page) || page < 1) {
    return 1;
  }
  return Math.min(page, POSTS_MAX_PAGE);
}

/** Адрес страницы списка публикаций: первая — без номера. */
export function postListUrl(
  path: string,
  page: number,
  params: Record<string, string> = {},
): string {
  const query = new URLSearchParams(params);
  if (page > 1) {
    query.set("page", String(page));
  }
  return query.size ? `${path}?${query}` : path;
}

/** Ссылка «Показать ещё» на следующую страницу списка; показано всё — undefined. */
export function nextPostListUrl(
  list: PostPage,
  page: number,
  path: string,
  params: Record<string, string> = {},
): string | undefined {
  const hasMore = list.items.length < list.total && page < POSTS_MAX_PAGE;
  return hasMore ? postListUrl(path, page + 1, params) : undefined;
}
