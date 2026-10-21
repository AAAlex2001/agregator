import { request } from "@/shared/api/request";
import type { ResponseItem } from "../model/types";

/** Загружает свой отклик исполнителя по номеру. */
export async function getResponse(responseId: number): Promise<ResponseItem> {
  const response = await request(`/responses/${responseId}`, {
    errorMessage: "Отклик не найден",
  });

  return response.json();
}
