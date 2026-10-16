import { request } from "@/shared/api/request";
import type { UserProfile } from "../model/types";

/** Удаляет карточку предприятия и возвращает обновлённый профиль. */
export async function deleteCompanyCard(): Promise<UserProfile> {
  const response = await request("/settings/company-card", {
    method: "DELETE",
    errorMessage: "Не удалось удалить карточку предприятия",
  });

  return response.json();
}
