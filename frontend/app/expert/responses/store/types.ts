import type { ResponseBadge } from "../components/types";

export type ResponseTabKey = "new" | "review" | "rejected" | "accepted" | "completed" | "archive";

export interface ResponseCounters {
  new: number;
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
  status: "NEW" | "REVIEW" | "REJECTED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";
  date: string;
  comment: string;
  proposed_sum: string;
  proposed_deadline: string;
  order_title: string;
  order_sum: string;
  order_date: string;
  customer_name: string;
  customer_company: string;
  technical_files: string[];
  response_files: string[];
  badges: ResponseApiBadge[];
  created_at: string;
  order_commission_amount: string;
  commission_paid: string | null;
  balance_return: string | null;
  proposed_sum_amount_raw: number;
  proposed_deadline_raw: string;
  expert_name: string;
  expert_rating: number | null;
  expert_review_count: number;
}

export interface ResponsesApiList {
  items: ResponseApiItem[];
  total: number;
  counters: ResponseCounters;
}

export interface ResponseCardViewModel {
  id: number;
  orderId: number;
  rawStatus: ResponseApiItem["status"];
  dateLabel: string;
  date: string;
  status: string;
  statusColor: string;
  statusBg: string;
  orderTitle: string;
  orderCustomerSum: string;
  customer: string;
  customerCompany: string;
  orderDate: string;
  badges: ResponseBadge[];
  sum: string;
  deadline: string;
  costEstimate: string;
  commissionText: string;
  commissionAmount: string;
  orderCommissionAmount: string;
  commentTitle: string;
  commentText: string;
  techSpecTitle?: string;
  techSpecFiles?: string[];
  rawSumAmount: number;
  rawDeadline: string;
  expertName: string;
  expertRating: number | null;
  expertReviewCount: number;
  statusMessage?: string;
  commissionStatus?: string;
  balanceReturnText?: string;
  balanceReturnAmount?: string;
  reminderText?: string;
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
  files?: File[];
  keepFiles?: string[];
}
