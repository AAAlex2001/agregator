import { json, send, upload } from "@/source/shared/api/request";
import type { AuditExpertProfile } from "./types";

/** Анкета аудитора. */
export async function fetchAuditExpertProfile(): Promise<AuditExpertProfile> {
  const response = await send("/directions/audit/expert-profile", {}, "Не удалось загрузить анкету аудитора");
  return response.json();
}

/** Сохранить анкету аудитора. */
export async function saveAuditExpertProfile(profile: AuditExpertProfile): Promise<AuditExpertProfile> {
  const response = await send("/directions/audit/expert-profile", json("PUT", profile), "Не удалось сохранить анкету аудитора");
  return response.json();
}

/** Загрузить документ аудитора. */
export async function uploadAuditDocument(file: File): Promise<AuditExpertProfile> {
  const response = await upload("/directions/audit/expert-profile/documents", file, "Не удалось загрузить документ");
  return response.json();
}

/** Удалить документ аудитора. */
export async function deleteAuditDocument(url: string): Promise<AuditExpertProfile> {
  const response = await send("/directions/audit/expert-profile/documents", json("DELETE", { url }), "Не удалось удалить документ");
  return response.json();
}
