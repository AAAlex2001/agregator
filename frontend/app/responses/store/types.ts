import type { ResponseBadge } from "@/app/components/ResponseCards";

export type ResponseTabKey = "all" | "review" | "rejected" | "accepted" | "completed" | "archive";

export interface ResponseCounters {
  all: number;
  review: number;
  rejected: number;
  accepted: number;
  completed: number;
  archive: number;
}

export interface ResponseApiBadge {
  text: string;
  variant: string;
}

export interface ResponseApiItem {
  id: number;
  order_id: number;
  status: "REVIEW" | "REJECTED" | "ACCEPTED" | "COMPLETED" | "ARCHIVED";
  date: string;
  comment: string;
  proposed_sum: string;
  proposed_deadline: string;
  order_title: string;
  order_date: string;
  customer_name: string;
  technical_files: string[];
  badges: ResponseApiBadge[];
  created_at: string;
}

export interface ResponsesApiList {
  items: ResponseApiItem[];
  total: number;
  counters: ResponseCounters;
}

export interface ResponseCardViewModel {
  id: number;
  dateLabel: string;
  date: string;
  status: string;
  statusColor: string;
  statusBg: string;
  orderTitle: string;
  customer: string;
  orderDate: string;
  badges: ResponseBadge[];
  sum: string;
  deadline: string;
  costEstimate: string;
  commissionText: string;
  commissionAmount: string;
  commentTitle: string;
  commentText: string;
  techSpecTitle?: string;
  techSpecFiles?: string[];
}

export interface ResponsesState {
  items: ResponseCardViewModel[];
  counters: ResponseCounters;
  isLoading: boolean;
  error: string | null;
}

export interface CreateResponsePayload {
  comment: string;
  proposed_sum_amount: number;
  proposed_deadline: string;
}
