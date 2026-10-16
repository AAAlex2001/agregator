import { request } from "@/shared/api/request";
import type { TechDiagProfile } from "../model/types";

/** Удаляет документ специалиста по его адресу в анкете. */
export async function deleteTechDiagDocument(url: string): Promise<TechDiagProfile> {
  const response = await request("/directions/tech-diag/expert-profile/documents", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
    errorMessage: "Не удалось удалить документ",
  });

  return response.json();
}
