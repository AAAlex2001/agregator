/** Отзыв заказчика об исполнителе по завершённому отклику. */
export interface CreateReviewRequest {
  response_id: number;
  rating: number;
  comment: string;
}

/** Документы заказа, к которому относится отзыв, по группам назначения. */
export interface ReviewOrderDocuments {
  technical: string[];
  contract: string[];
  company: string[];
  other: string[];
}

/** Требование заказа к исполнителю с цветом, полученным от сервера. */
export interface ReviewOrderBadge {
  text: string;
  variant: string;
}

/** Оценка и комментарий заказчика вместе с условиями выполненного заказа. */
export interface ReviewItem {
  id: number;
  order_title: string;
  company_name: string;
  order_sum: string;
  order_start_date: string;
  order_deadline: string;
  expert_start_date: string;
  expert_deadline: string;
  expert_sum: string;
  order_documents: ReviewOrderDocuments;
  badges: ReviewOrderBadge[];
  rating: number;
  comment: string;
  created_at: string;
}

/** Страница отзывов исполнителя с его средним рейтингом и общим числом отзывов. */
export interface ReviewPage {
  reviews: ReviewItem[];
  has_more: boolean;
  total_reviews: number;
  avg_rating: number;
  expert_name?: string;
}
