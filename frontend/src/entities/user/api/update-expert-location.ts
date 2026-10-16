import { request } from "@/shared/api/request";
import type { UpdateExpertLocation } from "../model/types";
import type { UserProfile } from "../model/types";

/** Сохраняет местоположение исполнителя и настройки его публичной метки. */
export async function updateExpertLocation(
  location: UpdateExpertLocation,
): Promise<UserProfile> {
  const response = await request("/settings/expert-location", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(location),
    errorMessage: "Не удалось сохранить локацию",
  });

  return response.json();
}
