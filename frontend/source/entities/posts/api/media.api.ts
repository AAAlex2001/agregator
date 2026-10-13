import { send } from "@/source/shared/api/request";
import type { PostMedia } from "../model/types";

/** Загружает фото или видео в редактор публикации. */
export async function uploadPostMedia(file: File, signal?: AbortSignal): Promise<PostMedia> {
  const body = new FormData();
  body.append("file", file);
  const extension = file.name.split(".").pop()?.toLowerCase();
  const video =
    file.type.startsWith("video/") || (!file.type && (extension === "mp4" || extension === "mov"));
  const kind = video ? "video" : "photo";
  const response = await send(
    `/posts/media?kind=${kind}`,
    { method: "POST", body, signal },
    "Не удалось загрузить файл",
  );
  return response.json();
}

/** Удаляет файл, который ещё не прикреплён к публикации. */
export async function deletePostMedia(id: number): Promise<void> {
  await send(`/posts/media/${id}`, { method: "DELETE" }, "Не удалось удалить файл");
}
