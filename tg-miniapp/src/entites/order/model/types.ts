export interface OrderBadge {
  text: string;
  variant: string;
}

export interface OrderDocuments {
  technical: string[];
  contract: string[];
  company: string[];
  other: string[];
}

export interface Order {
  id: number;
  public_id: string;
  title: string;
  company: string;
  comment: string;
  customer_name: string;
  customer_inn: string;
  sum: string;
  sum_amount_raw: number;
  start_date: string;
  date: string;
  deadline_at: string;
  created_at: string;
  responses_deadline: string | null;
  requires_license: boolean;
  documents: OrderDocuments;
  badges: OrderBadge[];
  status: string;
}

export interface OrderList {
  items: Order[];
  has_more: boolean;
}
