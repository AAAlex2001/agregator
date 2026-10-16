import { request } from "@/shared/api/request";
import type { PostLikes } from "../model/types";

/** Ставит или убирает лайк комментария и возвращает новый счётчик. */
export async function togglePostCommentLike(
  id: number,
  liked: boolean,
): Promise<PostLikes> {
  const response = await request(`/posts/comments/${id}/like`, {
    method: liked ? "POST" : "DELETE",
    errorMessage: "Не удалось изменить лайк",
  });

  return response.json();
}
