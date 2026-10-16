import { request } from "@/shared/api/request";
import type { ForensicProfile, ForensicProfileValues } from "../model/types";

/** Сохраняет квалификацию, опыт и место работы судебного эксперта. */
export async function updateForensicProfile(
  fields: ForensicProfileValues,
): Promise<ForensicProfile> {
  const response = await request("/directions/forensic/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
    errorMessage: "Не удалось сохранить анкету судебного эксперта",
  });

  return response.json();
}
