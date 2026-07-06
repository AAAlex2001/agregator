import { apiJson } from "@/shared/services/api";

export type ExpertSortBy = "rating" | "completed_orders" | "review_count";

export interface ExpertSummary {
  public_id: string;
  full_name: string;
  avatar_url: string | null;
  rating: number | null;
  review_count: number;
  completed_orders_count: number;
  joined_at: string;
}

export interface ExpertList {
  items: ExpertSummary[];
  has_more: boolean;
}

export function listExperts(sortBy: ExpertSortBy, sortDir: "asc" | "desc", limit = 50): Promise<ExpertList> {
  return apiJson<ExpertList>(`/experts?skip=0&limit=${limit}&sort_by=${sortBy}&sort_dir=${sortDir}`);
}
