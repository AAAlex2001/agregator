export interface ReviewItem {
  id: number;
  order_title: string;
  company_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewListResponse {
  reviews: ReviewItem[];
  total: number;
  avg_rating: number;
}
