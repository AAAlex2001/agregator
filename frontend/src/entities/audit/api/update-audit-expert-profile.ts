import { request } from "@/shared/api/request";
import type {
  AuditExpertProfile,
  AuditExpertProfileValues,
} from "../model/types";

/** Сохраняет выбранные области и квалификации аудитора. */
export async function updateAuditExpertProfile(
  fields: AuditExpertProfileValues,
): Promise<AuditExpertProfile> {
  const response = await request("/directions/audit/expert-profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fields),
    errorMessage: "Не удалось сохранить анкету аудитора",
  });

  return response.json();
}
