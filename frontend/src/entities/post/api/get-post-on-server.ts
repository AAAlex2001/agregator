import { cache } from "react";
import type { Post } from "../model/types";
import { requestPostsOnServer } from "./request-posts-on-server";

/** Загружает публикацию; отсутствие или недоступность возвращает как null. */
async function loadPost(id: number): Promise<Post | null> {
  const response = await requestPostsOnServer(`/posts/${id}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Не удалось загрузить публикацию: ${response.status}`);
  }

  return response.json();
}

/** Объединяет чтение публикации страницей и metadata в пределах серверного рендера. */
export const getPostOnServer = cache(loadPost);
