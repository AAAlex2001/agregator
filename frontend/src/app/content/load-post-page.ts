import type { Post } from "@/entities/post";
import { getPostOnServer } from "@/entities/post/server";

/** Параметры маршрута отдельной публикации, её правки или репоста. */
export interface PostPageProps {
  params: Promise<{ id: string }>;
}

/** Загружает публикацию по номеру из адреса; неверный или пустой номер — как отсутствующая. */
export async function loadPostById(id: string | number | null | undefined): Promise<Post | null> {
  const postId = Number(id);

  if (!id || !Number.isSafeInteger(postId) || postId < 1) {
    return null;
  }

  return getPostOnServer(postId);
}

/** Загружает публикацию по номеру из параметров маршрута. */
export async function loadPostFromParams(
  params: Promise<{ id: string }>,
): Promise<Post | null> {
  const { id } = await params;

  return loadPostById(id);
}
