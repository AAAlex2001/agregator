import { fetchWithSession } from "@/shared/api/fetch-with-session";
import { readResponseError } from "@/shared/api/response-error";
import type { UserProfile } from "../model/types";

/** Загружает профиль; отсутствие действующей сессии возвращает как null. */
export async function getUserProfile(): Promise<UserProfile | null> {
  const response = await fetchWithSession("/settings/profile");

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await readResponseError(response, "Не удалось загрузить профиль"));
  }

  return response.json();
}
