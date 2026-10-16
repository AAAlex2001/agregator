import { API_URL } from "@/shared/config/api";

/** Засчитывает просмотр фоном: запрос не мешает уходу со страницы. */
export function countPostView(id: number): void {
  navigator.sendBeacon(`${API_URL}/posts/${id}/view`);
}
