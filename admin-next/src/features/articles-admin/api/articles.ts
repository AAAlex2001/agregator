import { adminRequest, fileBody, jsonBody } from "@/shared/api";
import type { Article, ArticleList, ArticlePayload, ListFilters } from "../model/types";

type Upload = {
  url: string;
};

/** Страница списка статей с фильтрами по типу, статусу и поиском по заголовку и slug. */
export const fetchArticles = (filters: ListFilters, limit: number, offset: number) => {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });

  if (filters.kind) params.set("kind", filters.kind);
  if (filters.status) params.set("status", filters.status);
  if (filters.query) params.set("q", filters.query);

  return adminRequest<ArticleList>(`/content/articles?${params}`);
};

/** Статья для редактирования. */
export const fetchArticle = (id: number) => adminRequest<Article>(`/content/articles/${id}`);

/** Создать статью. */
export const createArticle = (payload: ArticlePayload) =>
  adminRequest<Article>("/content/articles", jsonBody("POST", payload));

/** Сохранить статью. */
export const updateArticle = (id: number, payload: ArticlePayload) =>
  adminRequest<Article>(`/content/articles/${id}`, jsonBody("PUT", payload));

/** Удалить статью. */
export const deleteArticle = (id: number) => adminRequest<void>(`/content/articles/${id}`, { method: "DELETE" });

/** Загрузить картинку для обложки или текста. Возвращает адрес файла. */
export const uploadImage = async (file: File) =>
  (await adminRequest<Upload>("/content/upload-image", fileBody(file))).url;

/** Загрузить видео для текста. Возвращает адрес файла. */
export const uploadVideo = async (file: File) =>
  (await adminRequest<Upload>("/content/upload-video", fileBody(file))).url;
