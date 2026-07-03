export type ResponseStatus =
  | "REVIEW"
  | "REJECTED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "WITHDRAWN_BY_EXPERT";

export type ResponseTab =
  | "all"
  | "review"
  | "in_progress"
  | "rejected"
  | "accepted"
  | "withdrawn_by_expert";

export interface ResponseBadge {
  text: string;
  variant: string;
}

export interface ExpertResponse {
  id: number;
  order_id: number;
  status: ResponseStatus;
  date: string;
  comment: string;
  proposed_sum: string;
  proposed_deadline: string;
  order_title: string;
  order_sum: string;
  order_responses_deadline: string | null;
  order_created_at: string;
  customer_name: string;
  customer_company: string;
  badges: ResponseBadge[];
}

export interface ResponseCounters {
  all: number;
  review: number;
  in_progress: number;
  rejected: number;
  accepted: number;
  withdrawn_by_expert: number;
}

export interface ResponseList {
  items: ExpertResponse[];
  has_more: boolean;
  counters: ResponseCounters;
}
