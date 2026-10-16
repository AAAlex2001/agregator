import { fetchWithSession } from "@/shared/api/fetch-with-session";

/** Засчитывает просмотр; недоступность счётчика не мешает чтению статьи. */
export async function recordArticleView(articleId: number): Promise<void> {
  await fetchWithSession(`/public/articles/${articleId}/view`, {
    method: "POST",
  }).catch(() => undefined);
}
