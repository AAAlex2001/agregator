export type ResponseStatus = "REVIEW" | "REJECTED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED";
export type ResponseTabKey = "review" | "in_progress" | "rejected" | "accepted" | "completed";
export type BadgeVariant = "blue" | "green" | "gray" | "orange" | "brown" | "purple";
export type UserRole = "expert" | "customer";

export interface ResponseBadge { text: string; variant: BadgeVariant }

export interface ResponseCounters {
  review: number;
  in_progress: number;
  rejected: number;
  accepted: number;
  completed: number;
}

export interface ResponseApiBadge { text: string; variant: string }

export interface ResponseApiItem {
  id: number;
  order_id: number;
  order_public_id: string;
  status: ResponseStatus;
  date: string;
  comment: string;
  proposed_sum: string;
  proposed_deadline: string;
  order_title: string;
  order_sum: string;
  order_date: string;
  order_comment?: string;
  customer_name: string;
  customer_company: string;
  technical_files: string[];
  response_files: string[];
  badges: ResponseApiBadge[];
  created_at: string;
  proposed_sum_amount_raw: number;
  proposed_deadline_raw: string;
  expert_name: string;
  expert_avatar_url: string | null;
  expert_rating: number | null;
  expert_review_count: number;
  expert_public_id: string;
  confirm_deadline: string;
  expert_confirmed: boolean;
  has_review: boolean;
}

export interface ResponsesApiList {
  items: ResponseApiItem[];
  total: number;
  counters: ResponseCounters;
}

export interface ResponseCardData {
  id: number;
  orderId: number;
  orderPublicId: string;
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
  orderDate: string;
  badges: ResponseBadge[];
  sum: string;
  deadline: string;
  costEstimate: string;
  commentTitle: string;
  commentText: string;
  orderComment?: string;
  rawTechSpecFiles: string[];
  techSpecFiles: string[];
  orderTechSpecFiles: string[];
  rawSumAmount: number;
  rawDeadline: string;
  expertConfirmed: boolean;
  reminderText?: string;
  expertName: string;
  expertAvatarUrl: string | null;
  expertRating: number | null;
  expertReviewCount: number;
  expertPublicId: string;
  hasReview: boolean;
}

export interface CardAction {
  text: string;
  variant: "outline" | "outlineOrange" | "secondary" | "primary" | "green" | "chat" | "transparent";
  onClick: () => void;
  isLoading?: boolean;
}
