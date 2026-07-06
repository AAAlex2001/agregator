export interface OrderBadge {
  text: string;
  variant: string;
}

export interface OrderDocuments {
  technical: string[];
  contract: string[];
  company: string[];
  other: string[];
}

export interface Order {
  id: number;
  public_id: string;
  title: string;
  company: string;
  comment: string;
  customer_name: string;
  customer_inn: string;
  sum: string;
  sum_amount_raw: number;
  start_date: string;
  date: string;
  deadline_at: string;
  created_at: string;
  responses_deadline: string | null;
  requires_license: boolean;
  customer_id: number;
  assigned_expert_id: number | null;
  documents: OrderDocuments;
  badges: OrderBadge[];
  status: string;
  executor_name: string;
  executor_rating: number | null;
  executor_review_count: number;
  executor_public_id: string;
  executor_proposed_sum: string;
  executor_proposed_start_date: string;
  executor_proposed_deadline: string;
  executor_comment: string;
  executor_files: string[];
  accepted_response_id: number | null;
  customer_has_review: boolean;
  unanswered_questions: number;
  my_answered_questions: number;
}

export interface OrderList {
  items: Order[];
  has_more: boolean;
}
