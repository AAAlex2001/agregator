import { cache } from "react";
import { POSTS_PAGE_SIZE } from "../config/pagination";
import type { PostPage, PostStatus } from "../model/types";
import { requestPostsOnServer } from "./request-posts-on-server";

/** Загружает раздел до выбранной страницы; для гостя в личном разделе возвращает null. */
async function loadPosts(
  path: string,
  page: number,
  status?: PostStatus,
): Promise<PostPage | null> {
  const query = new URLSearchParams({
    limit: String(page * POSTS_PAGE_SIZE),
    offset: "0",
  });

  if (status) {
    query.set("status", status);
  }

  const response = await requestPostsOnServer(`${path}?${query}`);

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Не удалось загрузить публикации: ${response.status}`);
  }

  return response.json();
}

/** Объединяет одинаковые запросы страницы и metadata в пределах серверного рендера. */
export const getPostsOnServer = cache(loadPosts);
