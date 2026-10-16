import { request } from "@/shared/api/request";
import type { EcologyProfile } from "../model/types";

/** Удаляет документ эколога по его адресу и возвращает анкету. */
export async function deleteEcologyDocument(url: string): Promise<EcologyProfile> {
  const response = await request("/directions/ecology/expert-profile/documents", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
    }),
    errorMessage: "Не удалось удалить документ",
  });

  return response.json();
}
