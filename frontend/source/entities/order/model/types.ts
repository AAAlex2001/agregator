export type BadgeVariant = "blue" | "green" | "gray" | "orange" | "brown" | "purple";
import type { OrderWorkType } from "./workTypes";

export type OrderSortBy = "created_at" | "sum_amount" | "responses_deadline";

export interface Badge {
  text: string;
  variant: BadgeVariant;
}

export interface OrderApiBadge {
  text: string;
  variant: string;
}

export interface OrderDocuments {
  technical: string[];
  contract: string[];
  company: string[];
  other: string[];
}

export const MAX_ORDER_DOCUMENTS = 6;
export const MAX_ORDER_FILES_TOTAL_BYTES = 100 * 1024 * 1024;

export const DOCUMENT_LABELS = {
  technical: "Техническое задание",
  contract: "Проект договора",
  company: "Карточка предприятия",
  other: "Иное",
} as const;

export type DocumentCategory = keyof OrderDocuments;
export type SingleDocumentCategory = "technical" | "contract" | "company";

export const DOCUMENT_CATEGORIES: readonly DocumentCategory[] = ["technical", "contract", "company", "other"];
export const SINGLE_DOCUMENT_CATEGORIES: readonly SingleDocumentCategory[] = ["technical", "contract", "company"];

export function emptyDocuments(): OrderDocuments {
  return { technical: [], contract: [], company: [], other: [] };
}

export function documentPaths(documents: OrderDocuments): string[] {
  return [...documents.technical, ...documents.contract, ...documents.company, ...documents.other];
}

export function countDocuments(documents: OrderDocuments): number {
  return documents.technical.length + documents.contract.length + documents.company.length + documents.other.length;
}

export interface OrderApiItem {
  id: number;
  public_id: string;
  title: string;
  comment: string;
  customer_id: number;
  customer_name: string;
  customer_inn?: string;
  company: string;
  sum: string;
  sum_amount_raw: number;
  start_date?: string;
  date: string;
  created_at_display?: string;
  responses_deadline: string | null;
  requires_expert: boolean;
  requires_license: boolean;
  work_type: OrderWorkType;
  details?: Record<string, unknown> | null;
  documents: OrderDocuments;
  badges: OrderApiBadge[];
  status: string;
  assigned_expert_id: number | null;
  assigned_expert_name?: string;
  executor_name?: string;
  executor_avatar_url?: string | null;
  executor_rating?: number | null;
  executor_review_count?: number;
  executor_public_id?: string;
  executor_proposed_sum?: string;
  executor_proposed_start_date?: string;
  executor_proposed_deadline?: string;
  executor_comment?: string;
  executor_files?: string[];
  accepted_response_id?: number | null;
  customer_has_review?: boolean;
  previous_title?: string | null;
  previous_comment?: string | null;
  previous_sum?: string | null;
  previous_date?: string | null;
  previous_documents?: OrderDocuments | null;
  previous_badges?: OrderApiBadge[] | null;
}

export interface OrdersApiList {
  items: OrderApiItem[];
  has_more: boolean;
}

export interface OrderCardData {
  id: number;
  publicId: string;
  customerId: number;
  title: string;
  customer: string;
  customerInn: string;
  company: string;
  comment: string;
  startDate: string;
  date: string;
  createdAtDisplay: string;
  sum: string;
  sumAmountRaw: number;
  startDateRaw: string;
  deadlineRaw: string;
  responsesDeadline: string | null;
  requiresExpert: boolean;
  requiresLicense: boolean;
  workType: OrderWorkType;
  details: Record<string, unknown> | null;
  documents: OrderDocuments;
  badges: Badge[];
  badgesRaw: OrderApiBadge[];
  status: string;
  assignedExpertName: string;
  executorName: string;
  executorAvatarUrl: string | null;
  executorRating: number | null;
  executorReviewCount: number;
  executorPublicId: string;
  executorProposedSum: string;
  executorProposedStartDate: string;
  executorProposedDeadline: string;
  executorComment: string;
  executorFiles: string[];
  acceptedResponseId: number | null;
  customerHasReview: boolean;
  previousTitle?: string | null;
  previousComment?: string | null;
  previousSum?: string | null;
  previousDeadline?: string | null;
  previousDocuments?: OrderDocuments | null;
  previousBadges?: Badge[] | null;
}
