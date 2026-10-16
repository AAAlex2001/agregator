import { AVATAR_MAX_SIZE, AVATAR_TYPES } from "../config/avatar";

/** Проверяет формат и размер фотографии до отправки на сервер. */
export function validateAvatar(file: File): string | null {
  if (!AVATAR_TYPES.includes(file.type)) {
    return "Можно загрузить только JPG или PNG";
  }

  if (file.size > AVATAR_MAX_SIZE) {
    return "Размер фото не должен превышать 5 МБ";
  }

  return null;
}
