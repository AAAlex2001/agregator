import { json, send, upload } from "@/source/shared/api/request";
import type { ForensicProfile } from "./types";

/** Анкета судебного эксперта. */
export async function fetchForensicProfile(): Promise<ForensicProfile> {
  const response = await send("/directions/forensic/profile", {}, "Не удалось загрузить анкету судебного эксперта");
  return response.json();
}

/** Сохранить анкету судебного эксперта. */
export async function saveForensicProfile(profile: ForensicProfile): Promise<ForensicProfile> {
  const response = await send("/directions/forensic/profile", json("PUT", profile), "Не удалось сохранить анкету судебного эксперта");
  return response.json();
}

/** Загрузить диплом об образовании. */
export async function uploadForensicDiploma(file: File): Promise<ForensicProfile> {
  const response = await upload("/directions/forensic/profile/diploma", file, "Не удалось загрузить диплом");
  return response.json();
}

/** Загрузить документ о дополнительном образовании. */
export async function uploadForensicDocument(file: File): Promise<ForensicProfile> {
  const response = await upload("/directions/forensic/profile/documents", file, "Не удалось загрузить документ");
  return response.json();
}

/** Удалить документ о дополнительном образовании. */
export async function deleteForensicDocument(url: string): Promise<ForensicProfile> {
  const response = await send("/directions/forensic/profile/documents", json("DELETE", { url }), "Не удалось удалить документ");
  return response.json();
}
