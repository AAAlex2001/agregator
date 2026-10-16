import { request } from "@/shared/api/request";
import type { SurveyDocumentGroup, SurveyProfile } from "../model/types";

/** Удаляет документ из выбранной группы и возвращает актуальные списки файлов. */
export async function deleteSurveyDocument(
  group: SurveyDocumentGroup,
  url: string,
): Promise<SurveyProfile> {
  const response = await request(
    `/directions/survey/expert-profile/documents?group=${group}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
      errorMessage: "Не удалось удалить документ",
    },
  );

  return response.json();
}
