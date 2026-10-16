import { request } from "@/shared/api/request";
import type { UserProfile } from "../model/types";

/** Подтверждает новый адрес и возвращает профиль с изменённой почтой. */
export async function confirmEmailChange(code: string): Promise<UserProfile> {
  const response = await request("/settings/email/confirm-change", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
    errorMessage: "Не удалось подтвердить код",
  });

  return response.json();
}
