export interface ReviewItem {
  id: number;
  order_title: string;
  company_name: string;
  order_sum: string;
  order_deadline: string;
  expert_deadline: string;
  expert_sum: string;
  technical_files: string[];
  badges: Array<{
    text: string;
    variant: "blue" | "green" | "gray" | "orange" | "brown" | "purple";
  }>;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewListResponse {
  reviews: ReviewItem[];
  has_more: boolean;
  total_reviews: number;
  avg_rating: number;
  expert_name?: string;
}