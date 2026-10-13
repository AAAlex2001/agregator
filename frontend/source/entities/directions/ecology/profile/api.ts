import { json, send, upload } from "@/source/shared/api/request";
import type { EcologyProfile } from "./types";

/** Анкета эколога. */
export async function fetchEcologyProfile(): Promise<EcologyProfile> {
  const response = await send("/directions/ecology/expert-profile", {}, "Не удалось загрузить анкету эколога");
  return response.json();
}

/** Сохранить анкету эколога. */
export async function saveEcologyProfile(profile: EcologyProfile): Promise<EcologyProfile> {
  const response = await send("/directions/ecology/expert-profile", json("PUT", profile), "Не удалось сохранить анкету эколога");
  return response.json();
}

/** Загрузить документ о квалификации. */
export async function uploadEcologyDocument(file: File): Promise<EcologyProfile> {
  const response = await upload("/directions/ecology/expert-profile/documents", file, "Не удалось загрузить документ");
  return response.json();
}

/** Удалить документ о квалификации. */
export async function deleteEcologyDocument(url: string): Promise<EcologyProfile> {
  const response = await send("/directions/ecology/expert-profile/documents", json("DELETE", { url }), "Не удалось удалить документ");
  return response.json();
}
