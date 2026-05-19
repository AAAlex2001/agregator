import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import type { OrdersApiList } from "@/source/entities/order";
import type { ExpertListApi, ExpertSortBy, ExpertSummaryApi } from "../model/types";
import type { SortDir } from "@/source/shared/ui/SortPills";

function buildErrorMessage(response: Response, fallback: string): Promise<string> {
  return response
    .json()
    .then((body) => (typeof body?.detail === "string" ? body.detail : fallback))
    .catch(() => fallback);
}

export async function fetchExperts(params: {
  skip?: number;
  limit?: number;
  query?: string;
  sortBy?: ExpertSortBy;
  sortDir?: SortDir;
} = {}): Promise<ExpertListApi> {
  const skip = params.skip ?? 0;
  const limit = params.limit ?? 20;
  const searchParams = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  if (params.query && params.query.trim()) {
    searchParams.set("q", params.query.trim());
  }
  if (params.sortBy) searchParams.set("sort_by", params.sortBy);
  if (params.sortDir) searchParams.set("sort_dir", params.sortDir);
  const response = await fetchWithSession(`${API_URL}/experts?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error(await buildErrorMessage(response, "Не удалось загрузить экспертов"));
  }
  return response.json();
}

export async function fetchExpertSummary(publicId: string): Promise<ExpertSummaryApi> {
  const response = await fetchWithSession(`${API_URL}/experts/${publicId}/summary`);
  if (!response.ok) {
    throw new Error(await buildErrorMessage(response, "Не удалось загрузить эксперта"));
  }
  return response.json();
}

export async function fetchExpertOrdersHistory(
  publicId: string,
  params: { skip?: number; limit?: number } = {},
): Promise<OrdersApiList> {
  const skip = params.skip ?? 0;
  const limit = params.limit ?? 20;
  const searchParams = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  const response = await fetchWithSession(
    `${API_URL}/experts/${publicId}/orders?${searchParams.toString()}`,
  );
  if (!response.ok) {
    throw new Error(await buildErrorMessage(response, "Не удалось загрузить историю заказов"));
  }
  return response.json();
}
