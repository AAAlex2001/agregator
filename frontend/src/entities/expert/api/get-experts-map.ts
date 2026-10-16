import { request } from "@/shared/api/request";
import type { ExpertsMapResponse } from "../model/types";

/** Загружает публичные точки карты с необязательным фильтром направления. */
export async function getExpertsMap(
  direction?: string,
): Promise<ExpertsMapResponse> {
  const query = direction
    ? `?direction=${encodeURIComponent(direction)}`
    : "";
  const response = await request(`/experts/map${query}`, {
    errorMessage: "Не удалось загрузить исполнителей на карте",
  });

  return response.json();
}
