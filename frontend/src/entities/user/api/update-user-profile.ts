import { request } from "@/shared/api/request";
import type { UpdateUserProfile } from "../model/types";
import type { UserProfile } from "../model/types";

/** Сохраняет имя, фамилию и телефон текущего аккаунта. */
export async function updateUserProfile(fields: UpdateUserProfile): Promise<UserProfile> {
  const response = await request("/settings/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
    errorMessage: "Не удалось сохранить данные",
  });

  return response.json();
}
