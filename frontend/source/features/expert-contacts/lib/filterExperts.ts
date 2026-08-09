import type { ExpertContactCardData } from "@/source/entities/expert-contact";
import type { SortDir } from "@/source/shared/ui/SortPills";
import type { ContactAccessFilter } from "../model/types";

export function filterExperts(
  experts: ExpertContactCardData[],
  search: string,
  accessFilter: ContactAccessFilter,
  ratingSort: SortDir | null,
): ExpertContactCardData[] {
  const normalizedSearch = search.trim().toLocaleLowerCase("ru-RU");
  let result = experts.filter((expert) => {
    const matchesSearch =
      !normalizedSearch || expert.name.toLocaleLowerCase("ru-RU").includes(normalizedSearch);
    const matchesAccess =
      accessFilter === "ALL" ||
      (accessFilter === "OPEN" && expert.sales_enabled) ||
      (accessFilter === "CLOSED" && !expert.sales_enabled);
    return matchesSearch && matchesAccess;
  });
  if (ratingSort) {
    result = [...result].sort((first, second) => {
      if (first.rating === null) return second.rating === null ? 0 : 1;
      if (second.rating === null) return -1;
      return ratingSort === "desc" ? second.rating - first.rating : first.rating - second.rating;
    });
  }
  return result;
}
