import { POSTS_PAGE_SIZE } from "../config/pagination";
import type { PostCommentPage } from "../model/types";
import { requestPostsOnServer } from "./request-posts-on-server";

/** Загружает первую страницу обсуждения для серверной разметки публикации. */
export async function getPostCommentsOnServer(
  postId: number,
): Promise<PostCommentPage> {
  const query = new URLSearchParams({
    limit: String(POSTS_PAGE_SIZE),
    offset: "0",
  });
  const response = await requestPostsOnServer(
    `/posts/${postId}/comments?${query}`,
  );

  if (!response.ok) {
    throw new Error(`Не удалось загрузить комментарии: ${response.status}`);
  }

  return response.json();
}
