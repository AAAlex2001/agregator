import { adminFetch } from "@/shared/api";
import type { Post, PostList, PostStatus, ReportList, ReportStatus } from "../model/types";

/** Загружает публикации выбранного статуса, при необходимости — одного автора. */
export async function fetchPosts(
  status: PostStatus,
  limit: number,
  offset: number,
  signal: AbortSignal,
  authorId?: number,
): Promise<PostList> {
  const params = new URLSearchParams({ status, limit: String(limit), offset: String(offset) });

  if (authorId) params.set("author_id", String(authorId));

  const response = await adminFetch(`/posts?${params}`, { signal });
  return response.json();
}

/** Загружает публикацию любого статуса для модератора. */
export async function fetchPost(id: number, signal: AbortSignal): Promise<Post> {
  const response = await adminFetch(`/posts/${id}`, { signal });
  return response.json();
}

/** Скрывает пост или возвращает его в ленту. */
export async function setPostStatus(id: number, status: "hidden" | "published"): Promise<void> {
  await adminFetch(`/posts/${id}/status?status=${status}`, { method: "PUT" });
}

/** Удаляет публикацию и связанные материалы. */
export async function deletePost(id: number): Promise<void> {
  await adminFetch(`/posts/${id}`, { method: "DELETE" });
}

/** Загружает очередь жалоб выбранного статуса. */
export async function fetchReports(
  status: ReportStatus,
  limit: number,
  offset: number,
  signal: AbortSignal,
): Promise<ReportList> {
  const params = new URLSearchParams({ status, limit: String(limit), offset: String(offset) });
  const response = await adminFetch(`/posts/reports?${params}`, { signal });
  return response.json();
}

/** Закрывает жалобы на проверенный материал без удаления. */
export async function dismissReport(id: number): Promise<void> {
  await adminFetch(`/posts/reports/${id}/dismiss`, { method: "POST" });
}

/** Удаляет комментарий вместе с ответами. */
export async function deleteComment(id: number): Promise<void> {
  await adminFetch(`/posts/comments/${id}`, { method: "DELETE" });
}
