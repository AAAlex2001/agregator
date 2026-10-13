import { SITE_URL } from "@/shared/api/config";

/** Адрес фото или видео публикации на сайте: сервер отдаёт путь вида /uploads/posts/… */
export function mediaUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
