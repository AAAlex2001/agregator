import { mapApiToOrderCard } from "@/source/entities/order";
import type { ExpertListApi, ExpertList, ExpertSummary, ExpertSummaryApi } from "./types";

export function mapExpertSummary(api: ExpertSummaryApi): ExpertSummary {
  return {
    publicId: api.public_id,
    fullName: api.full_name,
    avatarUrl: api.avatar_url,
    rating: api.rating,
    reviewCount: api.review_count,
    completedOrdersCount: api.completed_orders_count,
    joinedAt: api.joined_at,
    lastOrder: api.last_order ? mapApiToOrderCard(api.last_order) : null,
  };
}

export function mapExpertList(api: ExpertListApi): ExpertList {
  return {
    items: api.items.map(mapExpertSummary),
    hasMore: api.has_more,
  };
}
