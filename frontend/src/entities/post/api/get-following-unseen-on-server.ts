import { requestPostsOnServer } from "./request-posts-on-server";

/** Счётчик публикаций в подписках, которые посетитель ещё не открывал. */
interface FollowingUnseen {
  count: number;
}

/** Загружает число новых публикаций в подписках; для гостя возвращает null. */
export async function getFollowingUnseenOnServer(): Promise<number | null> {
  const response = await requestPostsOnServer("/posts/feed/following/unseen");

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Не удалось загрузить новые публикации: ${response.status}`);
  }

  const result: FollowingUnseen = await response.json();

  return result.count;
}
