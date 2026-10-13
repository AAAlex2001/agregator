import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { SERVER_API_URL } from "@/source/shared/api/config";
import {
  POSTS_PAGE_SIZE,
  type Post,
  type PostPage,
  type PostStatus,
  type ThreadPage,
} from "./model/types";

/** Запрос к API от имени посетителя: с сессией видны свои черновики и отметки лайков. */
async function load(path: string): Promise<Response> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session_id")?.value;
  const headers: HeadersInit = session ? { Cookie: `session_id=${session}` } : {};

  return fetch(`${SERVER_API_URL}${path}`, {
    headers,
    cache: "no-store",
  });
}

/** Публикации раздела с первой по страницу page включительно — один запрос на рендер.
 *  null — раздел личный, а посетитель не вошёл. */
export const loadPosts = cache(async (
  path: string,
  page: number,
  status?: PostStatus,
): Promise<PostPage | null> => {
  const query = new URLSearchParams({
    limit: String(page * POSTS_PAGE_SIZE),
    offset: "0",
  });
  if (status) {
    query.set("status", status);
  }

  const response = await load(`${path}?${query}`);
  if (response.status === 401) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Не удалось загрузить публикации: ${response.status}`);
  }
  return response.json();
});

/** Сколько новых публикаций в подписках. null — посетитель не вошёл. */
export async function loadFollowingUnseen(): Promise<number | null> {
  const response = await load("/posts/feed/following/unseen");
  if (response.status === 401) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Не удалось загрузить новые публикации: ${response.status}`);
  }

  const unseen: { count: number } = await response.json();
  return unseen.count;
}

/** Публикация для страницы и её метаданных — один запрос на рендер.
 *  null — её нет или она недоступна. */
export const loadPost = cache(async (id: number): Promise<Post | null> => {
  const response = await load(`/posts/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Не удалось загрузить публикацию: ${response.status}`);
  }
  return response.json();
});

/** Первая страница обсуждения — сразу в разметке страницы. */
export async function loadThreads(postId: number): Promise<ThreadPage> {
  const response = await load(`/posts/${postId}/comments?limit=${POSTS_PAGE_SIZE}&offset=0`);
  if (!response.ok) {
    throw new Error(`Не удалось загрузить комментарии: ${response.status}`);
  }
  return response.json();
}
