import { request } from "@/shared/api/request";
import type { UserProfile } from "../model/types";

/** Заменяет фотографию профиля выбранным файлом. */
export async function uploadAvatar(file: File): Promise<UserProfile> {
  const body = new FormData();
  body.append("file", file);

  const response = await request("/settings/avatar", {
    method: "POST",
    body,
    errorMessage: "Не удалось загрузить фото",
  });

  return response.json();
}
