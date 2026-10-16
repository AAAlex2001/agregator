import { request } from "@/shared/api/request";
import { POSTS_PAGE_SIZE } from "../config/pagination";
import type { PostCommentPage } from "../model/types";

/** Загружает страницу веток обсуждения: корневые комментарии с ответами. */
export async function getPostComments(
  postId: number,
  offset: number,
): Promise<PostCommentPage> {
  const query = new URLSearchParams({
    limit: String(POSTS_PAGE_SIZE),
    offset: String(offset),
  });
  const response = await request(`/posts/${postId}/comments?${query}`, {
    errorMessage: "Не удалось загрузить комментарии",
  });

  return response.json();
}
