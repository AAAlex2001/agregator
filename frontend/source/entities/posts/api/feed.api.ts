import { send } from "@/source/shared/api/request";
import type { PostFeedQuery, PostPage, PostCounts, PostStatus } from "../model/types";

/** Загружает общую ленту. */
export async function fetchFeed(
  limit: number,
  offset: number,
  signal?: AbortSignal,
): Promise<PostPage> {
  const response = await send(
    `/posts/feed?limit=${limit}&offset=${offset}`,
    { signal, cache: "no-store" },
    "Не удалось загрузить ленту",
  );
  return response.json();
}

/** Загружает публикации авторов из подписок. */
export async function fetchFollowingFeed(
  limit: number,
  offset: number,
  signal?: AbortSignal,
): Promise<PostPage> {
  const response = await send(
    `/posts/feed/following?limit=${limit}&offset=${offset}`,
    { signal, cache: "no-store" },
    "Не удалось загрузить подписки",
  );
  return response.json();
}

/** Загружает публикации выбранного автора. */
export async function fetchAuthorPosts(
  authorId: number,
  limit: number,
  offset: number,
  signal?: AbortSignal,
): Promise<PostPage> {
  const response = await send(
    `/posts/author/${authorId}?limit=${limit}&offset=${offset}`,
    { signal, cache: "no-store" },
    "Не удалось загрузить публикации автора",
  );
  return response.json();
}

/** Возвращает число непрочитанных публикаций в подписках. */
export async function fetchFollowingUnseen(signal?: AbortSignal): Promise<{ count: number }> {
  const response = await send(
    "/posts/feed/following/unseen",
    { signal },
    "Не удалось загрузить счётчик",
  );
  return response.json();
}

/** Отмечает подписки просмотренными. */
export async function markFollowingSeen(): Promise<void> {
  await send("/posts/feed/following/seen", { method: "POST" }, "Не удалось отметить подписки");
}

/** Загружает свои публикации выбранного статуса. */
export async function fetchMyPosts(
  status: PostStatus,
  limit: number,
  offset: number,
  signal?: AbortSignal,
): Promise<PostPage> {
  const response = await send(
    `/posts/my?status=${status}&limit=${limit}&offset=${offset}`,
    { signal, cache: "no-store" },
    "Не удалось загрузить публикации",
  );
  return response.json();
}

/** Возвращает количество своих публикаций и черновиков. */
export async function fetchMyPostCounts(signal?: AbortSignal): Promise<PostCounts> {
  const response = await send("/posts/my/counts", { signal }, "Не удалось загрузить счётчики");
  return response.json();
}

/** Загружает сохранённые публикации. */
export async function fetchSavedPosts(
  limit: number,
  offset: number,
  signal?: AbortSignal,
): Promise<PostPage> {
  const response = await send(
    `/posts/saved?limit=${limit}&offset=${offset}`,
    { signal, cache: "no-store" },
    "Не удалось загрузить сохранённое",
  );
  return response.json();
}

/** Загружает свои репосты. */
export async function fetchMyReposts(
  limit: number,
  offset: number,
  signal?: AbortSignal,
): Promise<PostPage> {
  const response = await send(
    `/posts/reposts?limit=${limit}&offset=${offset}`,
    { signal, cache: "no-store" },
    "Не удалось загрузить репосты",
  );
  return response.json();
}

/** Выбирает API раздела и загружает двадцать публикаций. */
export function fetchPostPage(
  query: PostFeedQuery,
  offset: number,
  signal?: AbortSignal,
): Promise<PostPage> {
  const limit = 20;
  switch (query.mode) {
    case "following":
      return fetchFollowingFeed(limit, offset, signal);
    case "my":
      return fetchMyPosts(query.status ?? "published", limit, offset, signal);
    case "saved":
      return fetchSavedPosts(limit, offset, signal);
    case "reposts":
      return fetchMyReposts(limit, offset, signal);
    case "author":
      return fetchAuthorPosts(query.authorId ?? 0, limit, offset, signal);
    default:
      return fetchFeed(limit, offset, signal);
  }
}
