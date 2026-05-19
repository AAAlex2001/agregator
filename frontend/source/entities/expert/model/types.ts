export interface ExpertSummaryApi {
  public_id: string;
  full_name: string;
  avatar_url: string | null;
  rating: number | null;
  review_count: number;
  completed_orders_count: number;
  joined_at: string;
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
}

export interface ExpertList {
  items: ExpertSummary[];
  hasMore: boolean;
}
