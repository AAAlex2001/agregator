import { request } from "@/shared/api/request";

/** Подписывает на автора публикаций или отменяет подписку. */
export async function followPostAuthor(
  authorId: number,
  following: boolean,
): Promise<void> {
  await request(`/posts/authors/${authorId}/follow`, {
    method: following ? "POST" : "DELETE",
    errorMessage: "Не удалось изменить подписку",
  });
}
