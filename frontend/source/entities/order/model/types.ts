export type BadgeVariant = "blue" | "green" | "gray" | "orange" | "brown" | "purple";

export interface Badge {
  text: string;
  variant: BadgeVariant;
}

export interface OrderApiBadge {
  text: string;
  variant: string;
}

export interface OrderApiItem {
  id: number;
  public_id: string;
  title: string;
  comment: string;
  customer_id: number;
  customer_name: string;
  company: string;
  sum: string;
  sum_amount_raw: number;
  date: string;
  created_at_display?: string;
  responses_deadline: string | null;
  technical_files: string[];
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
  executor_proposed_deadline?: string;
  executor_comment?: string;
  executor_files?: string[];
  accepted_response_id?: number | null;
  customer_has_review?: boolean;
  previous_title?: string | null;
  previous_comment?: string | null;
  previous_sum?: string | null;
  previous_date?: string | null;
  previous_technical_files?: string[] | null;
  previous_badges?: OrderApiBadge[] | null;
}

export interface OrdersApiList {
  items: OrderApiItem[];
  total: number;
}

export interface OrderCardData {
  id: number;
  publicId: string;
  customerId: number;
  title: string;
  customer: string;
  company: string;
  comment: string;
  date: string;
  createdAtDisplay: string;
  sum: string;
  sumAmountRaw: number;
  deadlineRaw: string;
  responsesDeadline: string | null;
  technicalFiles: string[];
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
  executorProposedDeadline: string;
  executorComment: string;
  executorFiles: string[];
  acceptedResponseId: number | null;
  customerHasReview: boolean;
  previousTitle?: string | null;
  previousComment?: string | null;
  previousSum?: string | null;
  previousDeadline?: string | null;
  previousTechnicalFiles?: string[] | null;
  previousBadges?: Badge[] | null;
}
