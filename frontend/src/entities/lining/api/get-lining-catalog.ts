import { request } from "@/shared/api/request";
import type { LiningCatalog } from "../model/types";

/** Загружает справочник оценки крепи для рудника. */
export async function getLiningCatalog(): Promise<LiningCatalog> {
  const response = await request("/lining/catalog?profile=rudnik", {
    errorMessage: "Не удалось загрузить справочник",
  });

  return response.json();
}
