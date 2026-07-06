import type { OrderDocuments } from "@/source/entities/order";

export type ResponseStatus = "REVIEW" | "REJECTED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "WITHDRAWN_BY_EXPERT";
export type ResponseTabKey = "all" | "review" | "in_progress" | "rejected" | "accepted" | "withdrawn_by_expert";
export type VatKind = "NONE" | "VAT_5" | "VAT_7" | "VAT_22";

export const VAT_LABEL: Record<VatKind, string> = {
  NONE: "Без НДС",
  VAT_5: "С НДС 5%",
  VAT_7: "С НДС 7%",
  VAT_22: "С НДС 22%",
};
export type BadgeVariant = "blue" | "green" | "gray" | "orange" | "brown" | "purple";
export type UserRole = "expert" | "customer";
export type CustomerSortBy = "created_at" | "proposed_sum_amount" | "expert_rating";
export type SortDir = "asc" | "desc";

export interface ResponseBadge { text: string; variant: BadgeVariant }

export interface ResponseCounters {
  all: number;
  review: number;
  in_progress: number;
  rejected: number;
  accepted: number;
  withdrawn_by_expert: number;
}

export interface ResponseApiBadge { text: string; variant: string }

export interface ResponseApiItem {
  id: number;
  order_id: number;
  expert_id?: number;
  order_public_id: string;
  order_customer_id?: number;
  status: ResponseStatus;
  date: string;
  comment: string;
  proposed_sum: string;
  proposed_start_date?: string;
  proposed_deadline: string;
  order_title: string;
  order_sum: string;
  order_start_date?: string;
  order_date: string;
  order_comment?: string;
  customer_name: string;
  customer_company: string;
  customer_inn?: string;
  order_documents: OrderDocuments;
  response_files: string[];
  badges: ResponseApiBadge[];
  created_at: string;
  proposed_sum_amount_raw: number;
  proposed_start_date_raw?: string;
  proposed_deadline_raw: string;
  previous_comment?: string | null;
  previous_proposed_sum?: string | null;
  previous_proposed_start_date?: string | null;
  previous_proposed_deadline?: string | null;
  previous_vat_kind?: VatKind | null;
  previous_response_files?: string[] | null;
  order_previous_title?: string | null;
  order_previous_comment?: string | null;
  order_previous_sum?: string | null;
  order_previous_date?: string | null;
  order_previous_documents?: OrderDocuments | null;
  order_previous_badges?: ResponseApiBadge[] | null;
  expert_name: string;
  expert_avatar_url: string | null;
  expert_rating: number | null;
  expert_review_count: number;
  expert_public_id: string;
  confirm_deadline: string;
  expert_confirmed: boolean;
  has_review: boolean;
  rejection_reason?: string | null;
  expert_company_name?: string;
  expert_inn?: string | null;
  vat_kind?: VatKind;
  order_locked?: boolean;
}

export interface ResponsesApiList {
  items: ResponseApiItem[];
  has_more: boolean;
  counters: ResponseCounters;
}

export interface ResponseCardData {
  id: number;
  orderId: number;
  expertId: number;
  orderPublicId: string;
  orderCustomerId: number;
  rawStatus: ResponseStatus;
  dateLabel: string;
  date: string;
  status: string;
  statusColor: string;
  statusBg: string;
  statusMessage?: string;
  orderTitle: string;
  orderSum: string;
  customer: string;
  customerInn: string;
  orderStartDate: string;
  orderDate: string;
  badges: ResponseBadge[];
  sum: string;
  startDate: string;
  deadline: string;
  previousSum: string | null;
  previousStartDate: string | null;
  previousDeadline: string | null;
  previousCostEstimate: string | null;
  previousComment: string | null;
  previousTechSpecFiles: string[] | null;
  previousOrderTitle: string | null;
  previousOrderComment: string | null;
  previousOrderSum: string | null;
  previousOrderDate: string | null;
  previousOrderDocuments: OrderDocuments | null;
  previousOrderBadges: ResponseBadge[] | null;
  costEstimate: string;
  commentTitle: string;
  commentText: string;
  orderComment?: string;
  rawTechSpecFiles: string[];
  techSpecFiles: string[];
  orderDocuments: OrderDocuments;
  rawSumAmount: number;
  rawStartDate: string;
  rawDeadline: string;
  expertConfirmed: boolean;
  reminderText?: string;
  expertName: string;
  expertAvatarUrl: string | null;
  expertRating: number | null;
  expertReviewCount: number;
  expertPublicId: string;
  hasReview: boolean;
  rejectionReason?: string | null;
  expertCompanyName?: string;
  expertInn?: string | null;
  vatKind: VatKind;
  vatLabel: string;
  orderLocked: boolean;
}

export interface CardAction {
  text: string;
  variant: "outline" | "outlineOrange" | "secondary" | "primary" | "green" | "chat" | "transparent" | "danger";
  onClick: () => void;
  isLoading?: boolean;
}
