import { json, send, upload } from "@/source/shared/api/request";
import type { TechDiagProfile } from "./types";

/** Анкета специалиста НК. */
export async function fetchTechDiagProfile(): Promise<TechDiagProfile> {
  const response = await send("/directions/tech-diag/expert-profile", {}, "Не удалось загрузить анкету специалиста НК");
  return response.json();
}

/** Сохранить анкету специалиста НК. */
export async function saveTechDiagProfile(profile: TechDiagProfile): Promise<TechDiagProfile> {
  const response = await send(
    "/directions/tech-diag/expert-profile",
    json("PUT", profile),
    "Не удалось сохранить анкету специалиста НК",
  );
  return response.json();
}

/** Загрузить квалификационное удостоверение. */
export async function uploadTechDiagDocument(file: File): Promise<TechDiagProfile> {
  const response = await upload("/directions/tech-diag/expert-profile/documents", file, "Не удалось загрузить документ");
  return response.json();
}

/** Удалить квалификационное удостоверение. */
export async function deleteTechDiagDocument(url: string): Promise<TechDiagProfile> {
  const response = await send("/directions/tech-diag/expert-profile/documents", json("DELETE", { url }), "Не удалось удалить документ");
  return response.json();
}
