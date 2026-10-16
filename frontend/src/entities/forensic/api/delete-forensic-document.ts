import { request } from "@/shared/api/request";
import type { ForensicProfile } from "../model/types";

/** Удаляет дополнительный документ судебного эксперта. */
export async function deleteForensicDocument(url: string): Promise<ForensicProfile> {
  const response = await request("/directions/forensic/profile/documents", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
    errorMessage: "Не удалось удалить документ",
  });

  return response.json();
}
