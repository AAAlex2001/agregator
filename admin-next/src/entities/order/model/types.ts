import type { BadgeTone } from "@/shared/ui/badge";

export type OrderStatus = "ACTIVE" | "ARCHIVED";

export type Order = {
  id: number;
  title: string;
  company: string;
  work_type: string;
  status: OrderStatus;
  sum_rub: number;
  deadline: string;
  customer_name: string;
  expert_name: string | null;
  created_at: string;
};

export type OrderList = {
  items: Order[];
  total: number;
};

export type OrderListQuery = {
  status: string;
  workType: string;
  query: string;
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  ACTIVE: "Активен",
  ARCHIVED: "В архиве",
};

export const ORDER_STATUS_TONES: Record<OrderStatus, BadgeTone> = {
  ACTIVE: "success",
  ARCHIVED: "neutral",
};

export const RESPONSE_STATUS_LABELS: Record<string, string> = {
  REVIEW: "На рассмотрении",
  REJECTED: "Отклонён",
  ACCEPTED: "Принят",
  IN_PROGRESS: "В работе",
  COMPLETED: "Завершён",
  WITHDRAWN_BY_EXPERT: "Отозван исполнителем",
};
