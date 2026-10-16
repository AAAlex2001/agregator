import { request } from "@/shared/api/request";
import type { CadastralProfile } from "../model/types";

/** Удаляет дополнительный документ и возвращает актуальную анкету. */
export async function deleteCadastralDocument(url: string): Promise<CadastralProfile> {
  const response = await request("/directions/cadastral/profile/documents", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
    errorMessage: "Не удалось удалить документ",
  });

  return response.json();
}
