import { request } from "@/shared/api/request";
import type { AuditExpertProfile } from "../model/types";

/** Удаляет документ аудитора по адресу, полученному от API. */
export async function deleteAuditDocument(url: string): Promise<AuditExpertProfile> {
  const response = await request("/directions/audit/expert-profile/documents", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
    errorMessage: "Не удалось удалить документ",
  });

  return response.json();
}
