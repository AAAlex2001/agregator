import { apiJson } from "@/shared/services/api";

export interface ReviewItem {
  id: number;
  order_title: string;
  company_name: string;
  order_sum: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewList {
  reviews: ReviewItem[];
  has_more: boolean;
  total_reviews: number;
  avg_rating: number;
  expert_name?: string;
}

export function fetchExpertReviews(publicId: string, limit = 50): Promise<ReviewList> {
  return apiJson<ReviewList>(`/experts/${publicId}/reviews?skip=0&limit=${limit}`);
}
