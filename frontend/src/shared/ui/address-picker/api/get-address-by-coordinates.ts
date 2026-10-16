import { API_URL } from "@/shared/config/api";
import type { SelectedLocation } from "../model/types";

/** Определяет адрес выбранной точки; отсутствие результата возвращает как null. */
export async function getAddressByCoordinates(
  latitude: number,
  longitude: number,
): Promise<SelectedLocation | null> {
  try {
    const response = await fetch(
      `${API_URL}/geo/reverse?lat=${latitude}&lng=${longitude}`,
      { credentials: "include" },
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}
