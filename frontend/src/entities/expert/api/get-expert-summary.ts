import { request } from "@/shared/api/request";
import type { ExpertSummary } from "../model/types";

/** Загружает публичную карточку исполнителя по его публичному идентификатору. */
export async function getExpertSummary(publicId: string): Promise<ExpertSummary> {
  const response = await request(`/experts/${publicId}/summary`, {
    errorMessage: "Не удалось загрузить исполнителя",
  });

  return response.json();
}
