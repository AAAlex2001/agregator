import { adminFetch, jsonBody } from "@/shared/api";
import type { Tag } from "../model/types";

/** Все теги по алфавиту. Общие для статей и разъяснений. */
export const fetchTags = async (): Promise<Tag[]> => {
  const response = await adminFetch("/content/tags");

  return response.json();
};

/** Создать тег. */
export const createTag = async (name: string): Promise<Tag> => {
  const response = await adminFetch("/content/tags", jsonBody("POST", { name }));

  return response.json();
};

/** Переименовать тег. Статьи ссылаются на тег по id, новое имя видно везде сразу. */
export const renameTag = async (id: number, name: string): Promise<Tag> => {
  const response = await adminFetch(`/content/tags/${id}`, jsonBody("PUT", { name }));

  return response.json();
};

/** Удалить тег. Он снимается со всех статей и разъяснений. */
export const deleteTag = async (id: number): Promise<void> => {
  await adminFetch(`/content/tags/${id}`, { method: "DELETE" });
};
