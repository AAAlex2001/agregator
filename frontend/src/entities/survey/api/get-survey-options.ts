import { request } from "@/shared/api/request";
import type { SurveyOptions } from "../model/types";

/** Загружает виды изысканий и области аттестации РТН. */
export async function getSurveyOptions(): Promise<SurveyOptions> {
  const response = await request("/directions/survey/catalogs", {
    errorMessage: "Не удалось загрузить справочники направления",
  });

  return response.json();
}
