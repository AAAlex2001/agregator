import { request } from "@/shared/api/request";
import type { UserProfile } from "../model/types";

/** Сохраняет направления заказчика или держателя документов без отдельной анкеты. */
export async function updateDirections(
  directions: string[],
): Promise<UserProfile> {
  const response = await request("/settings/directions", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ directions }),
    errorMessage: "Не удалось сохранить направления",
  });

  return response.json();
}
