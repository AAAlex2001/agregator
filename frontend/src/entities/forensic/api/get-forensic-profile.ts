import { request } from "@/shared/api/request";
import type { ForensicProfile } from "../model/types";

/** Загружает анкету судебного эксперта и его документы. */
export async function getForensicProfile(): Promise<ForensicProfile> {
  const response = await request("/directions/forensic/profile", {
    errorMessage: "Не удалось загрузить анкету судебного эксперта",
  });

  return response.json();
}
