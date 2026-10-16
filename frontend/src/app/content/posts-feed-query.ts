import type { PostPage } from "@/entities/post";
import { readPostListPage } from "./post-list-page";

/** Автор и количество серверных страниц ленты из адреса. */
interface PostsFeedSearchParams {
  author?: string;
  page?: string;
}

/** Параметры адреса, которые Next.js передаёт странице ленты. */
export interface PostsFeedPageProps {
  searchParams: Promise<PostsFeedSearchParams>;
}

/** Читает ленту из адреса: ?author=12 — публикации автора, ?page=3 — первые три страницы. */
export function readPostsFeed(params: PostsFeedSearchParams) {
  const authorId = Number(params.author) || undefined;
  const page = readPostListPage(params.page);

  if (authorId) {
    return {
      authorId,
      page,
      apiPath: `/posts/author/${authorId}`,
      path: `/posts?author=${authorId}`,
      nextPageHref: `/posts?author=${authorId}&page=${page + 1}`,
    };
  }

  return {
    authorId,
    page,
    apiPath: "/posts/feed",
    path: "/posts",
    nextPageHref: `/posts?page=${page + 1}`,
  };
}

/** Заголовок ленты; у ленты автора — с именем из его публикаций. */
export function getPostsFeedTitle(
  feed: PostPage | null,
  authorId?: number,
): string {
  if (!authorId) {
    return "Публикации сообщества";
  }

  const authorName = feed?.items[0]?.author.name;

  return authorName ? `Публикации: ${authorName}` : "Публикации автора";
}
