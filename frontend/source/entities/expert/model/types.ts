import type { OrderApiItem, OrderCardData } from "@/source/entities/order";

export type ExpertSortBy = "rating" | "completed_orders" | "review_count";

export interface ExpertSummaryApi {
  public_id: string;
  full_name: string;
  avatar_url: string | null;
  rating: number | null;
  review_count: number;
  completed_orders_count: number;
  joined_at: string;
  last_order: OrderApiItem | null;
}

export interface ExpertListApi {
  items: ExpertSummaryApi[];
  has_more: boolean;
}

export interface ExpertSummary {
  publicId: string;
  fullName: string;
  avatarUrl: string | null;
  rating: number | null;
  reviewCount: number;
  completedOrdersCount: number;
  joinedAt: string;
  lastOrder: OrderCardData | null;
}

export interface ExpertList {
  items: ExpertSummary[];
  hasMore: boolean;
}

export interface ExpertMapItemApi {
  public_id: string;
  full_name: string;
  avatar_url: string | null;
  rating: number | null;
  city: string | null;
  lat: number;
  lng: number;
  travels_to_other_regions: boolean;
}

export interface ExpertMapApi {
  items: ExpertMapItemApi[];
}
