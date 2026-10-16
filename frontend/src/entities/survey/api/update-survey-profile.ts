import { request } from "@/shared/api/request";
import type { SurveyProfile, SurveyProfileValues } from "../model/types";

/** Сохраняет поля анкеты, оставляя загрузку документов отдельной операцией. */
export async function updateSurveyProfile(
  fields: SurveyProfileValues,
): Promise<SurveyProfile> {
  const response = await request("/directions/survey/expert-profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
    errorMessage: "Не удалось сохранить анкету изыскателя",
  });

  return response.json();
}
