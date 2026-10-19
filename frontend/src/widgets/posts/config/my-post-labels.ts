import type { DeliveryStatus, PostStatus } from "@/entities/post";

/** Подпись статуса публикации на карточке. */
export function postStatusLabel(status: PostStatus): string {
  if (status === "published") {
    return "Опубликован";
  }

  if (status === "scheduled") {
    return "Запланирован";
  }

  return status === "draft" ? "Черновик" : "Скрыт модератором";
}

/** Подпись доставки поста в канал. */
export function deliveryStatusLabel(status: DeliveryStatus): string {
  if (status === "sent") {
    return "вышел";
  }

  if (status === "failed") {
    return "ошибка";
  }

  return status === "deleted" ? "удалён" : "отправляется";
}
