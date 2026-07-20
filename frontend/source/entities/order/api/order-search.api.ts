import { API_URL } from "@/source/shared/api/config";
import type { OrdersApiList } from "../model/types";
import type { OrderWorkType } from "../model/workTypes";

export interface PublicOrderSearchFilters {
  query?: string;
  workType?: OrderWorkType;
  badgeCode?: string;
}

export async function searchOrdersPublic(
  filters: PublicOrderSearchFilters,
  skip = 0,
  limit = 20,
): Promise<OrdersApiList> {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  const query = filters.query?.trim();
  if (query) params.set("q", query);
  if (filters.workType) params.set("work_type", filters.workType);
  if (filters.badgeCode) params.set("badge_code", filters.badgeCode);
  const url = `${API_URL}/orders/search?${params.toString()}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось выполнить поиск");
  }
  return res.json();
}
