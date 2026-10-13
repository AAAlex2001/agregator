import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { SERVER_API_URL } from "@/source/shared/api/config";
import { POSTS_PAGE_SIZE, type Post, type PostPage, type ThreadPage } from "./model/types";

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

/** Лента или лента автора с первой публикации по страницу page включительно. */
export async function loadPostsFeed(page: number, authorId?: number): Promise<PostPage> {
  const path = authorId ? `/posts/author/${authorId}` : "/posts/feed";
  const limit = page * POSTS_PAGE_SIZE;

  const response = await load(`${path}?limit=${limit}&offset=0`);
  if (!response.ok) {
    throw new Error(`Не удалось загрузить публикации: ${response.status}`);
  }
  return response.json();
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
