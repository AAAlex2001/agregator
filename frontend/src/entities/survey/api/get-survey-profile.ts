import { request } from "@/shared/api/request";
import type { SurveyProfile } from "../model/types";

/** Загружает анкету изыскателя и пять групп его документов. */
export async function getSurveyProfile(): Promise<SurveyProfile> {
  const response = await request("/directions/survey/expert-profile", {
    errorMessage: "Не удалось загрузить анкету изыскателя",
  });

  return response.json();
}
