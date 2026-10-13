import { json, send, upload } from "@/source/shared/api/request";
import type { SurveyDocumentGroup, SurveyProfile } from "./types";

/** Анкета изыскателя. */
export async function fetchSurveyProfile(): Promise<SurveyProfile> {
  const response = await send("/directions/survey/expert-profile", {}, "Не удалось загрузить анкету изыскателя");
  return response.json();
}

/** Сохранить анкету изыскателя. */
export async function saveSurveyProfile(profile: SurveyProfile): Promise<SurveyProfile> {
  const response = await send("/directions/survey/expert-profile", json("PUT", profile), "Не удалось сохранить анкету изыскателя");
  return response.json();
}

/** Загрузить документ изыскателя в группу: образование, НОК, НРС, курсы, РТН. */
export async function uploadSurveyDocument(group: SurveyDocumentGroup, file: File): Promise<SurveyProfile> {
  const response = await upload(`/directions/survey/expert-profile/documents?group=${group}`, file, "Не удалось загрузить документ");
  return response.json();
}

/** Удалить документ изыскателя из группы. */
export async function deleteSurveyDocument(group: SurveyDocumentGroup, url: string): Promise<SurveyProfile> {
  const response = await send(
    `/directions/survey/expert-profile/documents?group=${group}`,
    json("DELETE", { url }),
    "Не удалось удалить документ",
  );
  return response.json();
}
