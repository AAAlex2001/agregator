import "server-only";

import { SERVER_API_URL } from "@/source/shared/api/config";
import type { PublicOrderSearchFilters } from "./order-search.api";
import type { OrdersApiList } from "../model/types";

export async function fetchPublicOrdersServer(
  skip = 0,
  limit = 50,
  filters: PublicOrderSearchFilters = {},
): Promise<OrdersApiList> {
  const hasFilters = Boolean(filters.query?.trim() || filters.workType || filters.badgeCode);
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  if (filters.query?.trim()) params.set("q", filters.query.trim());
  if (filters.workType) params.set("work_type", filters.workType);
  if (filters.badgeCode) params.set("badge_code", filters.badgeCode);
  const endpoint = hasFilters ? "search" : "";
  const res = await fetch(`${SERVER_API_URL}/orders/${endpoint}?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Не удалось загрузить заказы: ${res.status}`);
  return res.json();
}
