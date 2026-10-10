import { adminFetch, fileBody, jsonBody } from "@/shared/api";
import type { Article, ArticleList, ArticleListQuery, ArticlePayload } from "../model/types";

/** Страница статей: фильтры по типу, статусу и обсуждениям, поиск по заголовку и slug, порядок по просмотрам. */
export const fetchArticles = async (query: ArticleListQuery, limit: number, offset: number): Promise<ArticleList> => {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });

  if (query.kind) params.set("kind", query.kind);
  if (query.status) params.set("status", query.status);
  if (query.query) params.set("q", query.query);
  if (query.withComments) params.set("with_comments", "true");
  if (query.views) params.set("views", query.views);

  const response = await adminFetch(`/content/articles?${params}`);

  return response.json();
};

/** Статья для редактирования. */
export const fetchArticle = async (id: number): Promise<Article> => {
  const response = await adminFetch(`/content/articles/${id}`);

  return response.json();
};

/** Создать статью. */
export const createArticle = async (payload: ArticlePayload): Promise<Article> => {
  const response = await adminFetch("/content/articles", jsonBody("POST", payload));

  return response.json();
};

/** Сохранить статью. */
export const updateArticle = async (id: number, payload: ArticlePayload): Promise<Article> => {
  const response = await adminFetch(`/content/articles/${id}`, jsonBody("PUT", payload));

  return response.json();
};

/** Удалить статью. */
export const deleteArticle = async (id: number): Promise<void> => {
  await adminFetch(`/content/articles/${id}`, { method: "DELETE" });
};

/** Загрузить картинку для обложки или текста. Возвращает адрес файла. */
export const uploadArticleImage = async (file: File): Promise<string> => {
  const response = await adminFetch("/content/upload-image", fileBody(file));
  const upload: { url: string } = await response.json();

  return upload.url;
};

/** Загрузить видео для текста. Возвращает адрес файла. */
export const uploadArticleVideo = async (file: File): Promise<string> => {
  const response = await adminFetch("/content/upload-video", fileBody(file));
  const upload: { url: string } = await response.json();

  return upload.url;
};
