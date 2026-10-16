import { request } from "@/shared/api/request";
import type { ExpertSort, ExpertSummaryPage } from "../model/types";

/** Загружает страницу исполнителей с отзывами в выбранном порядке. */
export async function getExperts(
  skip: number,
  sort: ExpertSort,
): Promise<ExpertSummaryPage> {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: "20",
  });

  if (sort.field && sort.direction) {
    params.set("sort_by", sort.field);
    params.set("sort_dir", sort.direction);
  }

  const response = await request(`/experts?${params}`, {
    errorMessage: "Не удалось загрузить исполнителей",
  });

  return response.json();
}
