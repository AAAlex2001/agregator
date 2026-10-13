import { send } from "@/source/shared/api/request";
import type { SurveyCatalogs } from "./types";

/** Справочники изысканий: виды изысканий и области РТН. */
export async function fetchSurveyCatalogs(): Promise<SurveyCatalogs> {
  const response = await send("/directions/survey/catalogs", {}, "Не удалось загрузить справочники направления");
  return response.json();
}
