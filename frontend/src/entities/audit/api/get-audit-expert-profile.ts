import { request } from "@/shared/api/request";
import type { AuditExpertProfile } from "../model/types";

/** Загружает сохранённую анкету аудитора СУПБ. */
export async function getAuditExpertProfile(): Promise<AuditExpertProfile> {
  const response = await request("/directions/audit/expert-profile", {
    errorMessage: "Не удалось загрузить анкету аудитора",
  });

  return response.json();
}
