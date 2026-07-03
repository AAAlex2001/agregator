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

export type VatKind = "NONE" | "VAT_5" | "VAT_7" | "VAT_22";

export const VAT_LABEL: Record<VatKind, string> = {
  NONE: "Без НДС",
  VAT_5: "НДС 5%",
  VAT_7: "НДС 7%",
  VAT_22: "НДС 22%",
};

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
  vat_kind: VatKind;
  proposed_sum_amount_raw: number;
  proposed_start_date_raw: string;
  proposed_deadline_raw: string;
  response_files: string[];
}

export interface EditResponseData {
  proposed_sum_amount: number;
  proposed_start_date: string;
  proposed_deadline: string;
  vat_kind: VatKind;
  comment: string;
  keep_files: string[];
  files: File[];
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
