import { send } from "@/source/shared/api/request";
import { POSTS_PAGE_SIZE, type PostFeedQuery, type PostPage } from "../model/types";

const FEED_PATHS = {
  following: "/posts/feed/following",
  my: "/posts/my",
  saved: "/posts/saved",
  reposts: "/posts/reposts",
};

/** Страница личного раздела публикаций: подписки, свои, сохранённые или репосты. */
export async function fetchPostPage(query: PostFeedQuery, offset: number): Promise<PostPage> {
  const params = new URLSearchParams({ limit: String(POSTS_PAGE_SIZE), offset: String(offset) });
  if (query.status) params.set("status", query.status);
  const response = await send(`${FEED_PATHS[query.mode]}?${params}`, {}, "Не удалось загрузить публикации");
  return response.json();
}

/** Сколько новых публикаций в подписках с прошлого захода во вкладку. */
export async function fetchFollowingUnseen(): Promise<{ count: number }> {
  const response = await send("/posts/feed/following/unseen", {}, "Не удалось загрузить новые публикации подписок");
  return response.json();
}

/** Отмечает вкладку «Подписки» просмотренной. */
export async function markFollowingSeen(): Promise<void> {
  await send("/posts/feed/following/seen", { method: "POST" }, "Не удалось отметить подписки просмотренными");
}
