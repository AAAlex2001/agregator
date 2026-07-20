import type { PublicOrderSearchFilters } from "../api/order-search.api";
import type { OrderWorkType } from "./workTypes";

type SearchParams = Record<string, string | string[] | undefined>;

const WORK_TYPES = new Set<OrderWorkType>([
  "EXPERTISE",
  "DESIGN_SURVEY",
  "INSPECTION_TESTING",
  "RESEARCH_LAB",
  "OTHER",
]);

export function parsePublicOrderSearch(params: SearchParams): PublicOrderSearchFilters {
  const query = typeof params.q === "string" ? params.q : undefined;
  const badgeCode = typeof params.badge_code === "string" ? params.badge_code : undefined;
  const rawWorkType = typeof params.work_type === "string" ? params.work_type : undefined;
  const workType = rawWorkType && WORK_TYPES.has(rawWorkType as OrderWorkType)
    ? rawWorkType as OrderWorkType
    : undefined;
  return { query, workType, badgeCode };
}

export function hasPublicOrderSearchCriteria(filters: PublicOrderSearchFilters): boolean {
  return Boolean(filters.query?.trim() || filters.workType || filters.badgeCode);
}
