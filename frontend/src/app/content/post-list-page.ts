import { POSTS_MAX_PAGE } from "@/entities/post";
import type { PostPage } from "@/entities/post";

/** Номер страницы списка публикаций из адреса: неверный — первая, большой — последняя доступная. */
export function readPostListPage(value: string | undefined): number {
  return Math.min(Math.max(1, Number(value) || 1), POSTS_MAX_PAGE);
}

/** Есть ли у списка следующая серверная страница для кнопки «Показать ещё». */
export function hasNextPostListPage(list: PostPage, page: number): boolean {
  return list.items.length < list.total && page < POSTS_MAX_PAGE;
}
