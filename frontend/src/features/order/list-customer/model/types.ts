import type { Badge } from "@/entities/order/model/types";

export interface BadgeOption {
  text: string;
  variant: string;
}

export interface OrderBadgeResponse {
  text: string;
  variant: string;
}

export interface CustomerOrderResponse {
  id: number;
  public_id: string;
  title: string;
  company: string;
  typical_names: string;
  comment: string;
  customer_id: number;
  customer_name: string;
  sum: string;
  sum_amount_raw: number;
  date: string;
  responses_deadline: string | null;
  technical_files: string[];
  badges: OrderBadgeResponse[];
  status: string;
}

export interface CustomerOrdersListResponse {
  items: CustomerOrderResponse[];
  total: number;
}

export interface CustomerOrderCardVM {
  id: number;
  publicId: string;
  title: string;
  customer: string;
  date: string;
  sum: string;
  badges: Badge[];
  status: string;
  company: string;
  typicalNames: string;
  comment: string;
  sumAmountRaw: number;
  deadline: string;
  responsesDeadline: string | null;
  technicalFiles: string[];
  badgesRaw: OrderBadgeResponse[];
}

export interface CustomerOrdersState {
  items: CustomerOrderCardVM[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

export interface CreateOrderPayload {
  title: string;
  company: string;
  typical_names: string;
  comment: string;
  customer_id: number;
  sum_amount: number;
  deadline: string;
  responses_deadline?: string;
  badges: BadgeOption[];
  files?: File[];
}

export interface UpdateOrderPayload {
  title: string;
  company: string;
  typical_names: string;
  comment: string;
  sum_amount: number;
  deadline: string;
  responses_deadline?: string;
  badges: BadgeOption[];
  files?: File[];
  keepFiles?: string[];
}
