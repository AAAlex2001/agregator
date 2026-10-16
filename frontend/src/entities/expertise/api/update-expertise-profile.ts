import { request } from "@/shared/api/request";
import type { ExpertiseProfileValues } from "../model/types";

/** Сохраняет полный список удостоверений эксперта. */
export async function updateExpertiseProfile(
  values: ExpertiseProfileValues,
): Promise<ExpertiseProfileValues> {
  const response = await request("/directions/expertise/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
    errorMessage: "Не удалось сохранить анкету ЭПБ",
  });

  return response.json();
}
