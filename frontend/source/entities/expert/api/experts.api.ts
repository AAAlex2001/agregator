import { send } from "@/source/shared/api/request";
import type { OrdersApiList } from "@/source/entities/order";
import type { SortDir } from "@/source/shared/ui/SortPills";
import type { ExpertListApi, ExpertMapApi, ExpertSortBy, ExpertSummaryApi } from "../model/types";

export async function fetchExperts(params: {
  skip?: number;
  limit?: number;
  query?: string;
  sortBy?: ExpertSortBy;
  sortDir?: SortDir;
} = {}): Promise<ExpertListApi> {
  const searchParams = new URLSearchParams({ skip: String(params.skip ?? 0), limit: String(params.limit ?? 20) });
  if (params.query?.trim()) searchParams.set("q", params.query.trim());
  if (params.sortBy) searchParams.set("sort_by", params.sortBy);
  if (params.sortDir) searchParams.set("sort_dir", params.sortDir);
  const response = await send(`/experts?${searchParams}`, {}, "Не удалось загрузить исполнителей");
  return response.json();
}

export async function fetchExpertsMap(direction?: string): Promise<ExpertMapApi> {
  const params = direction ? `?direction=${encodeURIComponent(direction)}` : "";
  const response = await send(`/experts/map${params}`, {}, "Не удалось загрузить исполнителей на карте");
  return response.json();
}

export async function fetchExpertSummary(publicId: string): Promise<ExpertSummaryApi> {
  const response = await send(`/experts/${publicId}/summary`, {}, "Не удалось загрузить исполнителя");
  return response.json();
}

export async function fetchExpertOrdersHistory(publicId: string, skip: number, limit: number): Promise<OrdersApiList> {
  const response = await send(`/experts/${publicId}/orders?skip=${skip}&limit=${limit}`, {}, "Не удалось загрузить историю заказов");
  return response.json();
}
