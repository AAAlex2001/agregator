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
  typical_names: string;
  sum: string;
  sum_amount_raw: number;
  date: string;
  responses_deadline: string | null;
  technical_files: string[];
  badges: OrderApiBadge[];
  status: string;
}

export interface OrdersApiList {
  items: OrderApiItem[];
  total: number;
}

export interface OrderCardData {
  id: number;
  publicId: string;
  title: string;
  customer: string;
  company: string;
  typicalNames: string;
  comment: string;
  date: string;
  sum: string;
  sumAmountRaw: number;
  deadlineRaw: string;
  responsesDeadline: string | null;
  technicalFiles: string[];
  badges: Badge[];
  badgesRaw: OrderApiBadge[];
  status: string;
}
