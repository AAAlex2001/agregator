import type { Tag } from "@/entities/tag";
import { adminRequest, jsonBody } from "@/shared/api";

/** Создать тег. */
export const createTag = (name: string) => adminRequest<Tag>("/content/tags", jsonBody("POST", { name }));

/** Переименовать тег. Статьи ссылаются на тег по id, новое имя видно везде сразу. */
export const renameTag = (id: number, name: string) =>
  adminRequest<Tag>(`/content/tags/${id}`, jsonBody("PUT", { name }));

/** Удалить тег. Он снимается со всех статей и разъяснений. */
export const deleteTag = (id: number) => adminRequest<void>(`/content/tags/${id}`, { method: "DELETE" });
